import React from 'react';
import { Product, ProductPrice } from '../../types';
import ProductPriceCard from './ProductPriceCard';

interface ProductResultCardProps {
  product: Product;
  prices: ProductPrice[];
  onCompare?: (price: ProductPrice) => void;
  comparingPrices?: ProductPrice[];
}

const ProductResultCard: React.FC<ProductResultCardProps> = ({
  product,
  prices,
  onCompare,
  comparingPrices = []
}) => {
  // Find the best deal (lowest total price including shipping)
  const bestDealPrice = prices.reduce((best, current) => {
    const bestTotal = best ? best.price + best.shipping : Infinity;
    const currentTotal = current.price + current.shipping;
    return currentTotal < bestTotal ? current : best;
  }, null as ProductPrice | null);

  const sortedPrices = [...prices].sort((a, b) => {
    const totalA = a.price + a.shipping;
    const totalB = b.price + b.shipping;
    return totalA - totalB;
  });

  return (
    <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100">
      {/* Product Header */}
      <div className="flex items-start space-x-6 mb-8">
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-32 h-32 object-cover rounded-2xl shadow-md"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h2>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-1">Marca: {product.brand}</p>
              )}
              <p className="text-sm text-gray-500 mb-3">Categoría: {product.category}</p>
              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Desde</div>
              <div className="text-3xl font-bold text-green-600">
                {bestDealPrice ? `${(bestDealPrice.price + bestDealPrice.shipping).toFixed(2)} €` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                {prices.length} {prices.length === 1 ? 'oferta' : 'ofertas'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {sortedPrices.map((price) => (
          <ProductPriceCard
            key={price.id}
            price={price}
            isBestDeal={price.id === bestDealPrice?.id}
            onCompare={onCompare}
            isComparing={comparingPrices.some(p => p.id === price.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductResultCard;