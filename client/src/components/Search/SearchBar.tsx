import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { SearchSuggestion } from '../../types';
import { searchSuggestions } from '../../data/mockData';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar productos...",
  autoFocus = false,
  disabled = false,
  'aria-label': ariaLabel = "Buscar productos"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  // Filter suggestions based on debounced input
  useEffect(() => {
    if (debouncedValue.trim()) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      // Show recent searches and popular suggestions
      const recent = recentSearches.slice(0, 5).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: 'recent' as const
      }));
      const popular = searchSuggestions.filter(s => s.type === 'popular').slice(0, 5);
      setFilteredSuggestions([...recent, ...popular]);
    }
    setSelectedIndex(-1);
  }, [debouncedValue, recentSearches]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      // Add to recent searches
      const newRecentSearches = [
        value.trim(),
        ...recentSearches.filter(search => search !== value.trim())
      ].slice(0, 10);
      setRecentSearches(newRecentSearches);
      
      onSearch(value.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value, disabled, onSearch, recentSearches, setRecentSearches]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    if (disabled) return;
    
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [disabled, onChange, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [disabled, selectedIndex, filteredSuggestions, handleSuggestionClick, handleSubmit]);

  const handleClear = useCallback(() => {
    if (disabled) return;
    onChange('');
    inputRef.current?.focus();
  }, [disabled, onChange]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <Tag className="h-4 w-4 text-blue-500" />;
    }
  };

  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <label htmlFor="search-input" className="sr-only">
            {ariaLabel}
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => !disabled && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
            className="w-full px-6 py-4 pl-14 pr-12 text-lg border-2 border-gray-200 rounded-2xl 
                     focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all
                     shadow-lg group-hover:shadow-xl bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                       hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {isOpen && !disabled && (
        <div 
          className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 
                    max-h-96 overflow-y-auto z-50"
          role="listbox"
          aria-label="Sugerencias de búsqueda"
        >
          {Object.entries(groupedSuggestions).map(([type, suggestions]) => (
            <div key={type} className="p-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {type === 'recent' && 'Búsquedas recientes'}
                {type === 'popular' && 'Búsquedas populares'}
                {type === 'category' && 'Categorías'}
              </div>
              {suggestions.map((suggestion, index) => {
                const globalIndex = Object.entries(groupedSuggestions)
                  .slice(0, Object.keys(groupedSuggestions).indexOf(type))
                  .reduce((acc, [, items]) => acc + items.length, 0) + index;
                
                return (
                  <button
                    key={suggestion.id}
                    id={`suggestion-${globalIndex}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    role="option"
                    aria-selected={selectedIndex === globalIndex}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg 
                              transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              selectedIndex === globalIndex 
                                ? 'bg-red-50 text-red-700' 
                                : 'hover:bg-gray-50'
                            }`}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {suggestion.text}
                      </span>
                      {suggestion.category && (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {suggestion.category}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchBar);