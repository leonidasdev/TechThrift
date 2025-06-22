import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ArrowUpDown, Sparkles, Loader, AlertCircle, TrendingUp, Database } from 'lucide-react';
import SearchBar from '../components/Search/SearchBar';
import ProductGrid from '../components/Products/ProductGrid';
import PriceFilters from '../components/Filters/PriceFilters';
import { Product, SearchFilters } from '../types';
import { productService } from '../services/productService';
import { retailers } from '../data/retailers';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [comparingProducts, setComparingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [productStats, setProductStats] = useState<any>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    condition: ['new', 'used', 'refurbished'],
    priceRange: { min: 0, max: 10000 },
    retailers: retailers.map(r => r.id),
    availability: ['in-stock', 'limited', 'out-of-stock', 'pre-order'],
    sortBy: 'relevance'
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchProducts(query);
    }
    fetchProductStats();
  }, [searchParams]);

  const fetchProducts = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Starting search for: "${query}"`);
      
      // Search products from JSON files via API
      const foundProducts = await productService.searchProducts(query);
      console.log(`📦 Found ${foundProducts.length} products`);
      
      setProducts(foundProducts);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError('Error al buscar productos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const stats = await productService.getProductStats();
      setProductStats(stats);
    } catch (error) {
      console.error('Error fetching product stats:', error);
    }
  };

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    
    const sortedProducts = [...products].sort((a, b) => {
      switch (newSortBy) {
        case 'price-low':
          return (a.price + a.shipping) - (b.price + b.shipping);
        case 'price-high':
          return (b.price + b.shipping) - (a.price + a.shipping);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0; // relevance - keep original order
      }
    });
    
    setProducts(sortedProducts);
  };

  const handleCompare = (product: Product) => {
    const isAlreadyComparing = comparingProducts.some(p => p.id === product.id);
    
    if (isAlreadyComparing) {
      setComparingProducts(prev => prev.filter(p => p.id !== product.id));
    } else if (comparingProducts.length < 4) {
      setComparingProducts(prev => [...prev, product]);
    }
  };

  const handleViewComparison = () => {
    const compareIds = comparingProducts.map(p => p.id).join(',');
    navigate(`/compare?products=${compareIds}`);
  };

  const handleClearFilters = () => {
    setFilters({
      condition: ['new', 'used', 'refurbished'],
      priceRange: { min: 0, max: 10000 },
      retailers: retailers.map(r => r.id),
      availability: ['in-stock', 'limited', 'out-of-stock', 'pre-order'],
      sortBy: 'relevance'
    });
  };

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    const matchesRetailer = filters.retailers.includes(product.vendor.toLowerCase());
    const totalPrice = product.price + product.shipping;
    const matchesPrice = totalPrice >= filters.priceRange.min && totalPrice <= filters.priceRange.max;
    const matchesAvailability = filters.availability.includes(product.availability);
    
    return matchesRetailer && matchesPrice && matchesAvailability;
  });

  const isImageSearch = searchParams.get('image_search') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar productos..."
            />
          </div>

          {/* Loading State */}
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <Loader className="animate-spin h-20 w-20 text-red-600 mb-8" />
              <div className="absolute inset-0 rounded-full border-4 border-red-100"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {isImageSearch ? 'Analizando tu imagen...' : 'Buscando en archivos JSON...'}
            </h3>
            <p className="text-gray-600 text-center max-w-lg leading-relaxed">
              {isImageSearch 
                ? 'Estamos utilizando IA para identificar el producto en tu imagen y buscar ofertas similares en todas las tiendas.'
                : `Buscando "${searchQuery}" en los datos previamente recopilados de Amazon.es, MediaMarkt, PCComponentes y El Corte Inglés.`
              }
            </p>
            
            {/* Data Source Indicators */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {retailers.map((retailer, index) => (
                <div key={retailer.id} className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">{retailer.name}</span>
                  <Database className="h-3 w-3 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar productos..."
            />
          </div>

          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-red-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Error en la búsqueda</h3>
            <p className="text-gray-600 mb-8 text-center max-w-md">{error}</p>
            <button
              onClick={() => fetchProducts(searchQuery)}
              className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Buscar productos..."
          />
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <PriceFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  Resultados de búsqueda
                  {isImageSearch && (
                    <span className="ml-3 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      Búsqueda por imagen
                    </span>
                  )}
                </h1>
                <div className="text-gray-600">
                  <div className="font-medium">
                    {filteredProducts.length} productos encontrados
                  </div>
                  <div className="text-sm">
                    para "{searchQuery}"
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                    className="appearance-none bg-white border border-gray-300 rounded-xl px-6 py-3 pr-10
                             focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium"
                  >
                    <option value="relevance">Más relevante</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorado</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Data Source Status */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Fuente de datos: Archivos JSON locales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {retailers.map((retailer) => (
                  <div key={retailer.id} className="flex items-center space-x-3">
                    <div className="text-2xl">{retailer.logo}</div>
                    <div>
                      <div className="font-medium text-sm">{retailer.name}</div>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        JSON Data
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {productStats && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-800">{productStats.totalProducts}</div>
                      <div className="text-gray-500">Total productos</div>
                    </div>
                    {Object.entries(productStats.productsByRetailer || {}).map(([retailer, count]) => (
                      <div key={retailer}>
                        <div className="font-medium text-gray-800">{count as number}</div>
                        <div className="text-gray-500 capitalize">{retailer}</div>
                      </div>
                    ))}
                  </div>
                  {productStats.lastUpdated && (
                    <div className="mt-2 text-xs text-gray-500">
                      Última actualización: {new Date(productStats.lastUpdated).toLocaleString('es-ES')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comparison Bar */}
            {comparingProducts.length > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Comparar productos ({comparingProducts.length}/4)
                    </h3>
                    <p className="text-red-100">
                      {comparingProducts.map(p => p.title.substring(0, 30) + '...').join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setComparingProducts([])}
                      className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl transition-colors font-medium"
                    >
                      Limpiar todo
                    </button>
                    <button
                      onClick={handleViewComparison}
                      className="bg-white text-red-600 hover:bg-gray-50 px-8 py-3 rounded-xl 
                               font-bold transition-colors shadow-lg"
                    >
                      Comparar ahora
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onCompare={handleCompare}
                comparingProducts={comparingProducts}
              />
            ) : (
              <div className="text-center py-24">
                <div className="bg-gray-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Filter className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No se encontraron productos</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  No encontramos productos que coincidan con tu búsqueda "{searchQuery}" en los archivos JSON. 
                  Intenta con términos diferentes o ajusta los filtros.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Nueva búsqueda
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;