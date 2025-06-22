import React from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from '../../types';
import { retailers } from '../../data/retailers';

interface PriceFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PriceFilters: React.FC<PriceFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}) => {
  const handleConditionChange = (condition: 'new' | 'used' | 'refurbished') => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition];
    
    onFiltersChange({
      ...filters,
      condition: newConditions
    });
  };

  const handleRetailerChange = (retailerId: string) => {
    const newRetailers = filters.retailers.includes(retailerId)
      ? filters.retailers.filter(r => r !== retailerId)
      : [...filters.retailers, retailerId];
    
    onFiltersChange({
      ...filters,
      retailers: newRetailers
    });
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: value
      }
    });
  };

  const handleAvailabilityChange = (availability: 'in-stock' | 'limited' | 'out-of-stock' | 'pre-order') => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    
    onFiltersChange({
      ...filters,
      availability: newAvailability
    });
  };

  const hasActiveFilters = 
    filters.condition.length < 3 ||
    filters.retailers.length < retailers.length ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 10000 ||
    filters.availability.length < 4;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 text-lg font-semibold text-gray-800"
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                Activos
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Condition Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado</h3>
            <div className="space-y-2">
              {[
                { value: 'new', label: 'Nuevo' },
                { value: 'used', label: 'Usado' },
                { value: 'refurbished', label: 'Reacondicionado' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.condition.includes(value as any)}
                    onChange={() => handleConditionChange(value as any)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Rango de precio</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0 €"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="10000 €"
                />
              </div>
            </div>
          </div>

          {/* Retailers Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tiendas</h3>
            <div className="space-y-2">
              {retailers.map((retailer) => (
                <label key={retailer.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.retailers.includes(retailer.id)}
                    onChange={() => handleRetailerChange(retailer.id)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-lg">{retailer.logo}</span>
                  <span className="text-sm text-gray-700">{retailer.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Disponibilidad</h3>
            <div className="space-y-2">
              {[
                { value: 'in-stock', label: 'En stock' },
                { value: 'limited', label: 'Stock limitado' },
                { value: 'out-of-stock', label: 'Sin stock' },
                { value: 'pre-order', label: 'Pre-pedido' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(value as any)}
                    onChange={() => handleAvailabilityChange(value as any)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilters;