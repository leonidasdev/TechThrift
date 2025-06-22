import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingDown, Award, Lightbulb } from 'lucide-react';
import ProductComparisonTable from '../components/Products/ProductComparisonTable';
import { ProductPrice } from '../types';
import { mockProductPrices } from '../data/mockData';

const Compare: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [prices, setPrices] = useState<ProductPrice[]>([]);

  useEffect(() => {
    const priceIds = searchParams.get('prices');
    if (priceIds) {
      const ids = priceIds.split(',');
      const selectedPrices = mockProductPrices.filter(price => ids.includes(price.id));
      setPrices(selectedPrices);
    }
  }, [searchParams]);

  const handleRemove = (priceId: string) => {
    const updatedPrices = prices.filter(p => p.id !== priceId);
    setPrices(updatedPrices);
    
    if (updatedPrices.length === 0) {
      navigate('/');
    } else {
      const newIds = updatedPrices.map(p => p.id).join(',');
      navigate(`/compare?prices=${newIds}`, { replace: true });
    }
  };

  const handleAddMore = () => {
    navigate(-1);
  };

  // Calculate savings and insights
  const bestDeal = prices.length > 0 ? prices.reduce((best, current) => {
    const bestTotal = best.price + best.shipping;
    const currentTotal = current.price + current.shipping;
    return currentTotal < bestTotal ? current : best;
  }) : null;

  const worstDeal = prices.length > 0 ? prices.reduce((worst, current) => {
    const worstTotal = worst.price + worst.shipping;
    const currentTotal = current.price + current.shipping;
    return currentTotal > worstTotal ? current : worst;
  }) : null;

  const maxSavings = bestDeal && worstDeal ? 
    (worstDeal.price + worstDeal.shipping) - (bestDeal.price + bestDeal.shipping) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors
                       bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center">
                <TrendingDown className="h-10 w-10 text-red-600 mr-3" />
                Comparación de productos
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Análisis detallado de {prices.length} producto{prices.length !== 1 ? 's' : ''} 
                {maxSavings > 0 && (
                  <span className="ml-2 text-green-600 font-semibold">
                    • Ahorra hasta {maxSavings.toFixed(2)} €
                  </span>
                )}
              </p>
            </div>
          </div>

          {prices.length > 0 && prices.length < 4 && (
            <button
              onClick={handleAddMore}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 
                       text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Añadir más productos</span>
            </button>
          )}
        </div>

        {/* Savings Highlight */}
        {bestDeal && worstDeal && maxSavings > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">¡Oportunidad de ahorro!</h3>
                  <p className="text-green-100">
                    Puedes ahorrar {maxSavings.toFixed(2)} € eligiendo {bestDeal.retailer.name} 
                    en lugar de {worstDeal.retailer.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{maxSavings.toFixed(2)} €</div>
                <div className="text-green-100">de ahorro</div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <ProductComparisonTable
          prices={prices}
          onRemove={handleRemove}
        />

        {/* Shopping Tips */}
        {prices.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800">Consejos para una compra inteligente</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-blue-700">
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">💰 Mejor valor total</h4>
                <p className="text-sm leading-relaxed">
                  No solo mires el precio base. Considera el coste total incluyendo gastos de envío 
                  para obtener el mejor valor real.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">⭐ Valoraciones importantes</h4>
                <p className="text-sm leading-relaxed">
                  Las valoraciones altas (4+ estrellas) con muchas reseñas suelen indicar 
                  mejor calidad y satisfacción del cliente.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">📦 Disponibilidad clave</h4>
                <p className="text-sm leading-relaxed">
                  Verifica que el producto esté en stock. Los productos con stock limitado 
                  pueden agotarse rápidamente.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">🏪 Confianza del vendedor</h4>
                <p className="text-sm leading-relaxed">
                  Compra a vendedores de confianza con buenas políticas de devolución 
                  y servicio al cliente establecido.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">🚚 Tiempos de entrega</h4>
                <p className="text-sm leading-relaxed">
                  Si necesitas el producto urgentemente, prioriza opciones con envío rápido 
                  aunque el precio sea ligeramente superior.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                <h4 className="font-bold mb-3 text-blue-800">🔄 Políticas de devolución</h4>
                <p className="text-sm leading-relaxed">
                  Revisa las políticas de devolución antes de comprar. Algunos vendedores 
                  ofrecen mejores condiciones que otros.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;