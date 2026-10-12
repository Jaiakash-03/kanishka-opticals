import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { Gender, Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Products ────────────────────────────────────────────────────────────────

  async getProducts(query: {
    page?: number; limit?: number; category?: string; brand?: string;
    gender?: string; minPrice?: number; maxPrice?: number;
    inStock?: boolean; featured?: boolean; sortBy?: string; sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, category, brand, gender, minPrice, maxPrice, inStock, featured, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(brand && { brand: { slug: brand } }),
      ...(gender && { gender: gender as Gender }),
      ...(featured !== undefined && { isFeatured: featured }),
      variants: {
        some: {
          isActive: true,
          ...(inStock && { stock: { gt: 0 } }),
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        },
      },
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price'
        ? { variants: { _count: sortOrder } }
        : { [sortBy]: sortOrder };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          variants: {
            where: { isDefault: true, isActive: true },
            take: 1,
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true }, orderBy: { isDefault: 'desc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getFeaturedProducts(limit = 8) {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      include: {
        brand: { select: { name: true, slug: true } },
        variants: { where: { isDefault: true, isActive: true }, take: 1 },
      },
    });
  }

  async getLensOptions() {
    return this.prisma.lensOption.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ── Categories ─────────────────────────────────────────────────────────────

  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } }, _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ── Brands ─────────────────────────────────────────────────────────────────

  async getBrands() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  // ── Admin: create / update / delete ────────────────────────────────────────

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data, include: { category: true, brand: true } });
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data, include: { category: true, brand: true } });
  }

  async deleteProduct(id: string) {
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { message: 'Product deactivated' };
  }

  async createVariant(productId: string, data: Prisma.ProductVariantCreateWithoutProductInput) {
    return this.prisma.productVariant.create({ data: { ...data, productId } });
  }

  async updateVariant(id: string, data: Prisma.ProductVariantUpdateInput) {
    return this.prisma.productVariant.update({ where: { id }, data });
  }

  async updateStock(variantId: string, stock: number) {
    return this.prisma.productVariant.update({ where: { id: variantId }, data: { stock } });
  }
}
