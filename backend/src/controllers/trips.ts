import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

export const getTripSummaryController = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const tripsResult = await db.query(
      'SELECT id, title, destination, start_date, end_date, status, total_budget, currency FROM trips WHERE user_id = $1',
      [userId]
    );
    const budgetResult = await db.query(
      'SELECT bi.amount, bi.category FROM budget_items bi INNER JOIN trips t ON t.id = bi.trip_id WHERE t.user_id = $1',
      [userId]
    );

    const trips = tripsResult.rows;
    const destinations = new Set(trips.map((trip: any) => String(trip.destination || '').toLowerCase()).filter(Boolean));
    const totalBudget = trips.reduce((sum: number, trip: any) => sum + Number(trip.total_budget || 0), 0);
    const totalSpent = budgetResult.rows.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

    const categoryTotals = budgetResult.rows.reduce((acc: Record<string, number>, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    sendSuccess(res, {
      trips: trips.length,
      destinations: destinations.size,
      totalBudget,
      totalSpent,
      currency: trips[0]?.currency || 'USD',
      upcoming: trips.filter((trip: any) => new Date(trip.start_date) > new Date()).length,
      active: trips.filter((trip: any) => new Date(trip.start_date) <= new Date() && new Date(trip.end_date) >= new Date()).length,
      past: trips.filter((trip: any) => new Date(trip.end_date) < new Date()).length,
      categoryTotals: Object.entries(categoryTotals).map(([name, value]) => ({ name, value })),
      recentTrips: trips.slice(0, 5).map((trip: any) => ({
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        status: trip.status,
        totalBudget: Number(trip.total_budget || 0),
      })),
    });
  } catch (error) {
    console.error('Get trip summary error:', error);
    sendError(res, 'Failed to get trip summary', 500);
  }
};

export const createTripController = async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { title, destination, startDate, endDate, description, imageUrl, totalBudget, currency } = req.body;
    const tripId = uuidv4();

    const result = await db.query(
      'INSERT INTO trips (id, user_id, title, destination, start_date, end_date, description, image_url, total_budget, currency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, title, destination, start_date, end_date, description, image_url, status, total_budget, currency, created_at',
      [tripId, userId, title, destination, startDate, endDate, description, imageUrl, totalBudget, currency || 'USD']
    );

    const trip = result.rows[0];
    sendSuccess(res, {
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      description: trip.description,
      imageUrl: trip.image_url,
      status: trip.status,
      totalBudget: trip.total_budget,
      currency: trip.currency,
      createdAt: trip.created_at,
    }, 201);
  } catch (error) {
    console.error('Create trip error:', error);
    sendError(res, 'Failed to create trip', 500);
  }
};

export const getTripsController = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let query = 'SELECT id, title, destination, start_date, end_date, description, image_url, status, total_budget, currency, created_at FROM trips WHERE user_id = $1';
    const params = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY start_date DESC';

    const result = await db.query(query, params);

  const trips = result.rows.map((trip: any) => ({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      description: trip.description,
      imageUrl: trip.image_url,
      status: trip.status,
      totalBudget: trip.total_budget,
      currency: trip.currency,
      createdAt: trip.created_at,
    }));

    sendSuccess(res, trips);
  } catch (error) {
    console.error('Get trips error:', error);
    sendError(res, 'Failed to get trips', 500);
  }
};

export const getTripController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const result = await db.query(
      'SELECT id, title, destination, start_date, end_date, description, image_url, status, total_budget, currency, created_at FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const trip = result.rows[0];

    // Get budget items
    const budgetResult = await db.query(
      'SELECT id, category, amount, date, description FROM budget_items WHERE trip_id = $1 ORDER BY date',
      [tripId]
    );

    // Get itinerary
    const itineraryResult = await db.query(
      'SELECT id, title, description, time, date, location, type FROM itinerary_items WHERE trip_id = $1 ORDER BY date, time',
      [tripId]
    );

    // Get packing list
    const packingResult = await db.query(
      'SELECT id, name, packed, category FROM packing_items WHERE trip_id = $1 ORDER BY category, name',
      [tripId]
    );

    // Get notes
    const notesResult = await db.query(
      'SELECT id, title, content, created_at FROM trip_notes WHERE trip_id = $1 ORDER BY created_at DESC',
      [tripId]
    );

    sendSuccess(res, {
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      description: trip.description,
      imageUrl: trip.image_url,
      status: trip.status,
      totalBudget: trip.total_budget,
      currency: trip.currency,
      budget: {
        total: trip.total_budget,
        currency: trip.currency,
        items: budgetResult.rows.map((item: any) => ({
          id: item.id,
          category: item.category,
          amount: parseFloat(item.amount),
          date: item.date,
          description: item.description,
        })),
      },
      itinerary: itineraryResult.rows.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        time: item.time,
        date: item.date,
        location: item.location,
        type: item.type,
      })),
      packingList: packingResult.rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        packed: item.packed,
        category: item.category,
      })),
      notes: notesResult.rows.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
      })),
      createdAt: trip.created_at,
    });
  } catch (error) {
    console.error('Get trip error:', error);
    sendError(res, 'Failed to get trip', 500);
  }
};

export const updateTripController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;
    const { title, destination, startDate, endDate, description, imageUrl, status, totalBudget, currency } = req.body;

    const result = await db.query(
      'UPDATE trips SET title = COALESCE($1, title), destination = COALESCE($2, destination), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), description = COALESCE($5, description), image_url = COALESCE($6, image_url), status = COALESCE($7, status), total_budget = COALESCE($8, total_budget), currency = COALESCE($9, currency), updated_at = CURRENT_TIMESTAMP WHERE id = $10 AND user_id = $11 RETURNING id, title, destination, start_date, end_date, description, image_url, status, total_budget, currency',
      [title, destination, startDate, endDate, description, imageUrl, status, totalBudget, currency, tripId, userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const trip = result.rows[0];
    sendSuccess(res, {
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      description: trip.description,
      imageUrl: trip.image_url,
      status: trip.status,
      totalBudget: trip.total_budget,
      currency: trip.currency,
    });
  } catch (error) {
    console.error('Update trip error:', error);
    sendError(res, 'Failed to update trip', 500);
  }
};

export const deleteTripController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const result = await db.query('DELETE FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);

    if (result.rowCount === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    sendSuccess(res, { message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    sendError(res, 'Failed to delete trip', 500);
  }
};

export const validateCreateTrip = [
  body('title').notEmpty().withMessage('Title is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
];
