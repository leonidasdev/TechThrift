import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import searchRoutes from './routes/search.js';
import retailersRoutes from './routes/retailers.js';
import scraperRoutes from './routes/scraper.js';
import alertsRoutes from './routes/alerts.js';
import productsRoutes from './routes/products.js';

// Import middleware and utilities
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/validation.js';
import { logger, httpLogger } from './utils/logger.js';
import { helmetConfig, corsConfig, generalRateLimit } from './utils/security.js';
import { database } from './database/database.js';
import { scrapingScheduler } from './scraper/scheduler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Ensure required directories exist
import fs from 'fs';
const requiredDirs = [
  path.join(__dirname, '../data'),
  path.join(__dirname, '../logs'),
  path.join(__dirname, '../uploads')
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
});

// Security middleware (must be first)
app.use(helmetConfig);
app.use(corsConfig);
app.use(compression());

// Rate limiting
app.use(generalRateLimit);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// HTTP request logging
app.use(httpLogger);

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  const stats = database.getStatistics();
  const schedulerStatus = scrapingScheduler.getStatus();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    database: {
      connected: true,
      products: stats.total_products || 0,
      prices: stats.total_prices || 0
    },
    scheduler: {
      running: schedulerStatus.isRunning,
      activeJobs: schedulerStatus.activeJobs?.length || 0
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

// API routes
app.use('/api/search', searchRoutes);
app.use('/api/retailers', retailersRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/products', productsRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Spanish Retailers Price Comparison API',
    version: process.env.npm_package_version || '1.0.0',
    description: 'Production-ready API for comparing prices across major Spanish retailers',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      products: {
        'GET /api/products?q=searchTerm': 'Search products from scraped JSON data',
        'GET /api/products/stats': 'Get scraping statistics'
      },
      search: {
        'GET /api/search?q=query': 'Search products across all retailers',
        'GET /api/search?q=laptop&minPrice=500&maxPrice=1000': 'Search with filters'
      },
      retailers: {
        'GET /api/retailers': 'Get all supported retailers',
        'GET /api/retailers/status': 'Get retailer availability status'
      },
      scraper: {
        'GET /api/scraper/status': 'Get scraping scheduler status',
        'GET /api/scraper/jobs': 'Get scraping job history',
        'GET /api/scraper/stats': 'Get scraping statistics',
        'POST /api/scraper/trigger': 'Manually trigger scraping'
      },
      alerts: {
        'POST /api/alerts': 'Create a price alert',
        'GET /api/alerts?email=user@example.com': 'Get user price alerts',
        'DELETE /api/alerts/:id': 'Deactivate a price alert'
      },
      utility: {
        'GET /api/health': 'Health check and system status',
        'GET /api': 'API documentation'
      }
    },
    features: [
      'Multi-retailer product search from JSON files',
      'Scheduled web scraping with duplicate prevention',
      'Price alerts and notifications',
      'Real-time price tracking',
      'Search analytics',
      'Production-ready security and monitoring'
    ],
    rateLimit: {
      general: '100 requests per 15 minutes',
      search: '50 requests per 5 minutes'
    }
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Initialize and start server
async function startServer() {
  try {
    // Validate environment variables
    const requiredEnvVars = ['NODE_ENV'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      logger.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Initialize database
    logger.info('Initializing database...');
    
    // Start scraping scheduler
    logger.info('Starting scraping scheduler...');
    scrapingScheduler.start();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Spanish Retailers API server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔍 Products endpoint: http://localhost:${PORT}/api/products?q=laptop`);
      logger.info(`🏪 Health check: http://localhost:${PORT}/api/health`);
      logger.info(`📚 API docs: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Stop scraping scheduler
        scrapingScheduler.stop();
        
        // Close database connections
        database.close();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
      
      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;