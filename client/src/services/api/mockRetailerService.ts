import { Product, ProductPrice } from '../../types';
import { retailers } from '../../data/retailers';

export class MockRetailerService {
  private static instance: MockRetailerService;
  
  public static getInstance(): MockRetailerService {
    if (!MockRetailerService.instance) {
      MockRetailerService.instance = new MockRetailerService();
    }
    return MockRetailerService.instance;
  }

  // MediaMarkt Mock Service (ready for future API integration)
  async searchMediaMarktProducts(query: string): Promise<Product[]> {
    console.log(`[MOCK] Searching MediaMarkt for: ${query}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockProducts: Product[] = [
      {
        id: 'mediamarkt-1',
        title: `${query} - MediaMarkt Exclusive`,
        brand: 'Samsung',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electrónicos',
        description: `Producto exclusivo de MediaMarkt relacionado con ${query}`,
        ean: '5432167890123'
      }
    ];
    
    return mockProducts;
  }

  async getMediaMarktPricing(productId: string): Promise<ProductPrice[]> {
    console.log(`[MOCK] Getting MediaMarkt pricing for: ${productId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mediaMarktRetailer = retailers.find(r => r.id === 'mediamarkt')!;
    
    const mockPricing: ProductPrice[] = [
      {
        id: `mediamarkt-${productId}-new`,
        productId: productId,
        retailer: mediaMarktRetailer,
        price: 449.99,
        originalPrice: 499.99,
        condition: 'new',
        availability: 'in-stock',
        shipping: 0,
        shippingTime: '2-3 días laborables',
        url: `https://mediamarkt.es/producto/${productId}`,
        lastUpdated: new Date().toISOString(),
        rating: 4.3,
        reviewCount: 856,
        seller: 'MediaMarkt',
        stockQuantity: 12
      }
    ];
    
    return mockPricing;
  }

  // El Corte Inglés Scraping Service (placeholder for future implementation)
  async scrapeElCorteInglesProducts(query: string): Promise<Product[]> {
    console.log(`[SCRAPING PLACEHOLDER] Searching El Corte Inglés for: ${query}`);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockProducts: Product[] = [
      {
        id: 'elcorteingles-1',
        title: `${query} - El Corte Inglés Premium`,
        brand: 'Apple',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Tecnología',
        description: `Producto premium de El Corte Inglés relacionado con ${query}`,
        ean: '1357924680135'
      }
    ];
    
    return mockProducts;
  }

  async scrapeElCorteInglesPricing(productId: string): Promise<ProductPrice[]> {
    console.log(`[SCRAPING PLACEHOLDER] Getting El Corte Inglés pricing for: ${productId}`);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    const elCorteInglesRetailer = retailers.find(r => r.id === 'elcorteingles')!;
    
    const mockPricing: ProductPrice[] = [
      {
        id: `elcorteingles-${productId}-new`,
        productId: productId,
        retailer: elCorteInglesRetailer,
        price: 529.99,
        condition: 'new',
        availability: 'in-stock',
        shipping: 0,
        shippingTime: '1-2 días laborables',
        url: `https://elcorteingles.es/tecnologia/producto/${productId}`,
        lastUpdated: new Date().toISOString(),
        rating: 4.2,
        reviewCount: 432,
        seller: 'El Corte Inglés',
        stockQuantity: 5
      }
    ];
    
    return mockPricing;
  }

  // Future implementation notes:
  // 
  // For MediaMarkt:
  // - Could implement web scraping with Puppeteer/Playwright
  // - Monitor for official API announcements
  // - Implement caching to reduce scraping frequency
  //
  // For El Corte Inglés:
  // - Similar scraping approach
  // - Respect robots.txt and rate limiting
  // - Consider using proxy rotation for large-scale scraping
}

export const mockRetailerService = MockRetailerService.getInstance();