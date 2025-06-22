import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, TrendingUp, Shield, Zap, Euro } from 'lucide-react';
import SearchBar from '../components/Search/SearchBar';
import ImageUpload from '../components/Search/ImageUpload';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'image'>('text');
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const handleImageSearch = (imageData: string) => {
    // In a real app, you would process the image and extract keywords
    // For now, we'll simulate this by redirecting to results with a generic query
    navigate('/results?q=smartphone&image_search=true');
  };

  const handleImageUpload = (file: File) => {
    console.log('Imagen subida:', file.name);
  };

  const features = [
    {
      icon: <Search className="h-8 w-8 text-red-600" />,
      title: 'Búsqueda inteligente',
      description: 'Encuentra productos en las principales tiendas españolas con algoritmos avanzados'
    },
    {
      icon: <Euro className="h-8 w-8 text-green-600" />,
      title: 'Comparación de precios',
      description: 'Compara precios, gastos de envío y ofertas de Amazon, MediaMarkt, PCComponentes y El Corte Inglés'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Mejores ofertas',
      description: 'Nuestra IA destaca automáticamente las mejores ofertas y oportunidades de ahorro'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'Actualizaciones en tiempo real',
      description: 'Recibe actualizaciones de precios en vivo y notificaciones de disponibilidad'
    }
  ];

  const popularSearches = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'MacBook Air M3',
    'PlayStation 5',
    'AirPods Pro',
    'Nintendo Switch',
    'iPad Air',
    'Sony WH-1000XM5'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 
                       bg-clip-text text-transparent mb-6">
            Encuentra las mejores ofertas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Busca, compara y ahorra en millones de productos de Amazon.es, MediaMarkt, PCComponentes y El Corte Inglés. 
            Nuestro asistente inteligente encuentra las mejores ofertas para que no tengas que hacerlo tú.
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <button
              onClick={() => setSearchMode('text')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                searchMode === 'text'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>Búsqueda por texto</span>
            </button>
            <button
              onClick={() => setSearchMode('image')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                searchMode === 'image'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span>Búsqueda por imagen</span>
            </button>
          </div>
        </div>

        {/* Search Interface */}
        <div className="mb-20">
          {searchMode === 'text' ? (
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar cualquier producto..."
              autoFocus
            />
          ) : (
            <ImageUpload
              onImageUpload={handleImageUpload}
              onImageSearch={handleImageSearch}
            />
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Búsquedas populares
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200
                         hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all
                         shadow-sm hover:shadow-md"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Retailers Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Comparamos precios en las mejores tiendas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Amazon.es', logo: '📦', color: 'from-yellow-400 to-orange-500' },
              { name: 'MediaMarkt', logo: '🔴', color: 'from-red-500 to-red-600' },
              { name: 'PcComponentes', logo: '🖥️', color: 'from-orange-500 to-red-500' },
              { name: 'El Corte Inglés', logo: '🏬', color: 'from-green-500 to-green-600' }
            ].map((retailer) => (
              <div
                key={retailer.name}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center
                         hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${retailer.color} w-16 h-16 rounded-2xl
                              flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {retailer.logo}
                </div>
                <h3 className="font-semibold text-gray-800">{retailer.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center
                       hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl
                            flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;