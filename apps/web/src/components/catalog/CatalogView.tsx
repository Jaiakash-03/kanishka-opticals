'use client';

import { useState, useEffect } from 'react';
import { catalogApi, searchApi } from '@/lib/api-client';
import { ProductCardDto } from '@kanishka/shared-types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface CatalogViewProps {
  categorySlug: string;
}

export function CatalogView({ categorySlug }: CatalogViewProps) {
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Use search API to fetch products with the category filter
    // If search API is down, fallback to catalogApi.getProducts
    searchApi.search({ q: '', category: categorySlug, limit: 50 })
      .then(res => {
        const data = res as any;
        setProducts(data.hits || []);
        setTotal(data.estimatedTotalHits || data.hits?.length || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search API failed, falling back to catalog API', err);
        catalogApi.getProducts({ limit: 50 }).then(res => {
          // Filter manually just for the stub
          const filtered = res.items.filter((p: any) => p.category?.slug === categorySlug);
          setProducts(filtered);
          setTotal(filtered.length);
          setLoading(false);
        }).catch(() => setLoading(false));
      });
  }, [categorySlug]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 capitalize">
            {categorySlug.replace('-', ' ')}
          </h1>
          <p className="mt-2 text-gray-500">Showing {total} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Hidden on Mobile) */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> Under ₹999
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> ₹1000 - ₹1999
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> ₹2000 - ₹4999
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> Above ₹5000
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shape</h3>
            <div className="space-y-2">
              {['Rectangle', 'Round', 'Aviator', 'Cat Eye', 'Square'].map(shape => (
                <label key={shape} className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> {shape}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
