import { Router } from 'express';
import db from '../config/database.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

const router = Router();

router.get('/trips/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const tripResult = await db.query(
      'SELECT id, title, destination, start_date, end_date, description, image_url, status, total_budget, currency FROM trips WHERE id = $1',
      [tripId]
    );

    if (tripResult.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const itineraryResult = await db.query(
      'SELECT id, title, description, time, date, location, type FROM itinerary_items WHERE trip_id = $1 ORDER BY date, time',
      [tripId]
    );

    const trip = tripResult.rows[0];
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
      itinerary: itineraryResult.rows,
    });
  } catch (error) {
    console.error('Get public trip error:', error);
    sendError(res, 'Failed to get shared trip', 500);
  }
});

export default router;
