import axios from 'axios';
import { Product } from '../types';

export class ProductService {
  private static instance: ProductService;
  private baseUrl = '/api';
  
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log(`🔍 Searching products for: "${query}"`);
      
      const response = await axios.get(`${this.baseUrl}/products`, {
        params: { q: query },
        timeout: 10000
      });

      if (response.data.success) {
        console.log(`📦 Found ${response.data.totalResults} products`);
        return this.transformProducts(response.data.results);
      } else {
        console.error('Search failed:', response.data.error);
        return [];
      }
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getProductStats(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/products/stats`, {
        timeout: 5000
      });

      if (response.data.success) {
        return response.data.statistics;
      } else {
        console.error('Failed to get stats:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('Error getting product stats:', error);
      return null;
    }
  }

  private transformProducts(rawProducts: any[]): Product[] {
    return rawProducts.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: product.url,
      vendor: product.retailer,
      vendorLogo: product.retailerLogo,
      rating: 4.0 + Math.random(), // Mock rating
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      availability: 'in-stock',
      shipping: 0,
      features: [],
      scrapedAt: product.scrapedAt
    }));
  }
}

export const productService = ProductService.getInstance();