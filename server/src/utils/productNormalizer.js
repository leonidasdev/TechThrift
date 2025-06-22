export function normalizeProduct(product, retailerId) {
  return {
    id: product.id,
    retailer: {
      id: retailerId,
      name: getRetailerName(retailerId)
    },
    title: product.title,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    currency: product.currency || 'EUR',
    image: product.image,
    url: product.url,
    rating: product.rating || null,
    reviewCount: product.reviewCount || 0,
    availability: product.availability || 'unknown',
    shipping: product.shipping || 'unknown',
    description: product.description || '',
    discount: calculateDiscount(product.price, product.originalPrice),
    lastUpdated: new Date().toISOString()
  };
}

function getRetailerName(retailerId) {
  const names = {
    amazon: 'Amazon España',
    pccomponentes: 'PcComponentes',
    mediamarkt: 'MediaMarkt',
    elcorteingles: 'El Corte Inglés'
  };
  
  return names[retailerId] || retailerId;
}

function calculateDiscount(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice <= currentPrice) {
    return null;
  }
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
}