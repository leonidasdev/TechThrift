import React from 'react';
import { Star, Truck, CheckCircle, AlertCircle, XCircle, ExternalLink, Clock } from 'lucide-react';
import { ProductPrice } from '../../types';

interface ProductPriceCardProps {
  price: ProductPrice;
  isBestDeal?: boolean;
  onCompare?: (price: ProductPrice) => void;
  isComparing?: boolean;
}

const ProductPriceCard: React.FC<ProductPriceCardProps> = ({ 
  price, 
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
      case 'pre-order':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'En stock';
      case 'limited':
        return 'Stock limitado';
      case 'out-of-stock':
        return 'Sin stock';
      case 'pre-order':
        return 'Pre-pedido';
      default:
        return '';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'Nuevo';
      case 'used':
        return 'Usado';
      case 'refurbished':
        return 'Reacondicionado';
      default:
        return condition;
    }
  };

  const discount = price.originalPrice 
    ? Math.round(((price.originalPrice - price.price) / price.originalPrice) * 100)
    : 0;

  const totalPrice = price.price + price.shipping;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl
                    group cursor-pointer transform hover:-translate-y-1 relative overflow-hidden
                    ${isBestDeal ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100 hover:border-red-200'}`}>
      
      {isBestDeal && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full
                         text-xs font-semibold shadow-lg">
            🏆 Mejor oferta
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

      <div className="p-6">
        {/* Retailer Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{price.retailer.logo}</span>
            <div>
              <h3 className="font-semibold text-gray-800">{price.retailer.name}</h3>
              {price.seller && price.seller !== price.retailer.name && (
                <p className="text-sm text-gray-500">por {price.seller}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {getAvailabilityIcon(price.availability)}
            <span className={`text-xs font-medium ${
              price.availability === 'in-stock' ? 'text-green-600' :
              price.availability === 'limited' ? 'text-yellow-600' :
              price.availability === 'pre-order' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {getAvailabilityText(price.availability)}
            </span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            price.condition === 'new' ? 'bg-green-100 text-green-700' :
            price.condition === 'used' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {getConditionText(price.condition)}
          </span>
        </div>

        {/* Rating */}
        {price.rating && (
          <div className="flex items-center space-x-1 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(price.rating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {price.rating} ({price.reviewCount?.toLocaleString()} reseñas)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="space-y-3 mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {price.price.toFixed(2)} €
            </span>
            {price.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {price.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck className="h-4 w-4" />
            <span>
              {price.shipping === 0 ? 'Envío gratis' : `${price.shipping.toFixed(2)} € envío`}
              {price.shippingTime && ` • ${price.shippingTime}`}
            </span>
          </div>

          <div className="text-sm font-medium text-gray-800">
            Total: {totalPrice.toFixed(2)} €
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 mb-4">
          Actualizado: {new Date(price.lastUpdated).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <a
            href={price.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-xl
                     hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver oferta</span>
          </a>
          
          {onCompare && (
            <button
              onClick={() => onCompare(price)}
              className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                isComparing
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700'
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

export default ProductPriceCard;