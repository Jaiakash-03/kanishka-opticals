'use client';

import { useState, useEffect } from 'react';
import { catalogApi } from '@/lib/api-client';
import { useCartStore } from '@/store/cart.store';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Shield, Truck, RotateCcw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  const addToCart = useCartStore(s => s.addItem);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    catalogApi.getProductBySlug(params.slug)
      .then(res => {
        setProduct(res);
        if (res.variants && res.variants.length > 0) {
          setSelectedVariant(res.variants[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return notFound();
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    try {
      // Need lens option id later, passing undefined for now
      await addToCart(
        selectedVariant.id,
        1,
        selectedVariant.price,
        undefined,
        undefined
      );
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const images = product.images?.length > 0 ? product.images : [{ url: '', alt: 'Placeholder' }];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            {images[selectedImage]?.url ? (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">🕶️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative border-2 transition-all ${
                    selectedImage === idx ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {img.url ? (
                    <Image src={img.url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            {product.brand && <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{product.brand.name}</span>}
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{selectedVariant?.price ?? product.price}</span>
            {product.mrp > (selectedVariant?.price ?? product.price) && (
              <>
                <span className="text-lg text-gray-500 line-through mb-1">₹{product.mrp}</span>
                <span className="text-sm font-bold text-green-600 mb-1.5">
                  {Math.round(((product.mrp - (selectedVariant?.price ?? product.price)) / product.mrp) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          {/* Variants / Colors */}
          {product.variants?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {v.colour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lens Options */}
          {['eyeglasses', 'computer-glasses'].includes(product.category?.slug) && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Lens Option</h3>
              <select 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                onChange={(e) => {
                  const val = e.target.value;
                  // Just a stub for UI, normally we would fetch lens options from API
                  // and set the selected lensOptionId state
                }}
              >
                <option value="">Frame Only (Zero Power)</option>
                <option value="blue-cut">Blue Cut Lenses (+₹500)</option>
                <option value="anti-glare">Anti-Glare Lenses (+₹800)</option>
                <option value="photochromic">Photochromic Lenses (+₹1200)</option>
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || !selectedVariant || selectedVariant.stock === 0}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {addingToCart ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RotateCcw className="w-5 h-5 text-blue-500" />
              <span className="text-sm">14 Days Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
