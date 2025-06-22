import { priceAlertService } from '../services/priceAlertService.js';
import { logger } from '../utils/logger.js';

export const createPriceAlert = async (req, res) => {
  try {
    const { product_id, target_price, email } = req.body;
    
    const alert = await priceAlertService.createAlert({
      product_id,
      target_price,
      email
    });
    
    res.status(201).json({
      success: true,
      message: 'Price alert created successfully',
      alert
    });
  } catch (error) {
    logger.error('Error creating price alert:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to create price alert',
      message: error.message
    });
  }
};

export const getPriceAlerts = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required'
      });
    }
    
    const alerts = await priceAlertService.getActiveAlerts(email);
    
    res.json({
      success: true,
      alerts,
      total: alerts.length
    });
  } catch (error) {
    logger.error('Error getting price alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get price alerts',
      message: error.message
    });
  }
};

export const deactivatePriceAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    await priceAlertService.deactivateAlert(parseInt(id), email);
    
    res.json({
      success: true,
      message: 'Price alert deactivated successfully'
    });
  } catch (error) {
    logger.error('Error deactivating price alert:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to deactivate price alert',
      message: error.message
    });
  }
};