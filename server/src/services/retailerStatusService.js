import axios from 'axios';
import { logger } from '../utils/logger.js';

const RETAILERS = [
  { id: 'amazon', name: 'Amazon España', url: 'https://amazon.es' },
  { id: 'pccomponentes', name: 'PcComponentes', url: 'https://pccomponentes.com' },
  { id: 'mediamarkt', name: 'MediaMarkt', url: 'https://mediamarkt.es' },
  { id: 'elcorteingles', name: 'El Corte Inglés', url: 'https://elcorteingles.es' }
];

class RetailerStatusService {
  async checkRetailerStatus(retailer) {
    try {
      const startTime = Date.now();
      const response = await axios.get(retailer.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PriceComparisonBot/1.0)'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        id: retailer.id,
        name: retailer.name,
        status: response.status === 200 ? 'online' : 'offline',
        responseTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Status check failed for ${retailer.name}:`, error.message);
      
      return {
        id: retailer.id,
        name: retailer.name,
        status: 'offline',
        responseTime: null,
        lastChecked: new Date().toISOString(),
        error: error.message
      };
    }
  }

  async checkAllRetailers() {
    logger.info('Checking status of all retailers...');
    
    const statusPromises = RETAILERS.map(retailer => 
      this.checkRetailerStatus(retailer)
    );
    
    const statuses = await Promise.all(statusPromises);
    
    const onlineCount = statuses.filter(s => s.status === 'online').length;
    logger.info(`Retailer status check complete: ${onlineCount}/${statuses.length} online`);
    
    return statuses;
  }
}

export const retailerStatusService = new RetailerStatusService();