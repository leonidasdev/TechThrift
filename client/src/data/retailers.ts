import { Retailer } from '../types';

export const retailers: Retailer[] = [
  {
    id: 'amazon',
    name: 'Amazon.es',
    logo: '📦',
    color: '#FF9900',
    website: 'https://amazon.es',
    apiType: 'real' // Amazon SP-API integration
  },
  {
    id: 'pccomponentes',
    name: 'PcComponentes',
    logo: '🖥️',
    color: '#FF6600',
    website: 'https://pccomponentes.com',
    apiType: 'real' // PCComponentes Marketplace API
  },
  {
    id: 'mediamarkt',
    name: 'MediaMarkt',
    logo: '🔴',
    color: '#E31E24',
    website: 'https://mediamarkt.es',
    apiType: 'mock' // Mock data - ready for future API integration
  },
  {
    id: 'elcorteingles',
    name: 'El Corte Inglés',
    logo: '🏬',
    color: '#00A651',
    website: 'https://elcorteingles.es',
    apiType: 'scraping' // Web scraping placeholder - ready for future API
  }
];

export const getRetailerById = (id: string): Retailer | undefined => {
  return retailers.find(retailer => retailer.id === id);
};

export const getRealApiRetailers = (): Retailer[] => {
  return retailers.filter(retailer => retailer.apiType === 'real');
};

export const getMockRetailers = (): Retailer[] => {
  return retailers.filter(retailer => retailer.apiType === 'mock');
};

export const getScrapingRetailers = (): Retailer[] => {
  return retailers.filter(retailer => retailer.apiType === 'scraping');
};