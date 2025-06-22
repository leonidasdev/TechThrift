import express from 'express';
import { scraperService } from '../scraper/scraperService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/products?q=searchTerm - Search products from JSON files
router.get('/', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing search query',
        message: 'Please provide a search query using the "q" parameter'
      });
    }

    if (query.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Query too long',
        message: 'Search query must be less than 200 characters'
      });
    }

    logger.info(`Product search request: query="${query}"`);
    
    const startTime = Date.now();
    const products = await scraperService.searchProducts(query.trim());
    const searchTime = Date.now() - startTime;
    
    logger.info(`Product search completed: ${products.length} results in ${searchTime}ms`);
    
    res.json({
      success: true,
      query: query.trim(),
      totalResults: products.length,
      searchTime: `${searchTime}ms`,
      results: products
    });
    
  } catch (error) {
    logger.error('Product search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// GET /api/products/stats - Get scraping statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await scraperService.getScrapingStats();
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    logger.error('Error getting product stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

export default router;