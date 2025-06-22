import { scrapingScheduler } from '../scraper/scheduler.js';
import { scraperService } from '../scraper/scraperService.js';
import { database } from '../database/database.js';
import { logger } from '../utils/logger.js';

export const getScrapingStatus = async (req, res) => {
  try {
    const status = scrapingScheduler.getStatus();
    const stats = await scraperService.getScrapingStats();
    
    res.json({
      success: true,
      scheduler: status,
      scraper: stats,
      database: {
        totalProducts: database.db.prepare('SELECT COUNT(*) as count FROM products').get().count,
        totalPrices: database.db.prepare('SELECT COUNT(*) as count FROM product_prices').get().count,
        lastUpdate: database.db.prepare('SELECT MAX(scraped_at) as last_update FROM product_prices').get().last_update
      }
    });
  } catch (error) {
    logger.error('Error getting scraping status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scraping status',
      message: error.message
    });
  }
};

export const getScrapingJobs = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const jobs = database.getScrapingJobs(status, parseInt(limit));
    
    res.json({
      success: true,
      jobs,
      total: jobs.length
    });
  } catch (error) {
    logger.error('Error getting scraping jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scraping jobs',
      message: error.message
    });
  }
};

export const getScrapingStats = async (req, res) => {
  try {
    const stats = database.getStatistics();
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    logger.error('Error getting scraping stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scraping statistics',
      message: error.message
    });
  }
};

export const triggerScraping = async (req, res) => {
  try {
    const { type, retailer, query } = req.body;
    
    let result;
    
    switch (type) {
      case 'full':
        result = await scrapingScheduler.triggerFullScrape();
        break;
      case 'popular':
        result = await scrapingScheduler.triggerPopularScrape();
        break;
      case 'retailer':
        if (!retailer) {
          return res.status(400).json({
            success: false,
            error: 'Retailer is required for retailer scraping'
          });
        }
        result = await scraperService.scrapeRetailer(retailer, { query });
        break;
      case 'search':
        if (!query) {
          return res.status(400).json({
            success: false,
            error: 'Query is required for search scraping'
          });
        }
        result = await scraperService.scrapeAllRetailers(query);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid scraping type. Use: full, popular, retailer, or search'
        });
    }
    
    res.json({
      success: true,
      message: `${type} scraping triggered successfully`,
      result
    });
  } catch (error) {
    logger.error('Error triggering scraping:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger scraping',
      message: error.message
    });
  }
};