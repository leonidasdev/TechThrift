import { retailerStatusService } from '../services/retailerStatusService.js';
import { logger } from '../utils/logger.js';

const SUPPORTED_RETAILERS = [
  {
    id: 'amazon',
    name: 'Amazon España',
    website: 'https://amazon.es',
    logo: '/logos/amazon.png',
    categories: ['electronics', 'books', 'home', 'fashion', 'sports']
  },
  {
    id: 'pccomponentes',
    name: 'PcComponentes',
    website: 'https://pccomponentes.com',
    logo: '/logos/pccomponentes.png',
    categories: ['electronics', 'computers', 'gaming']
  },
  {
    id: 'mediamarkt',
    name: 'MediaMarkt',
    website: 'https://mediamarkt.es',
    logo: '/logos/mediamarkt.png',
    categories: ['electronics', 'appliances', 'gaming']
  },
  {
    id: 'elcorteingles',
    name: 'El Corte Inglés',
    website: 'https://elcorteingles.es',
    logo: '/logos/elcorteingles.png',
    categories: ['electronics', 'fashion', 'home', 'books', 'sports']
  }
];

export const getRetailers = async (req, res) => {
  try {
    res.json({
      success: true,
      retailers: SUPPORTED_RETAILERS
    });
  } catch (error) {
    logger.error('Get retailers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get retailers',
      message: error.message
    });
  }
};

export const getRetailerStatus = async (req, res) => {
  try {
    const statuses = await retailerStatusService.checkAllRetailers();
    
    res.json({
      success: true,
      statuses,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Get retailer status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get retailer status',
      message: error.message
    });
  }
};