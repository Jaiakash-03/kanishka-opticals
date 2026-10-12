'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { searchApi } from '@/lib/api-client';
import { ProductCardDto } from '@kanishka/shared-types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Search as SearchIcon } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) {
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchApi.search({ q, limit: 50 })
      .then(res => {
        const data = res as any;
        setProducts(data.hits || []);
        setTotal(data.estimatedTotalHits || data.hits?.length || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search API failed', err);
        setProducts([]);
        setLoading(false);
      });
  }, [q]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        {q ? (
          <p className="text-gray-500">
            Showing {total} results for <span className="font-semibold text-gray-900">"{q}"</span>
          </p>
        ) : (
          <p className="text-gray-500">Please enter a search term.</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
      ) : products.length === 0 && q ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
          <SearchIcon className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            We couldn't find any eyewear matching "{q}". Try checking for spelling errors or using more general terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
