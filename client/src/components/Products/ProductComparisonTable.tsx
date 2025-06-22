import React from 'react';
import { Star, Truck, ExternalLink, X, CheckCircle, AlertCircle, XCircle, Clock, Award } from 'lucide-react';
import { ProductPrice } from '../../types';

interface ProductComparisonTableProps {
  prices: ProductPrice[];
  onRemove: (priceId: string) => void;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ prices, onRemove }) => {
  if (prices.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No hay productos para comparar</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Selecciona productos desde los resultados de búsqueda para realizar una comparación detallada 
            de precios, características y disponibilidad.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl 
                     hover:shadow-lg transition-all transform hover:scale-105"
          >
            Volver a buscar
          </button>
        </div>
      </div>
    );
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'limited':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'out-of-stock':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pre-order':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'Nuevo';
      case 'used': return 'Usado';
      case 'refurbished': return 'Reacondicionado';
      default: return condition;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'En stock';
      case 'limited': return 'Stock limitado';
      case 'out-of-stock': return 'Sin stock';
      case 'pre-order': return 'Pre-pedido';
      default: return '';
    }
  };

  // Calculate best values for highlighting
  const bestPrice = Math.min(...prices.map(p => p.price));
  const bestRating = Math.max(...prices.filter(p => p.rating).map(p => p.rating!));
  const bestShipping = Math.min(...prices.map(p => p.shipping));
  const bestTotal = Math.min(...prices.map(p => p.price + p.shipping));

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="text-left p-8 font-bold text-gray-800 w-64 text-lg">Comparación</th>
              {prices.map((price) => (
                <th key={price.id} className="p-8 text-center relative min-w-96">
                  <button
                    onClick={() => onRemove(price.id)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 transition-colors
                             group"
                    title="Eliminar de la comparación"
                  >
                    <X className="h-5 w-5 text-gray-500 group-hover:text-red-600" />
                  </button>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="text-3xl">{price.retailer.logo}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {price.retailer.name}
                        </h3>
                        {price.seller && price.seller !== price.retailer.name && (
                          <p className="text-sm text-gray-500">por {price.seller}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      price.retailer.apiType === 'real' ? 'bg-green-100 text-green-700' :
                      price.retailer.apiType === 'mock' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {price.retailer.apiType === 'real' ? 'API Real' :
                       price.retailer.apiType === 'mock' ? 'Datos Mock' : 'Web Scraping'}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* Price Row */}
            <tr className="border-t border-gray-100">
              <td className="p-8 font-bold text-gray-700 bg-gray-50 text-lg">Precio</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${
                      price.price === bestPrice ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {price.price.toFixed(2)} €
                      {price.price === bestPrice && (
                        <div className="flex items-center justify-center mt-2">
                          <Award className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Mejor precio
                          </span>
                        </div>
                      )}
                    </div>
                    {price.originalPrice && (
                      <div className="text-lg text-gray-500 line-through">
                        {price.originalPrice.toFixed(2)} €
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Condition Row */}
            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-8 font-bold text-gray-700">Estado</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    price.condition === 'new' ? 'bg-green-100 text-green-700' :
                    price.condition === 'used' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {getConditionText(price.condition)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-t border-gray-100">
              <td className="p-8 font-bold text-gray-700">Valoración</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  {price.rating ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(price.rating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className={`text-sm font-medium ${
                        price.rating === bestRating ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {price.rating} / 5
                        {price.reviewCount && (
                          <div className="text-xs text-gray-500 mt-1">
                            ({price.reviewCount.toLocaleString()} reseñas)
                          </div>
                        )}
                        {price.rating === bestRating && (
                          <div className="flex items-center justify-center mt-2">
                            <Award className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              Mejor valorado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Sin valoraciones</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Shipping Row */}
            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-8 font-bold text-gray-700">Envío</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <span className={`font-medium text-lg ${
                        price.shipping === bestShipping ? 'text-green-600' : 'text-gray-800'
                      }`}>
                        {price.shipping === 0 ? 'Gratis' : `${price.shipping.toFixed(2)} €`}
                      </span>
                    </div>
                    {price.shippingTime && (
                      <div className="text-sm text-gray-500">{price.shippingTime}</div>
                    )}
                    {price.shipping === bestShipping && price.shipping === 0 && (
                      <div className="flex items-center justify-center">
                        <Award className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          Envío gratis
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Availability Row */}
            <tr className="border-t border-gray-100">
              <td className="p-8 font-bold text-gray-700">Disponibilidad</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      {getAvailabilityIcon(price.availability)}
                      <span className={`font-medium ${
                        price.availability === 'in-stock' ? 'text-green-600' :
                        price.availability === 'limited' ? 'text-yellow-600' :
                        price.availability === 'pre-order' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {getAvailabilityText(price.availability)}
                      </span>
                    </div>
                    {price.stockQuantity && price.availability === 'limited' && (
                      <div className="text-xs text-gray-500">
                        Solo {price.stockQuantity} disponibles
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Total Cost Row */}
            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-8 font-bold text-gray-700 text-lg">Coste total</td>
              {prices.map((price) => {
                const total = price.price + price.shipping;
                const isLowest = total === bestTotal;
                return (
                  <td key={price.id} className="p-8 text-center">
                    <div className={`text-2xl font-bold ${
                      isLowest ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {total.toFixed(2)} €
                      {isLowest && (
                        <div className="flex items-center justify-center mt-2">
                          <Award className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Mejor total
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Action Row */}
            <tr className="border-t border-gray-100">
              <td className="p-8 font-bold text-gray-700 text-lg">Comprar</td>
              {prices.map((price) => (
                <td key={price.id} className="p-8 text-center">
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-orange-600
                             text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-105
                             font-medium text-lg"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Ver oferta</span>
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparisonTable;