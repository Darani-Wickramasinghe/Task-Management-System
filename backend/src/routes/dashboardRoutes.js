import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);

export default router;
