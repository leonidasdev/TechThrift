import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart3, TrendingDown } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <TrendingDown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                TechThrift
              </h1>
              <p className="text-sm text-gray-500">Encuentra las mejores ofertas</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-red-50 text-red-600 font-semibold' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>Buscar</span>
            </Link>
            
            <Link
              to="/compare"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/compare') 
                  ? 'bg-red-50 text-red-600 font-semibold' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Comparar</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;