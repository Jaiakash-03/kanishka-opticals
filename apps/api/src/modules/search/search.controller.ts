import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/roles.decorator';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Full-text product search powered by Meilisearch' })
  async search(
    @Query('q') q = '',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('gender') gender?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const filters: string[] = [];
    if (category) filters.push(`category = '${category}'`);
    if (brand) filters.push(`brand = '${brand}'`);
    if (gender) filters.push(`gender = '${gender}'`);
    if (minPrice) filters.push(`price >= ${minPrice}`);
    if (maxPrice) filters.push(`price <= ${maxPrice}`);
    const sort = sortBy ? [`${sortBy}:${sortOrder}`] : undefined;
    return this.searchService.search(q, { filters: filters.join(' AND ') || undefined, page: Number(page), limit: Number(limit), sort });
  }
}
