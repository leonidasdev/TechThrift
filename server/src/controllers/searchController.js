import { searchService } from '../services/searchService.js';
import { logger } from '../utils/logger.js';

export const searchProducts = async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, retailers } = req.query;
    
    logger.info(`Search request: query="${query}", category="${category}", price range: ${minPrice}-${maxPrice}`);
    
    const searchParams = {
      query,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      retailers: retailers ? retailers.split(',') : undefined
    };
    
    const results = await searchService.searchProducts(searchParams);
    
    res.json({
      success: true,
      query: searchParams,
      totalResults: results.length,
      results
    });
    
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
};