import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/products.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeTables();
  }

  initializeTables() {
    try {
      // Products table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          brand TEXT,
          category TEXT,
          image_url TEXT,
          description TEXT,
          ean TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Product prices table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS product_prices (
          id TEXT PRIMARY KEY,
          product_id TEXT,
          retailer_id TEXT NOT NULL,
          retailer_name TEXT NOT NULL,
          price REAL NOT NULL,
          original_price REAL,
          currency TEXT DEFAULT 'EUR',
          condition TEXT DEFAULT 'new',
          availability TEXT DEFAULT 'unknown',
          shipping_cost REAL DEFAULT 0,
          shipping_time TEXT,
          product_url TEXT NOT NULL,
          rating REAL,
          review_count INTEGER DEFAULT 0,
          seller_name TEXT,
          stock_quantity INTEGER,
          scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Scraping jobs table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS scraping_jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          job_type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          retailer_id TEXT,
          search_query TEXT,
          started_at DATETIME,
          completed_at DATETIME,
          error_message TEXT,
          products_found INTEGER DEFAULT 0,
          prices_updated INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Search history table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          query TEXT NOT NULL,
          results_count INTEGER DEFAULT 0,
          search_time_ms INTEGER,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Price alerts table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS price_alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id TEXT NOT NULL,
          target_price REAL NOT NULL,
          email TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          triggered_at DATETIME,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Create indexes for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
        CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
        CREATE INDEX IF NOT EXISTS idx_product_prices_retailer ON product_prices(retailer_id);
        CREATE INDEX IF NOT EXISTS idx_product_prices_price ON product_prices(price);
        CREATE INDEX IF NOT EXISTS idx_product_prices_scraped_at ON product_prices(scraped_at);
        CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
        CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
      `);

      logger.info('Database tables initialized successfully');
    } catch (error) {
      logger.error('Error initializing database tables:', error);
      throw error;
    }
  }

  // Product operations
  insertProduct(product) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO products 
      (id, title, brand, category, image_url, description, ean, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    return stmt.run(
      product.id,
      product.title,
      product.brand,
      product.category,
      product.image_url,
      product.description,
      product.ean
    );
  }

  getProduct(id) {
    const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
  }

  searchProducts(query, limit = 50) {
    const stmt = this.db.prepare(`
      SELECT * FROM products 
      WHERE title LIKE ? OR brand LIKE ? OR description LIKE ?
      ORDER BY updated_at DESC
      LIMIT ?
    `);
    
    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm, limit);
  }

  // Product price operations
  insertProductPrice(price) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO product_prices 
      (id, product_id, retailer_id, retailer_name, price, original_price, currency,
       condition, availability, shipping_cost, shipping_time, product_url, rating,
       review_count, seller_name, stock_quantity, scraped_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    return stmt.run(
      price.id,
      price.product_id,
      price.retailer_id,
      price.retailer_name,
      price.price,
      price.original_price,
      price.currency,
      price.condition,
      price.availability,
      price.shipping_cost,
      price.shipping_time,
      price.product_url,
      price.rating,
      price.review_count,
      price.seller_name,
      price.stock_quantity
    );
  }

  getProductPrices(productId) {
    const stmt = this.db.prepare(`
      SELECT * FROM product_prices 
      WHERE product_id = ? 
      ORDER BY price ASC
    `);
    return stmt.all(productId);
  }

  getLatestPrices(limit = 100) {
    const stmt = this.db.prepare(`
      SELECT pp.*, p.title, p.brand, p.image_url
      FROM product_prices pp
      JOIN products p ON pp.product_id = p.id
      ORDER BY pp.scraped_at DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  // Scraping job operations
  createScrapingJob(job) {
    const stmt = this.db.prepare(`
      INSERT INTO scraping_jobs 
      (job_type, retailer_id, search_query, status)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(job.job_type, job.retailer_id, job.search_query, 'pending');
    return result.lastInsertRowid;
  }

  updateScrapingJob(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = this.db.prepare(`
      UPDATE scraping_jobs 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    return stmt.run(...values, id);
  }

  getScrapingJobs(status = null, limit = 50) {
    let query = 'SELECT * FROM scraping_jobs';
    let params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  // Search history operations
  logSearch(searchData) {
    const stmt = this.db.prepare(`
      INSERT INTO search_history 
      (query, results_count, search_time_ms, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      searchData.query,
      searchData.results_count,
      searchData.search_time_ms,
      searchData.ip_address,
      searchData.user_agent
    );
  }

  getPopularSearches(limit = 10) {
    const stmt = this.db.prepare(`
      SELECT query, COUNT(*) as search_count, AVG(results_count) as avg_results
      FROM search_history 
      WHERE created_at > datetime('now', '-30 days')
      GROUP BY query 
      ORDER BY search_count DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  // Price alert operations
  createPriceAlert(alert) {
    const stmt = this.db.prepare(`
      INSERT INTO price_alerts (product_id, target_price, email)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(alert.product_id, alert.target_price, alert.email);
    return result.lastInsertRowid;
  }

  checkPriceAlerts() {
    const stmt = this.db.prepare(`
      SELECT pa.*, p.title, pp.price as current_price
      FROM price_alerts pa
      JOIN products p ON pa.product_id = p.id
      JOIN product_prices pp ON p.id = pp.product_id
      WHERE pa.is_active = 1 
        AND pp.price <= pa.target_price
        AND pa.triggered_at IS NULL
      GROUP BY pa.id
      HAVING pp.price = MIN(pp.price)
    `);
    return stmt.all();
  }

  // Analytics and statistics
  getStatistics() {
    const stats = {};
    
    // Total products
    stats.total_products = this.db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    
    // Total prices
    stats.total_prices = this.db.prepare('SELECT COUNT(*) as count FROM product_prices').get().count;
    
    // Prices by retailer
    stats.prices_by_retailer = this.db.prepare(`
      SELECT retailer_name, COUNT(*) as count 
      FROM product_prices 
      GROUP BY retailer_name
    `).all();
    
    // Recent scraping activity
    stats.recent_jobs = this.db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM scraping_jobs 
      WHERE created_at > datetime('now', '-24 hours')
      GROUP BY status
    `).all();
    
    // Average prices by category
    stats.avg_prices_by_category = this.db.prepare(`
      SELECT p.category, AVG(pp.price) as avg_price, COUNT(*) as product_count
      FROM products p
      JOIN product_prices pp ON p.id = pp.product_id
      GROUP BY p.category
      ORDER BY avg_price DESC
    `).all();
    
    return stats;
  }

  close() {
    this.db.close();
  }
}

export const database = new DatabaseManager();