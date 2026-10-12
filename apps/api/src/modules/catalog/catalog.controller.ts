import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { Public } from '../../common/decorators/roles.decorator';

@ApiTags('catalog')
@Controller({ path: 'catalog', version: '1' })
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'List products with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'gender', required: false, enum: ['MEN', 'WOMEN', 'UNISEX', 'KIDS'] })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  getProducts(@Query() query: Record<string, string>) {
    return this.catalogService.getProducts({
      page: query['page'] ? parseInt(query['page']) : undefined,
      limit: query['limit'] ? parseInt(query['limit']) : undefined,
      category: query['category'],
      brand: query['brand'],
      gender: query['gender'],
      minPrice: query['minPrice'] ? parseFloat(query['minPrice']) : undefined,
      maxPrice: query['maxPrice'] ? parseFloat(query['maxPrice']) : undefined,
      inStock: query['inStock'] === 'true',
      featured: query['featured'] !== undefined ? query['featured'] === 'true' : undefined,
      sortBy: query['sortBy'],
      sortOrder: query['sortOrder'] as 'asc' | 'desc' | undefined,
    });
  }

  @Public()
  @Get('products/featured')
  @ApiOperation({ summary: 'Get featured products for homepage' })
  getFeatured(@Query('limit') limit?: string) {
    return this.catalogService.getFeaturedProducts(limit ? parseInt(limit) : 8);
  }

  @Public()
  @Get('products/:slug')
  @ApiOperation({ summary: 'Get product detail by slug' })
  getProduct(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all active categories' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Public()
  @Get('brands')
  @ApiOperation({ summary: 'Get all active brands' })
  getBrands() {
    return this.catalogService.getBrands();
  }

  @Public()
  @Get('lens-options')
  @ApiOperation({ summary: 'Get available lens add-on options' })
  getLensOptions() {
    return this.catalogService.getLensOptions();
  }
}
