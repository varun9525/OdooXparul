import { Router } from 'express';
import {
  createTripController,
  getTripsController,
  getTripController,
  getTripSummaryController,
  updateTripController,
  deleteTripController,
  validateCreateTrip,
} from '../controllers/trips.js';
import {
  addBudgetItemController,
  deleteBudgetItemController,
  addItineraryItemController,
  deleteItineraryItemController,
  addPackingItemController,
  updatePackingItemController,
  deletePackingItemController,
  addNoteController,
  deleteNoteController,
} from '../controllers/tripDetails.js';

const router = Router();

// Trip routes
router.post('/', validateCreateTrip, createTripController);
router.get('/', getTripsController);
router.get('/stats/summary', getTripSummaryController);
router.get('/:tripId', getTripController);
router.put('/:tripId', updateTripController);
router.delete('/:tripId', deleteTripController);

// Budget routes
router.post('/:tripId/budget', addBudgetItemController);
router.delete('/:tripId/budget/:itemId', deleteBudgetItemController);

// Itinerary routes
router.post('/:tripId/itinerary', addItineraryItemController);
router.delete('/:tripId/itinerary/:itemId', deleteItineraryItemController);

// Packing list routes
router.post('/:tripId/packing', addPackingItemController);
router.put('/:tripId/packing/:itemId', updatePackingItemController);
router.delete('/:tripId/packing/:itemId', deletePackingItemController);

// Notes routes
router.post('/:tripId/notes', addNoteController);
router.delete('/:tripId/notes/:noteId', deleteNoteController);

export default router;
