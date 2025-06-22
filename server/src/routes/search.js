import express from 'express';
import { searchProducts } from '../controllers/searchController.js';
import { validateSearchQuery } from '../middleware/validation.js';

const router = express.Router();

// GET /api/search?q=<query>&category=<category>&minPrice=<price>&maxPrice=<price>
router.get('/', validateSearchQuery, searchProducts);

export default router;