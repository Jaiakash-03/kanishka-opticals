'use client';

import { useState, useEffect } from 'react';
import { catalogApi } from '@/lib/api-client';
import { ProductCardDto } from '@kanishka/shared-types';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.getFeatured(8).then(res => {
      setProducts(res);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load featured products', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500 py-8">No featured products available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
