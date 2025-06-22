import { Product, ProductPrice, SearchSuggestion } from '../types';
import { retailers } from './retailers';

export const searchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'iPhone 15 Pro', type: 'recent' },
  { id: '2', text: 'Samsung Galaxy S24', type: 'recent' },
  { id: '3', text: 'MacBook Air M3', type: 'popular', category: 'Portátiles' },
  { id: '4', text: 'PlayStation 5', type: 'popular', category: 'Gaming' },
  { id: '5', text: 'AirPods Pro', type: 'popular', category: 'Audio' },
  { id: '6', text: 'Nintendo Switch', type: 'category', category: 'Gaming' },
  { id: '7', text: 'iPad Air', type: 'category', category: 'Tablets' },
  { id: '8', text: 'Sony WH-1000XM5', type: 'recent' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro 128GB',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Smartphones',
    description: 'El iPhone 15 Pro con chip A17 Pro y cámara de 48MP'
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24 Ultra 256GB',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Smartphones',
    description: 'Samsung Galaxy S24 Ultra con S Pen y cámara de 200MP'
  },
  {
    id: '3',
    title: 'MacBook Air M3 13" 256GB',
    brand: 'Apple',
    model: 'MacBook Air M3',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Portátiles',
    description: 'MacBook Air con chip M3, pantalla Liquid Retina de 13.6"'
  },
  {
    id: '4',
    title: 'PlayStation 5 Standard Edition',
    brand: 'Sony',
    model: 'PS5',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Gaming',
    description: 'Consola PlayStation 5 con lector de discos'
  },
  {
    id: '5',
    title: 'AirPods Pro (3ª generación)',
    brand: 'Apple',
    model: 'AirPods Pro 3',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Audio',
    description: 'AirPods Pro con cancelación activa de ruido'
  },
  {
    id: '6',
    title: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    model: 'Switch OLED',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Gaming',
    description: 'Nintendo Switch con pantalla OLED de 7 pulgadas'
  }
];

export const mockProductPrices: ProductPrice[] = [
  // iPhone 15 Pro prices
  {
    id: '1-amazon',
    productId: '1',
    retailer: retailers[0],
    price: 1199.00,
    originalPrice: 1299.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T10:30:00Z',
    rating: 4.5,
    reviewCount: 2847,
    seller: 'Amazon'
  },
  {
    id: '1-mediamarkt',
    productId: '1',
    retailer: retailers[1],
    price: 1249.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '2-3 días',
    url: '#',
    lastUpdated: '2024-01-15T09:15:00Z',
    rating: 4.3,
    reviewCount: 1543
  },
  {
    id: '1-pccomponentes',
    productId: '1',
    retailer: retailers[2],
    price: 1229.00,
    condition: 'new',
    availability: 'limited',
    shipping: 4.95,
    shippingTime: '3-5 días',
    url: '#',
    lastUpdated: '2024-01-15T08:45:00Z',
    rating: 4.4,
    reviewCount: 892
  },
  {
    id: '1-elcorteingles',
    productId: '1',
    retailer: retailers[3],
    price: 1299.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T11:00:00Z',
    rating: 4.2,
    reviewCount: 567
  },
  // Samsung Galaxy S24 Ultra prices
  {
    id: '2-amazon',
    productId: '2',
    retailer: retailers[0],
    price: 1399.00,
    originalPrice: 1499.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T10:30:00Z',
    rating: 4.6,
    reviewCount: 1234
  },
  {
    id: '2-mediamarkt',
    productId: '2',
    retailer: retailers[1],
    price: 1449.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '2-3 días',
    url: '#',
    lastUpdated: '2024-01-15T09:15:00Z',
    rating: 4.4,
    reviewCount: 867
  },
  {
    id: '2-pccomponentes',
    productId: '2',
    retailer: retailers[2],
    price: 1429.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '2-4 días',
    url: '#',
    lastUpdated: '2024-01-15T08:45:00Z',
    rating: 4.5,
    reviewCount: 654
  },
  {
    id: '2-elcorteingles',
    productId: '2',
    retailer: retailers[3],
    price: 1499.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T11:00:00Z',
    rating: 4.3,
    reviewCount: 432
  },
  // MacBook Air M3 prices
  {
    id: '3-amazon',
    productId: '3',
    retailer: retailers[0],
    price: 1299.00,
    originalPrice: 1399.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T10:30:00Z',
    rating: 4.8,
    reviewCount: 3456
  },
  {
    id: '3-mediamarkt',
    productId: '3',
    retailer: retailers[1],
    price: 1349.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '2-3 días',
    url: '#',
    lastUpdated: '2024-01-15T09:15:00Z',
    rating: 4.7,
    reviewCount: 2134
  },
  {
    id: '3-pccomponentes',
    productId: '3',
    retailer: retailers[2],
    price: 1319.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '2-4 días',
    url: '#',
    lastUpdated: '2024-01-15T08:45:00Z',
    rating: 4.6,
    reviewCount: 1876
  },
  {
    id: '3-elcorteingles',
    productId: '3',
    retailer: retailers[3],
    price: 1399.00,
    condition: 'new',
    availability: 'in-stock',
    shipping: 0,
    shippingTime: '1-2 días',
    url: '#',
    lastUpdated: '2024-01-15T11:00:00Z',
    rating: 4.5,
    reviewCount: 987
  }
];