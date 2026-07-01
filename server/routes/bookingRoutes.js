import express from 'express';
import {
  approveBooking,
  checkAvailability,
  createBooking,
  getAllBookings,
  getMyBookings,
  rejectBooking
} from '../controllers/bookingController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.patch('/:id/approve', protect, authorize('admin'), approveBooking);
router.patch('/:id/reject', protect, authorize('admin'), rejectBooking);
router.get('/check-availability', protect, checkAvailability);

export default router;
