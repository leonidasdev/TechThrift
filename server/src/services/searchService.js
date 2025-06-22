import { amazonService } from './retailers/amazon.js';
import { pccomponentesService } from './retailers/pccomponentes.js';
import { mediamarktService } from './retailers/mediamarkt.js';
import { elcorteinglesService } from './retailers/elcorteingles.js';
import { normalizeProduct } from '../utils/productNormalizer.js';
import { logger } from '../utils/logger.js';

const RETAILER_SERVICES = {
  amazon: amazonService,
  pccomponentes: pccomponentesService,
  mediamarkt: mediamarktService,
  elcorteingles: elcorteinglesService
};

class SearchService {
  async searchProducts(params) {
    const { query, category, minPrice, maxPrice, retailers } = params;
    
    // Determine which retailers to search
    const retailersToSearch = retailers || Object.keys(RETAILER_SERVICES);
    
    logger.info(`Searching ${retailersToSearch.length} retailers for: "${query}"`);
    
    // Search all retailers in parallel
    const searchPromises = retailersToSearch.map(async (retailerId) => {
      try {
        const service = RETAILER_SERVICES[retailerId];
        if (!service) {
          logger.warn(`Unknown retailer: ${retailerId}`);
          return [];
        }
        
        const results = await service.search(query, { category, minPrice, maxPrice });
        return results.map(product => normalizeProduct(product, retailerId));
      } catch (error) {
        logger.error(`Error searching ${retailerId}:`, error);
        return []; // Return empty array on error to not break the entire search
      }
    });
    
    const allResults = await Promise.all(searchPromises);
    const flatResults = allResults.flat();
    
    // Sort by price (ascending)
    const sortedResults = flatResults.sort((a, b) => a.price - b.price);
    
    logger.info(`Found ${sortedResults.length} total products`);
    
    return sortedResults;
  }
}

export const searchService = new SearchService();