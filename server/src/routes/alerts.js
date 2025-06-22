import express from 'express';
import { 
  createPriceAlert, 
  getPriceAlerts, 
  deactivatePriceAlert 
} from '../controllers/alertsController.js';
import { validatePriceAlert } from '../middleware/validation.js';

const router = express.Router();

// POST /api/alerts - Create a new price alert
router.post('/', validatePriceAlert, createPriceAlert);

// GET /api/alerts?email=user@example.com - Get user's active alerts
router.get('/', getPriceAlerts);

// DELETE /api/alerts/:id - Deactivate a price alert
router.delete('/:id', deactivatePriceAlert);

export default router;