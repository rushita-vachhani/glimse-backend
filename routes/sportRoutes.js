import express from 'express';
import {
  getAllSports,
  createSport,
  deleteSport,
} from '../controllers/sportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllSports).post(protect, authorize('admin'), createSport);

router.route('/:id').delete(protect, authorize('admin'), deleteSport);
export default router;