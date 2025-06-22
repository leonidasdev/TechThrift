import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import UserAgent from 'user-agents';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { generateProductId, normalizePrice, extractProductInfo } from '../utils/scraperUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ScraperService {
  constructor() {
    this.browser = null;
    this.userAgent = new UserAgent();
    this.requestDelay = 2000; // 2 seconds between requests
    this.maxRetries = 3;
    this.dataDir = path.join(__dirname, '../../data');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      logger.error('Error creating data directory:', error);
    }
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      logger.info('Browser initialized for scraping');
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Browser closed');
    }
  }

  async scrapeAllRetailers(query, options = {}) {
    const retailers = ['amazon', 'pccomponentes', 'mediamarkt', 'elcorteingles'];
    const results = {
      query,
      retailers: {},
      totalProducts: 0,
      errors: []
    };

    for (const retailer of retailers) {
      try {
        logger.info(`Scraping ${retailer} for query: ${query}`);
        const retailerResults = await this.scrapeRetailer(retailer, { query, ...options });
        
        results.retailers[retailer] = retailerResults;
        results.totalProducts += retailerResults.length;
        
        // Save to JSON file
        await this.saveToJsonFile(retailer, retailerResults);
        
        // Respectful delay between retailers
        await this.delay(this.requestDelay);
      } catch (error) {
        logger.error(`Error scraping ${retailer}:`, error);
        results.errors.push({
          retailer,
          error: error.message
        });
      }
    }

    return results;
  }

  async scrapeRetailer(retailerId, options = {}) {
    const scrapers = {
      amazon: this.scrapeAmazon.bind(this),
      pccomponentes: this.scrapePcComponentes.bind(this),
      mediamarkt: this.scrapeMediaMarkt.bind(this),
      elcorteingles: this.scrapeElCorteIngles.bind(this)
    };

    const scraper = scrapers[retailerId];
    if (!scraper) {
      throw new Error(`Unknown retailer: ${retailerId}`);
    }

    return await scraper(options);
  }

  async scrapeAmazon(options = {}) {
    const { query, limit = 20 } = options;
    const products = [];

    try {
      await this.initBrowser();
      const page = await this.browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent(this.userAgent.toString());
      await page.setViewport({ width: 1366, height: 768 });

      // Build search URL
      const searchUrl = `https://www.amazon.es/s?k=${encodeURIComponent(query || 'electronics')}`;

      logger.info(`Scraping Amazon: ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // Wait for search results
      await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });

      // Extract product data
      const productData = await page.evaluate((limit) => {
        const results = [];
        const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');
        
        for (let i = 0; i < Math.min(productElements.length, limit); i++) {
          const element = productElements[i];
          
          try {
            const titleElement = element.querySelector('h2 a span');
            const priceElement = element.querySelector('.a-price-whole');
            const imageElement = element.querySelector('img');
            const linkElement = element.querySelector('h2 a');
            
            if (titleElement && priceElement && linkElement) {
              const title = titleElement.textContent.trim();
              // Extract definitive price (non-discounted)
              const priceText = priceElement.textContent.trim();
              const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
              const image = imageElement ? imageElement.src : '';
              const url = 'https://www.amazon.es' + linkElement.getAttribute('href');
              
              results.push({
                id: `amazon-${Date.now()}-${i}`,
                title,
                price,
                image,
                url,
                retailer: 'Amazon.es',
                retailerLogo: '📦',
                scrapedAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Error extracting Amazon product data:', error);
          }
        }
        
        return results;
      }, limit);

      await page.close();

      logger.info(`Amazon scraping completed: ${productData.length} products found`);
      return productData;
      
    } catch (error) {
      logger.error('Amazon scraping error:', error);
      throw error;
    }
  }

  async scrapePcComponentes(options = {}) {
    const { query, limit = 20 } = options;
    const products = [];

    try {
      const searchUrl = `https://www.pccomponentes.com/buscar/?query=${encodeURIComponent(query || 'ordenador')}`;
      
      logger.info(`Scraping PcComponentes: ${searchUrl}`);
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': this.userAgent.toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      $('.tarjeta-articulo').slice(0, limit).each((index, element) => {
        try {
          const $element = $(element);
          const title = $element.find('.nombre').text().trim();
          const priceText = $element.find('.precio').text().trim();
          const price = normalizePrice(priceText);
          const image = $element.find('img').attr('data-src') || $element.find('img').attr('src');
          const relativeUrl = $element.find('a').attr('href');
          const url = relativeUrl ? `https://www.pccomponentes.com${relativeUrl}` : '';

          if (title && price && url) {
            products.push({
              id: `pccomponentes-${Date.now()}-${index}`,
              title,
              price,
              image,
              url,
              retailer: 'PcComponentes',
              retailerLogo: '🖥️',
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          logger.error('Error processing PcComponentes product:', error);
        }
      });

      logger.info(`PcComponentes scraping completed: ${products.length} products found`);
      return products;
      
    } catch (error) {
      logger.error('PcComponentes scraping error:', error);
      throw error;
    }
  }

  async scrapeMediaMarkt(options = {}) {
    const { query, limit = 20 } = options;
    const products = [];

    try {
      await this.initBrowser();
      const page = await this.browser.newPage();
      
      await page.setUserAgent(this.userAgent.toString());
      await page.setViewport({ width: 1366, height: 768 });

      const searchUrl = `https://www.mediamarkt.es/es/search.html?query=${encodeURIComponent(query || 'electronica')}`;
      
      logger.info(`Scraping MediaMarkt: ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // Wait for products to load
      await page.waitForSelector('.product-wrapper', { timeout: 10000 });

      const productData = await page.evaluate((limit) => {
        const results = [];
        const productElements = document.querySelectorAll('.product-wrapper');
        
        for (let i = 0; i < Math.min(productElements.length, limit); i++) {
          const element = productElements[i];
          
          try {
            const titleElement = element.querySelector('.product-title');
            const priceElement = element.querySelector('.price');
            const imageElement = element.querySelector('img');
            const linkElement = element.querySelector('a');
            
            if (titleElement && priceElement && linkElement) {
              const title = titleElement.textContent.trim();
              const priceText = priceElement.textContent.trim();
              const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
              const image = imageElement ? imageElement.src : '';
              const url = linkElement.href;
              
              results.push({
                id: `mediamarkt-${Date.now()}-${i}`,
                title,
                price,
                image,
                url,
                retailer: 'MediaMarkt',
                retailerLogo: '🔴',
                scrapedAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Error extracting MediaMarkt product:', error);
          }
        }
        
        return results;
      }, limit);

      await page.close();

      logger.info(`MediaMarkt scraping completed: ${productData.length} products found`);
      return productData;
      
    } catch (error) {
      logger.error('MediaMarkt scraping error:', error);
      throw error;
    }
  }

  async scrapeElCorteIngles(options = {}) {
    const { query, limit = 20 } = options;
    const products = [];

    try {
      const searchUrl = `https://www.elcorteingles.es/search/?s=${encodeURIComponent(query || 'tecnologia')}`;
      
      logger.info(`Scraping El Corte Inglés: ${searchUrl}`);
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': this.userAgent.toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      $('.product_tile').slice(0, limit).each((index, element) => {
        try {
          const $element = $(element);
          const title = $element.find('.product_tile-description').text().trim();
          const priceText = $element.find('.price').text().trim();
          const price = normalizePrice(priceText);
          const image = $element.find('img').attr('data-src') || $element.find('img').attr('src');
          const relativeUrl = $element.find('a').attr('href');
          const url = relativeUrl ? `https://www.elcorteingles.es${relativeUrl}` : '';

          if (title && price && url) {
            products.push({
              id: `elcorteingles-${Date.now()}-${index}`,
              title,
              price,
              image,
              url,
              retailer: 'El Corte Inglés',
              retailerLogo: '🏬',
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          logger.error('Error processing El Corte Inglés product:', error);
        }
      });

      logger.info(`El Corte Inglés scraping completed: ${products.length} products found`);
      return products;
      
    } catch (error) {
      logger.error('El Corte Inglés scraping error:', error);
      throw error;
    }
  }

  async saveToJsonFile(retailer, products) {
    try {
      const filePath = path.join(this.dataDir, `${retailer}.json`);
      
      // Load existing data to avoid duplicates
      let existingData = [];
      try {
        const existingContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(existingContent);
      } catch (error) {
        // File doesn't exist or is invalid, start fresh
        existingData = [];
      }

      // Remove duplicates and update stale data
      const updatedData = this.mergeProductData(existingData, products);
      
      // Save updated data
      await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      
      logger.info(`Saved ${updatedData.length} products to ${retailer}.json`);
    } catch (error) {
      logger.error(`Error saving ${retailer} data to JSON:`, error);
      throw error;
    }
  }

  mergeProductData(existingData, newProducts) {
    const productMap = new Map();
    
    // Add existing products to map
    existingData.forEach(product => {
      const key = this.generateProductKey(product.title, product.retailer);
      productMap.set(key, product);
    });
    
    // Update with new products (overwrites existing with same key)
    newProducts.forEach(product => {
      const key = this.generateProductKey(product.title, product.retailer);
      productMap.set(key, product);
    });
    
    return Array.from(productMap.values());
  }

  generateProductKey(title, retailer) {
    return `${retailer}-${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
  }

  async loadProductsFromJson(retailer) {
    try {
      const filePath = path.join(this.dataDir, `${retailer}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      logger.warn(`Could not load ${retailer}.json:`, error.message);
      return [];
    }
  }

  async searchProducts(query) {
    const retailers = ['amazon', 'pccomponentes', 'mediamarkt', 'elcorteingles'];
    const allProducts = [];
    
    for (const retailer of retailers) {
      const products = await this.loadProductsFromJson(retailer);
      const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      allProducts.push(...filteredProducts);
    }
    
    // Sort by price (ascending)
    return allProducts.sort((a, b) => a.price - b.price);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getScrapingStats() {
    const retailers = ['amazon', 'pccomponentes', 'mediamarkt', 'elcorteingles'];
    const stats = {
      totalProducts: 0,
      productsByRetailer: {},
      lastUpdated: null
    };
    
    for (const retailer of retailers) {
      const products = await this.loadProductsFromJson(retailer);
      stats.productsByRetailer[retailer] = products.length;
      stats.totalProducts += products.length;
      
      if (products.length > 0) {
        const latestProduct = products.reduce((latest, product) => {
          return new Date(product.scrapedAt) > new Date(latest.scrapedAt) ? product : latest;
        });
        
        if (!stats.lastUpdated || new Date(latestProduct.scrapedAt) > new Date(stats.lastUpdated)) {
          stats.lastUpdated = latestProduct.scrapedAt;
        }
      }
    }
    
    return stats;
  }
}

export const scraperService = new ScraperService();