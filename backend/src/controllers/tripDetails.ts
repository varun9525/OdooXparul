import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

// Budget Controllers
export const addBudgetItemController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;
    const { category, amount, date, description } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const itemId = uuidv4();
    const result = await db.query(
      'INSERT INTO budget_items (id, trip_id, category, amount, date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, category, amount, date, description',
      [itemId, tripId, category, amount, date, description]
    );

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      category: item.category,
      amount: parseFloat(item.amount),
      date: item.date,
      description: item.description,
    }, 201);
  } catch (error) {
    console.error('Add budget item error:', error);
    sendError(res, 'Failed to add budget item', 500);
  }
};

export const deleteBudgetItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query('DELETE FROM budget_items WHERE id = $1 AND trip_id = $2', [itemId, tripId]);

    if (result.rowCount === 0) {
      return sendError(res, 'Budget item not found', 404);
    }

    sendSuccess(res, { message: 'Budget item deleted' });
  } catch (error) {
    console.error('Delete budget item error:', error);
    sendError(res, 'Failed to delete budget item', 500);
  }
};

export const updateBudgetItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;
    const { category, amount, date, description } = req.body;

    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query(
      'UPDATE budget_items SET category = $1, amount = $2, date = $3, description = $4 WHERE id = $5 AND trip_id = $6 RETURNING id, category, amount, date, description',
      [category, amount, date, description, itemId, tripId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Budget item not found', 404);
    }

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      category: item.category,
      amount: parseFloat(item.amount),
      date: item.date,
      description: item.description,
    });
  } catch (error) {
    console.error('Update budget item error:', error);
    sendError(res, 'Failed to update budget item', 500);
  }
};

// Itinerary Controllers
export const addItineraryItemController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;
    const { title, description, time, date, location, type } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const itemId = uuidv4();
    const result = await db.query(
      'INSERT INTO itinerary_items (id, trip_id, title, description, time, date, location, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title, description, time, date, location, type',
      [itemId, tripId, title, description, time, date, location, type]
    );

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      title: item.title,
      description: item.description,
      time: item.time,
      date: item.date,
      location: item.location,
      type: item.type,
    }, 201);
  } catch (error) {
    console.error('Add itinerary item error:', error);
    sendError(res, 'Failed to add itinerary item', 500);
  }
};

export const deleteItineraryItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query('DELETE FROM itinerary_items WHERE id = $1 AND trip_id = $2', [itemId, tripId]);

    if (result.rowCount === 0) {
      return sendError(res, 'Itinerary item not found', 404);
    }

    sendSuccess(res, { message: 'Itinerary item deleted' });
  } catch (error) {
    console.error('Delete itinerary item error:', error);
    sendError(res, 'Failed to delete itinerary item', 500);
  }
};

export const updateItineraryItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;
    const { title, description, time, date, location, type } = req.body;

    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query(
      'UPDATE itinerary_items SET title = $1, description = $2, time = $3, date = $4, location = $5, type = $6 WHERE id = $7 AND trip_id = $8 RETURNING id, title, description, time, date, location, type',
      [title, description, time, date, location, type, itemId, tripId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Itinerary item not found', 404);
    }

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      title: item.title,
      description: item.description,
      time: item.time,
      date: item.date,
      location: item.location,
      type: item.type,
    });
  } catch (error) {
    console.error('Update itinerary item error:', error);
    sendError(res, 'Failed to update itinerary item', 500);
  }
};

// Packing List Controllers
export const addPackingItemController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;
    const { name, category } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const itemId = uuidv4();
    const result = await db.query(
      'INSERT INTO packing_items (id, trip_id, name, category, packed) VALUES ($1, $2, $3, $4, false) RETURNING id, name, packed, category',
      [itemId, tripId, name, category]
    );

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      name: item.name,
      packed: item.packed,
      category: item.category,
    }, 201);
  } catch (error) {
    console.error('Add packing item error:', error);
    sendError(res, 'Failed to add packing item', 500);
  }
};

export const updatePackingItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;
    const { packed } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query(
      'UPDATE packing_items SET packed = $1 WHERE id = $2 AND trip_id = $3 RETURNING id, name, packed, category',
      [packed, itemId, tripId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Packing item not found', 404);
    }

    const item = result.rows[0];
    sendSuccess(res, {
      id: item.id,
      name: item.name,
      packed: item.packed,
      category: item.category,
    });
  } catch (error) {
    console.error('Update packing item error:', error);
    sendError(res, 'Failed to update packing item', 500);
  }
};

export const deletePackingItemController = async (req: any, res: Response) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.userId;

    // Check if trip belongs to user
    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query('DELETE FROM packing_items WHERE id = $1 AND trip_id = $2', [itemId, tripId]);

    if (result.rowCount === 0) {
      return sendError(res, 'Packing item not found', 404);
    }

    sendSuccess(res, { message: 'Packing item deleted' });
  } catch (error) {
    console.error('Delete packing item error:', error);
    sendError(res, 'Failed to delete packing item', 500);
  }
};

// Notes Controllers
export const addNoteController = async (req: any, res: Response) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;
    const { title, content } = req.body;

    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    if (!title || !content) {
      return sendError(res, 'Title and content are required', 400);
    }

    const noteId = uuidv4();
    const result = await db.query(
      'INSERT INTO trip_notes (id, trip_id, title, content) VALUES ($1, $2, $3, $4) RETURNING id, title, content, created_at',
      [noteId, tripId, title, content]
    );

    const note = result.rows[0];
    sendSuccess(res, {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.created_at,
    }, 201);
  } catch (error) {
    console.error('Add note error:', error);
    sendError(res, 'Failed to add note', 500);
  }
};

export const deleteNoteController = async (req: any, res: Response) => {
  try {
    const { tripId, noteId } = req.params;
    const userId = req.userId;

    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    const result = await db.query('DELETE FROM trip_notes WHERE id = $1 AND trip_id = $2', [noteId, tripId]);

    if (result.rowCount === 0) {
      return sendError(res, 'Note not found', 404);
    }

    sendSuccess(res, { message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    sendError(res, 'Failed to delete note', 500);
  }
};

export const updateNoteController = async (req: any, res: Response) => {
  try {
    const { tripId, noteId } = req.params;
    const userId = req.userId;
    const { title, content } = req.body;

    const tripCheck = await db.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
    if (tripCheck.rows.length === 0) {
      return sendError(res, 'Trip not found', 404);
    }

    if (!title || !content) {
      return sendError(res, 'Title and content are required', 400);
    }

    const result = await db.query(
      'UPDATE trip_notes SET title = $1, content = $2 WHERE id = $3 AND trip_id = $4 RETURNING id, title, content, created_at',
      [title, content, noteId, tripId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Note not found', 404);
    }

    const note = result.rows[0];
    sendSuccess(res, {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.created_at,
    });
  } catch (error) {
    console.error('Update note error:', error);
    sendError(res, 'Failed to update note', 500);
  }
};
