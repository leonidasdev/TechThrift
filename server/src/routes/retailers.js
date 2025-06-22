import express from 'express';
import { getRetailers, getRetailerStatus } from '../controllers/retailersController.js';

const router = express.Router();

// GET /api/retailers - Get all supported retailers
router.get('/', getRetailers);

// GET /api/retailers/status - Get status of all retailers
router.get('/status', getRetailerStatus);

export default router;