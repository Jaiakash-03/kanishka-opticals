import Link from 'next/link';
import Image from 'next/image';
import { ProductCardDto } from '@kanishka/shared-types';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl bg-gray-100">
            🕶️
          </div>
        )}
        {/* Discount Badge */}
        {product.mrp > product.price && (
          <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
          </div>
        )}
        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm backdrop-blur-sm">
            {product.brand.name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
