import React from 'react';
import { Star, Truck, ExternalLink, X, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { ProductPrice } from '../../types';

interface ComparisonTableProps {
  prices: ProductPrice[];
  onRemove: (priceId: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ prices, onRemove }) => {
  if (prices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay productos para comparar</h3>
          <p className="text-gray-600 mb-6">
            Añade productos desde los resultados de búsqueda para comparar precios y características.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
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

  // Find the best values for highlighting
  const bestPrice = Math.min(...prices.map(p => p.price));
  const bestRating = Math.max(...prices.filter(p => p.rating).map(p => p.rating!));
  const bestShipping = Math.min(...prices.map(p => p.shipping));
  const bestTotal = Math.min(...prices.map(p => p.price + p.shipping));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="text-left p-6 font-semibold text-gray-800 w-48">Producto</th>
              {prices.map((price) => (
                <th key={price.id} className="p-6 text-center relative min-w-80">
                  <button
                    onClick={() => onRemove(price.id)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">{price.retailer.logo}</span>
                      <h3 className="text-sm font-medium text-gray-800">
                        {price.retailer.name}
                      </h3>
                    </div>
                    {price.seller && price.seller !== price.retailer.name && (
                      <p className="text-xs text-gray-500">por {price.seller}</p>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="p-6 font-semibold text-gray-700 bg-gray-50">Precio</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
                  <div className="space-y-1">
                    <div className={`text-xl font-bold ${
                      price.price === bestPrice ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {price.price.toFixed(2)} €
                      {price.price === bestPrice && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Mejor precio
                        </span>
                      )}
                    </div>
                    {price.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {price.originalPrice.toFixed(2)} €
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-6 font-semibold text-gray-700">Estado</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    price.condition === 'new' ? 'bg-green-100 text-green-700' :
                    price.condition === 'used' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {getConditionText(price.condition)}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-t border-gray-100">
              <td className="p-6 font-semibold text-gray-700">Valoración</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
                  {price.rating ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1">
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
                      <div className={`text-sm font-medium ${
                        price.rating === bestRating ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {price.rating} ({price.reviewCount?.toLocaleString()})
                        {price.rating === bestRating && (
                          <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1">
                            Mejor valorado
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

            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-6 font-semibold text-gray-700">Envío</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className={`font-medium ${
                        price.shipping === bestShipping ? 'text-green-600' : 'text-gray-800'
                      }`}>
                        {price.shipping === 0 ? 'Gratis' : `${price.shipping.toFixed(2)} €`}
                        {price.shipping === bestShipping && price.shipping === 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Mejor
                          </span>
                        )}
                      </span>
                    </div>
                    {price.shippingTime && (
                      <div className="text-xs text-gray-500">{price.shippingTime}</div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-t border-gray-100">
              <td className="p-6 font-semibold text-gray-700">Disponibilidad</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
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
                </td>
              ))}
            </tr>

            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="p-6 font-semibold text-gray-700">Coste total</td>
              {prices.map((price) => {
                const total = price.price + price.shipping;
                const isLowest = total === bestTotal;
                return (
                  <td key={price.id} className="p-6 text-center">
                    <div className={`text-lg font-bold ${
                      isLowest ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {total.toFixed(2)} €
                      {isLowest && (
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1">
                          Mejor total
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr className="border-t border-gray-100">
              <td className="p-6 font-semibold text-gray-700">Acción</td>
              {prices.map((price) => (
                <td key={price.id} className="p-6 text-center">
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600
                             text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Comprar</span>
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

export default ComparisonTable;