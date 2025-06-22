import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onCompare?: (product: Product) => void;
  comparingProducts?: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onCompare, 
  comparingProducts = [] 
}) => {
  // Find the best deal (lowest total price including shipping)
  const bestDealId = products.reduce((best, current) => {
    const bestTotal = best ? best.price + best.shipping : Infinity;
    const currentTotal = current.price + current.shipping;
    return currentTotal < bestTotal ? current : best;
  }, null as Product | null)?.id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isBestDeal={product.id === bestDealId}
          onCompare={onCompare}
          isComparing={comparingProducts.some(p => p.id === product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;