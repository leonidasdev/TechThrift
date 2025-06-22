import crypto from 'crypto';

export function generateProductId(title, retailer) {
  const normalized = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  const hash = crypto.createHash('md5').update(`${normalized}-${retailer}`).digest('hex').substring(0, 8);
  return `${retailer}-${hash}`;
}

export function normalizePrice(priceText) {
  if (!priceText) return 0;
  
  // Remove currency symbols and extract number
  const cleaned = priceText.replace(/[€$£¥₹]/g, '').replace(/[^\d,.-]/g, '');
  
  // Handle different decimal separators
  let normalized = cleaned;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Assume comma is thousands separator if both are present
    normalized = cleaned.replace(/,/g, '');
  } else if (cleaned.includes(',')) {
    // Check if comma is decimal separator (European format)
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = cleaned.replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  }
  
  const price = parseFloat(normalized);
  return isNaN(price) ? 0 : price;
}

export function extractProductInfo(title) {
  const brands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Huawei', 'Xiaomi', 'OnePlus', 'Google',
    'Microsoft', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer',
    'Nintendo', 'PlayStation', 'Xbox', 'Canon', 'Nikon', 'Panasonic',
    'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Logitech', 'Corsair'
  ];
  
  const titleUpper = title.toUpperCase();
  let detectedBrand = null;
  
  for (const brand of brands) {
    if (titleUpper.includes(brand.toUpperCase())) {
      detectedBrand = brand;
      break;
    }
  }
  
  // Extract model information
  const modelMatch = title.match(/\b([A-Z0-9]{2,}[-\s]?[A-Z0-9]{2,})\b/);
  const model = modelMatch ? modelMatch[1] : null;
  
  // Extract capacity/storage
  const storageMatch = title.match(/\b(\d+)\s?(GB|TB|MB)\b/i);
  const storage = storageMatch ? `${storageMatch[1]}${storageMatch[2].toUpperCase()}` : null;
  
  // Extract color
  const colorMatch = title.match(/\b(negro|blanco|azul|rojo|verde|amarillo|rosa|gris|plata|dorado|black|white|blue|red|green|yellow|pink|gray|silver|gold)\b/i);
  const color = colorMatch ? colorMatch[1] : null;
  
  return {
    brand: detectedBrand,
    model,
    storage,
    color,
    category: categorizeProduct(title)
  };
}

function categorizeProduct(title) {
  const titleLower = title.toLowerCase();
  
  const categories = {
    'smartphones': ['iphone', 'galaxy', 'pixel', 'smartphone', 'móvil', 'teléfono'],
    'laptops': ['macbook', 'laptop', 'portátil', 'notebook', 'ultrabook'],
    'tablets': ['ipad', 'tablet', 'surface'],
    'gaming': ['playstation', 'xbox', 'nintendo', 'switch', 'ps5', 'ps4'],
    'headphones': ['airpods', 'headphones', 'auriculares', 'cascos'],
    'smartwatches': ['apple watch', 'smartwatch', 'reloj inteligente'],
    'cameras': ['cámara', 'camera', 'canon', 'nikon', 'sony alpha'],
    'monitors': ['monitor', 'pantalla', 'display'],
    'keyboards': ['teclado', 'keyboard', 'mecánico'],
    'speakers': ['altavoz', 'speaker', 'bluetooth speaker']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category;
    }
  }
  
  return 'electronics';
}

export function sanitizeSearchQuery(query) {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[^\w\s\-áéíóúñü]/gi, '') // Keep only alphanumeric, spaces, hyphens, and Spanish chars
    .substring(0, 100); // Limit length
}

export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function generateUserAgent() {
  const browsers = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];
  
  return browsers[Math.floor(Math.random() * browsers.length)];
}

export function calculatePriceChange(oldPrice, newPrice) {
  if (!oldPrice || !newPrice) return null;
  
  const change = newPrice - oldPrice;
  const percentChange = (change / oldPrice) * 100;
  
  return {
    absolute: change,
    percentage: Math.round(percentChange * 100) / 100,
    direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'same'
  };
}