export interface Product {
  id: string;
  title: string;
  brand?: string;
  model?: string;
  image: string;
  category: string;
  description?: string;
  asin?: string; // Amazon Standard Identification Number
  ean?: string; // European Article Number
  manufacturerPartNumber?: string;
}

export interface ProductPrice {
  id: string;
  productId: string;
  retailer: Retailer;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'used' | 'refurbished';
  availability: 'in-stock' | 'limited' | 'out-of-stock' | 'pre-order';
  shipping: number;
  shippingTime?: string;
  url: string;
  lastUpdated: string;
  rating?: number;
  reviewCount?: number;
  seller?: string;
  stockQuantity?: number;
}

export interface Retailer {
  id: string;
  name: string;
  logo: string;
  color: string;
  website: string;
  apiType: 'real' | 'mock' | 'scraping';
}

export interface SearchFilters {
  condition: ('new' | 'used' | 'refurbished')[];
  priceRange: {
    min: number;
    max: number;
  };
  retailers: string[];
  availability: ('in-stock' | 'limited' | 'out-of-stock' | 'pre-order')[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'availability';
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'category';
  category?: string;
}

// Amazon SP-API specific types
export interface AmazonProduct {
  asin: string;
  title: string;
  brand?: string;
  images: string[];
  category: string;
  features?: string[];
  dimensions?: string;
  weight?: string;
}

export interface AmazonPricing {
  asin: string;
  price: number;
  currency: string;
  availability: string;
  condition: string;
  seller: string;
  shippingPrice?: number;
  lastUpdated: string;
}

// PCComponentes API specific types
export interface PCComponentesProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  ean?: string;
}

export interface PCComponentesOffer {
  productId: string;
  sellerId: string;
  sellerName: string;
  price: number;
  originalPrice?: number;
  condition: string;
  availability: string;
  shipping: number;
  deliveryTime: string;
  rating?: number;
  reviewCount?: number;
}

// OCR and Image Search types
export interface ImageSearchResult {
  confidence: number;
  extractedText: string[];
  detectedProducts: string[];
  suggestedQueries: string[];
}