import type { Gender, LensCoating, LensMaterial, LensType } from '../enums';
import type { PaginationQuery } from '../types/pagination';

/** Product listing filter query */
export interface ProductFilterQuery extends PaginationQuery {
  category?: string;
  brand?: string;
  gender?: Gender;
  frameShape?: string;
  colour?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

/** Compact product card (used in listing pages) */
export interface ProductCardDto {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: Gender;
  frameShape: string;
  defaultVariant: {
    id: string;
    sku: string;
    colour: string;
    price: number;
    mrp: number;
    stock: number;
    primaryImage: string;
  };
  isFeatured: boolean;
}

/** Full product detail (used on product page) */
export interface ProductDetailDto extends ProductCardDto {
  description: string;
  material: string;
  variants: ProductVariantDto[];
  lensOptions: LensOptionDto[];
  relatedProducts?: ProductCardDto[];
}

/** Product variant (colour + size combination) */
export interface ProductVariantDto {
  id: string;
  sku: string;
  colour: string;
  size: string;
  frameWidthMm: number;
  price: number;
  mrp: number;
  stock: number;
  imageUrls: string[];
  isDefault: boolean;
}

/** Lens add-on option */
export interface LensOptionDto {
  id: string;
  type: LensType;
  coating: LensCoating;
  material: LensMaterial;
  addOnPrice: number;
  label: string; // Human-readable e.g. "Anti-Glare + Blue Cut"
}

/** Create/update product (admin) */
export interface CreateProductDto {
  name: string;
  categoryId: string;
  brandId: string;
  description: string;
  gender: Gender;
  frameShape: string;
  material: string;
  isFeatured?: boolean;
}

/** Create/update product variant (admin) */
export interface CreateVariantDto {
  sku: string;
  colour: string;
  size: string;
  frameWidthMm?: number;
  price: number;
  mrp: number;
  stock: number;
  imageUrls?: string[];
  isDefault?: boolean;
}

/** Category list item */
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  productCount?: number;
}

/** Brand list item */
export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  productCount?: number;
}

/** Bulk import row (from CSV/Excel) */
export interface ImportRowDto {
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  size?: string;
  colour?: string;
  material?: string;
  frameShape?: string;
  gender?: string;
  stock: number;
  sku: string;
  description?: string;
  imageUrls?: string;
}
