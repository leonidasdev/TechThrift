import express from 'express';
import { 
  getScrapingStatus, 
  triggerScraping, 
  getScrapingJobs,
  getScrapingStats 
} from '../controllers/scraperController.js';
import { validateScrapingRequest } from '../middleware/validation.js';

const router = express.Router();

// GET /api/scraper/status - Get scraping scheduler status
router.get('/status', getScrapingStatus);

// GET /api/scraper/jobs - Get scraping job history
router.get('/jobs', getScrapingJobs);

// GET /api/scraper/stats - Get scraping statistics
router.get('/stats', getScrapingStats);

// POST /api/scraper/trigger - Manually trigger scraping
router.post('/trigger', validateScrapingRequest, triggerScraping);

export default router;