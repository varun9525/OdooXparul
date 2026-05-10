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
  updateBudgetItemController,
  addItineraryItemController,
  deleteItineraryItemController,
  updateItineraryItemController,
  addPackingItemController,
  updatePackingItemController,
  deletePackingItemController,
  addNoteController,
  deleteNoteController,
  updateNoteController,
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
router.put('/:tripId/budget/:itemId', updateBudgetItemController);

// Itinerary routes
router.post('/:tripId/itinerary', addItineraryItemController);
router.delete('/:tripId/itinerary/:itemId', deleteItineraryItemController);
router.put('/:tripId/itinerary/:itemId', updateItineraryItemController);

// Packing list routes
router.post('/:tripId/packing', addPackingItemController);
router.put('/:tripId/packing/:itemId', updatePackingItemController);
router.delete('/:tripId/packing/:itemId', deletePackingItemController);

// Notes routes
router.post('/:tripId/notes', addNoteController);
router.delete('/:tripId/notes/:noteId', deleteNoteController);
router.put('/:tripId/notes/:noteId', updateNoteController);

export default router;
