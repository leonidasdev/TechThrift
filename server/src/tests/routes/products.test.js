import request from 'supertest';
import app from '../../server.js';

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return 400 when query parameter is missing', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should return 400 when query is empty', async () => {
      const response = await request(app)
        .get('/api/products?q=')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 when query is too long', async () => {
      const longQuery = 'a'.repeat(201);
      const response = await request(app)
        .get(`/api/products?q=${longQuery}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return products when valid query is provided', async () => {
      const response = await request(app)
        .get('/api/products?q=laptop')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.query).toBe('laptop');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should sanitize malicious input', async () => {
      const maliciousQuery = '<script>alert("xss")</script>';
      const response = await request(app)
        .get(`/api/products?q=${encodeURIComponent(maliciousQuery)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Query should be sanitized
      expect(response.body.query).not.toContain('<script>');
    });
  });

  describe('GET /api/products/stats', () => {
    it('should return scraping statistics', async () => {
      const response = await request(app)
        .get('/api/products/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.statistics).toBeDefined();
    });
  });
});