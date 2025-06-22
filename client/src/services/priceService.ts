import { Product, ProductPrice, SearchFilters } from '../types';
import { amazonService } from './api/amazonService';
import { pcComponentesService } from './api/pcComponentesService';
import { mockRetailerService } from './api/mockRetailerService';
import { imageSearchService } from './api/imageSearchService';
import { retailers, getRealApiRetailers, getMockRetailers, getScrapingRetailers } from '../data/retailers';

export class PriceService {
  private static instance: PriceService;
  
  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  async searchProducts(query: string, filters?: SearchFilters): Promise<Product[]> {
    console.log(`Searching for products: ${query}`);
    
    const allProducts: Product[] = [];
    const searchPromises: Promise<Product[]>[] = [];

    // Real API integrations
    const realApiRetailers = getRealApiRetailers();
    for (const retailer of realApiRetailers) {
      if (retailer.id === 'amazon') {
        searchPromises.push(amazonService.searchProducts(query));
      } else if (retailer.id === 'pccomponentes') {
        searchPromises.push(pcComponentesService.searchProducts(query));
      }
    }

    // Mock API integrations
    const mockRetailers = getMockRetailers();
    for (const retailer of mockRetailers) {
      if (retailer.id === 'mediamarkt') {
        searchPromises.push(mockRetailerService.searchMediaMarktProducts(query));
      }
    }

    // Scraping integrations
    const scrapingRetailers = getScrapingRetailers();
    for (const retailer of scrapingRetailers) {
      if (retailer.id === 'elcorteingles') {
        searchPromises.push(mockRetailerService.scrapeElCorteInglesProducts(query));
      }
    }

    try {
      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allProducts.push(...result.value);
        } else {
          console.error(`Search failed for retailer ${index}:`, result.reason);
        }
      });

      // Remove duplicates based on product title and brand
      const uniqueProducts = this.deduplicateProducts(allProducts);
      
      // Apply filters if provided
      if (filters) {
        return this.applyFilters(uniqueProducts, filters);
      }

      return uniqueProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getProductPrices(productId: string): Promise<ProductPrice[]> {
    console.log(`Getting prices for product: ${productId}`);
    
    const allPrices: ProductPrice[] = [];
    const pricePromises: Promise<ProductPrice[]>[] = [];

    // Get prices from all retailers
    const allRetailers = retailers;
    for (const retailer of allRetailers) {
      switch (retailer.id) {
        case 'amazon':
          // Extract ASIN from productId or use product matching
          const asin = this.extractAsinFromProductId(productId);
          if (asin) {
            pricePromises.push(amazonService.getProductPricing(asin));
          }
          break;
        case 'pccomponentes':
          pricePromises.push(pcComponentesService.getProductOffers(productId));
          break;
        case 'mediamarkt':
          pricePromises.push(mockRetailerService.getMediaMarktPricing(productId));
          break;
        case 'elcorteingles':
          pricePromises.push(mockRetailerService.scrapeElCorteInglesPricing(productId));
          break;
      }
    }

    try {
      const results = await Promise.allSettled(pricePromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allPrices.push(...result.value);
        } else {
          console.error(`Price fetch failed for retailer ${index}:`, result.reason);
        }
      });

      // Sort by total price (price + shipping)
      return allPrices.sort((a, b) => {
        const totalA = a.price + a.shipping;
        const totalB = b.price + b.shipping;
        return totalA - totalB;
      });
    } catch (error) {
      console.error('Error getting product prices:', error);
      return [];
    }
  }

  async searchByImage(imageFile: File): Promise<Product[]> {
    console.log(`Searching by image: ${imageFile.name}`);
    
    try {
      // Process image with OCR/AI
      const imageResult = await imageSearchService.processImage(imageFile);
      
      // Use the best suggested query for product search
      const bestQuery = imageResult.suggestedQueries[0] || imageResult.extractedText.join(' ');
      
      if (bestQuery) {
        return this.searchProducts(bestQuery);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching by image:', error);
      return [];
    }
  }

  private deduplicateProducts(products: Product[]): Product[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.title.toLowerCase()}-${product.brand?.toLowerCase() || ''}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private applyFilters(products: Product[], filters: SearchFilters): Product[] {
    // TODO: Implement filtering logic based on SearchFilters
    // This would filter products based on:
    // - Price range
    // - Condition
    // - Retailer
    // - Availability
    // - Sort order
    
    return products;
  }

  private extractAsinFromProductId(productId: string): string | null {
    // Extract ASIN from product ID if it's an Amazon product
    if (productId.startsWith('amazon-')) {
      const parts = productId.split('-');
      return parts[parts.length - 1];
    }
    return null;
  }

  // Utility method to get all prices for multiple products
  async getAllProductPrices(productIds: string[]): Promise<ProductPrice[]> {
    const pricePromises = productIds.map(id => this.getProductPrices(id));
    const results = await Promise.allSettled(pricePromises);
    
    const allPrices: ProductPrice[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allPrices.push(...result.value);
      }
    });
    
    return allPrices;
  }
}

export const priceService = PriceService.getInstance();