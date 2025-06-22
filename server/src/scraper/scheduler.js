import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import { database } from '../database/database.js';
import { scraperService } from './scraperService.js';
import { priceAlertService } from '../services/priceAlertService.js';

class ScrapingScheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      logger.warn('Scraping scheduler is already running');
      return;
    }

    logger.info('Starting scraping scheduler...');
    this.isRunning = true;

    // Schedule full product catalog scraping every 6 hours
    this.jobs.set('full-scrape', cron.schedule('0 */6 * * *', async () => {
      logger.info('Starting scheduled full catalog scrape');
      await this.runFullScrape();
    }, {
      scheduled: false,
      timezone: 'Europe/Madrid'
    }));

    // Schedule popular products scraping every 2 hours
    this.jobs.set('popular-scrape', cron.schedule('0 */2 * * *', async () => {
      logger.info('Starting scheduled popular products scrape');
      await this.runPopularProductsScrape();
    }, {
      scheduled: false,
      timezone: 'Europe/Madrid'
    }));

    // Schedule price alerts check every 30 minutes
    this.jobs.set('price-alerts', cron.schedule('*/30 * * * *', async () => {
      logger.info('Checking price alerts');
      await this.checkPriceAlerts();
    }, {
      scheduled: false,
      timezone: 'Europe/Madrid'
    }));

    // Schedule database cleanup every day at 2 AM
    this.jobs.set('cleanup', cron.schedule('0 2 * * *', async () => {
      logger.info('Running database cleanup');
      await this.runDatabaseCleanup();
    }, {
      scheduled: false,
      timezone: 'Europe/Madrid'
    }));

    // Start all scheduled jobs
    this.jobs.forEach((job, name) => {
      job.start();
      logger.info(`Scheduled job '${name}' started`);
    });

    // Run initial scrape for popular products
    setTimeout(() => {
      this.runPopularProductsScrape();
    }, 5000);

    logger.info('Scraping scheduler started successfully');
  }

  stop() {
    if (!this.isRunning) {
      logger.warn('Scraping scheduler is not running');
      return;
    }

    logger.info('Stopping scraping scheduler...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Scheduled job '${name}' stopped`);
    });

    this.jobs.clear();
    this.isRunning = false;
    
    logger.info('Scraping scheduler stopped');
  }

  async runFullScrape() {
    const jobId = database.createScrapingJob({
      job_type: 'full_scrape',
      retailer_id: 'all',
      search_query: null
    });

    try {
      database.updateScrapingJob(jobId, {
        status: 'running',
        started_at: new Date().toISOString()
      });

      const retailers = ['amazon', 'pccomponentes', 'mediamarkt', 'elcorteingles'];
      const categories = [
        'smartphones', 'laptops', 'tablets', 'headphones', 'gaming',
        'cameras', 'smartwatches', 'speakers', 'monitors', 'keyboards'
      ];

      let totalProductsFound = 0;
      let totalPricesUpdated = 0;

      for (const retailer of retailers) {
        for (const category of categories) {
          try {
            logger.info(`Scraping ${retailer} for category: ${category}`);
            
            const results = await scraperService.scrapeRetailer(retailer, {
              category,
              limit: 50
            });

            totalProductsFound += results.products.length;
            totalPricesUpdated += results.prices.length;

            // Add delay between requests to be respectful
            await this.delay(2000);
          } catch (error) {
            logger.error(`Error scraping ${retailer} for ${category}:`, error);
          }
        }
      }

      database.updateScrapingJob(jobId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        products_found: totalProductsFound,
        prices_updated: totalPricesUpdated
      });

      logger.info(`Full scrape completed: ${totalProductsFound} products, ${totalPricesUpdated} prices`);
    } catch (error) {
      logger.error('Full scrape failed:', error);
      database.updateScrapingJob(jobId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error.message
      });
    }
  }

  async runPopularProductsScrape() {
    const jobId = database.createScrapingJob({
      job_type: 'popular_products',
      retailer_id: 'all',
      search_query: 'popular'
    });

    try {
      database.updateScrapingJob(jobId, {
        status: 'running',
        started_at: new Date().toISOString()
      });

      // Get popular search terms from database
      const popularSearches = database.getPopularSearches(20);
      const defaultSearches = [
        'iPhone 15', 'Samsung Galaxy S24', 'MacBook Air', 'PlayStation 5',
        'Nintendo Switch', 'AirPods Pro', 'iPad', 'Dell XPS', 'RTX 4080',
        'Sony WH-1000XM5'
      ];

      const searchTerms = popularSearches.length > 0 
        ? popularSearches.map(s => s.query)
        : defaultSearches;

      let totalProductsFound = 0;
      let totalPricesUpdated = 0;

      for (const searchTerm of searchTerms) {
        try {
          logger.info(`Scraping popular products for: ${searchTerm}`);
          
          const results = await scraperService.scrapeAllRetailers(searchTerm, {
            limit: 10
          });

          totalProductsFound += results.totalProducts;
          totalPricesUpdated += results.totalPrices;

          // Add delay between searches
          await this.delay(3000);
        } catch (error) {
          logger.error(`Error scraping popular products for ${searchTerm}:`, error);
        }
      }

      database.updateScrapingJob(jobId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        products_found: totalProductsFound,
        prices_updated: totalPricesUpdated
      });

      logger.info(`Popular products scrape completed: ${totalProductsFound} products, ${totalPricesUpdated} prices`);
    } catch (error) {
      logger.error('Popular products scrape failed:', error);
      database.updateScrapingJob(jobId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error.message
      });
    }
  }

  async checkPriceAlerts() {
    try {
      const triggeredAlerts = database.checkPriceAlerts();
      
      if (triggeredAlerts.length > 0) {
        logger.info(`Found ${triggeredAlerts.length} triggered price alerts`);
        
        for (const alert of triggeredAlerts) {
          await priceAlertService.sendPriceAlert(alert);
          
          // Mark alert as triggered
          database.updatePriceAlert(alert.id, {
            triggered_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      logger.error('Error checking price alerts:', error);
    }
  }

  async runDatabaseCleanup() {
    try {
      logger.info('Starting database cleanup...');
      
      // Remove old price data (older than 30 days)
      const oldPricesDeleted = database.db.prepare(`
        DELETE FROM product_prices 
        WHERE scraped_at < datetime('now', '-30 days')
      `).run().changes;

      // Remove old search history (older than 90 days)
      const oldSearchesDeleted = database.db.prepare(`
        DELETE FROM search_history 
        WHERE created_at < datetime('now', '-90 days')
      `).run().changes;

      // Remove completed scraping jobs (older than 7 days)
      const oldJobsDeleted = database.db.prepare(`
        DELETE FROM scraping_jobs 
        WHERE status = 'completed' 
        AND completed_at < datetime('now', '-7 days')
      `).run().changes;

      // Vacuum database to reclaim space
      database.db.exec('VACUUM');

      logger.info(`Database cleanup completed: ${oldPricesDeleted} old prices, ${oldSearchesDeleted} old searches, ${oldJobsDeleted} old jobs removed`);
    } catch (error) {
      logger.error('Database cleanup failed:', error);
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.jobs.keys()),
      nextRuns: Array.from(this.jobs.entries()).map(([name, job]) => ({
        name,
        nextRun: job.nextDate()?.toISOString()
      }))
    };
  }

  // Manual trigger methods
  async triggerFullScrape() {
    if (!this.isRunning) {
      throw new Error('Scheduler is not running');
    }
    
    logger.info('Manually triggering full scrape');
    return this.runFullScrape();
  }

  async triggerPopularScrape() {
    if (!this.isRunning) {
      throw new Error('Scheduler is not running');
    }
    
    logger.info('Manually triggering popular products scrape');
    return this.runPopularProductsScrape();
  }
}

export const scrapingScheduler = new ScrapingScheduler();

// Start scheduler if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapingScheduler.start();
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down scheduler...');
    scrapingScheduler.stop();
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down scheduler...');
    scrapingScheduler.stop();
    process.exit(0);
  });
}