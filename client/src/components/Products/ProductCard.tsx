import React from 'react';
import { Star, Truck, CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isBestDeal?: boolean;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isBestDeal = false, 
  onCompare,
  isComparing = false 
}) => {
  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'limited':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'out-of-stock':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'In Stock';
      case 'limited':
        return 'Limited Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return '';
    }
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl
                    group cursor-pointer transform hover:-translate-y-1 relative overflow-hidden
                    ${isBestDeal ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100 hover:border-blue-200'}`}>
      
      {isBestDeal && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full
                         text-xs font-semibold shadow-lg">
            🏆 Best Deal
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full
                         text-xs font-semibold shadow-lg">
            -{discount}%
          </span>
        </div>
      )}

      <div className="aspect-square overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{product.vendorLogo}</span>
            <span className="text-sm font-medium text-gray-600">{product.vendor}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {getAvailabilityIcon(product.availability)}
            <span className={`text-xs font-medium ${
              product.availability === 'in-stock' ? 'text-green-600' :
              product.availability === 'limited' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {getAvailabilityText(product.availability)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600
                     transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {product.features && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck className="h-4 w-4" />
            <span>
              {product.shipping === 0 ? 'Free shipping' : `$${product.shipping.toFixed(2)} shipping`}
            </span>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl
                     hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Deal</span>
          </a>
          
          {onCompare && (
            <button
              onClick={() => onCompare(product)}
              className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                isComparing
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {isComparing ? '✓' : '+'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;