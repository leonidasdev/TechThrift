import { logger } from '../utils/logger.js';
import { database } from '../database/database.js';

class PriceAlertService {
  async createAlert(alertData) {
    try {
      const { product_id, target_price, email } = alertData;
      
      // Validate input
      if (!product_id || !target_price || !email) {
        throw new Error('Missing required fields: product_id, target_price, email');
      }
      
      if (target_price <= 0) {
        throw new Error('Target price must be greater than 0');
      }
      
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email address');
      }
      
      // Check if product exists
      const product = database.getProduct(product_id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Create alert
      const alertId = database.createPriceAlert({
        product_id,
        target_price,
        email
      });
      
      logger.info(`Price alert created: ${alertId} for product ${product_id} at ${target_price}€`);
      
      return {
        id: alertId,
        product_id,
        target_price,
        email,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error creating price alert:', error);
      throw error;
    }
  }
  
  async sendPriceAlert(alert) {
    try {
      logger.info(`Sending price alert for product ${alert.product_id} to ${alert.email}`);
      
      // In a real implementation, you would send an email here
      // For now, we'll just log the alert
      const emailContent = this.generateAlertEmail(alert);
      
      logger.info('Price alert email content:', emailContent);
      
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // await this.sendEmail(alert.email, emailContent);
      
      return true;
    } catch (error) {
      logger.error('Error sending price alert:', error);
      throw error;
    }
  }
  
  generateAlertEmail(alert) {
    return {
      to: alert.email,
      subject: `¡Alerta de precio! ${alert.title} ahora por ${alert.current_price}€`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">¡Tu alerta de precio se ha activado!</h2>
          
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${alert.title}</h3>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <div>
                <strong>Precio objetivo:</strong> ${alert.target_price}€
              </div>
              <div>
                <strong style="color: #16a34a;">Precio actual: ${alert.current_price}€</strong>
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <strong>¡Ahorro:</strong> ${(alert.target_price - alert.current_price).toFixed(2)}€
            </div>
            
            <a href="#" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver producto
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Este es un mensaje automático del sistema de alertas de precios de TechThrift.
          </p>
        </div>
      `
    };
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async getActiveAlerts(email) {
    try {
      const alerts = database.db.prepare(`
        SELECT pa.*, p.title, p.image_url
        FROM price_alerts pa
        JOIN products p ON pa.product_id = p.id
        WHERE pa.email = ? AND pa.is_active = 1
        ORDER BY pa.created_at DESC
      `).all(email);
      
      return alerts;
    } catch (error) {
      logger.error('Error getting active alerts:', error);
      throw error;
    }
  }
  
  async deactivateAlert(alertId, email) {
    try {
      const result = database.db.prepare(`
        UPDATE price_alerts 
        SET is_active = 0 
        WHERE id = ? AND email = ?
      `).run(alertId, email);
      
      if (result.changes === 0) {
        throw new Error('Alert not found or not authorized');
      }
      
      logger.info(`Price alert ${alertId} deactivated for ${email}`);
      return true;
    } catch (error) {
      logger.error('Error deactivating alert:', error);
      throw error;
    }
  }
}

export const priceAlertService = new PriceAlertService();