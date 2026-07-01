import express from 'express';
import {
  createResource,
  deactivateResource,
  deleteResource,
  getResourceById,
  getResources,
  toggleResourceActive,
  updateResource
} from '../controllers/resourceController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, authorize('admin'), createResource);
router.put('/:id', protect, authorize('admin'), updateResource);
router.patch('/:id/toggle-active', protect, authorize('admin'), toggleResourceActive);
router.patch('/:id/deactivate', protect, authorize('admin'), deactivateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

export default router;
