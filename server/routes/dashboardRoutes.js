import express from 'express';
import { adminStats, userStats } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin-stats', protect, authorize('admin'), adminStats);
router.get('/user-stats', protect, userStats);

export default router;
