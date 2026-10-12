import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: MeiliSearch;
  private readonly INDEX = 'products';

  constructor(private readonly config: ConfigService) {
    this.client = new MeiliSearch({
      host: config.get<string>('meilisearch.host', 'http://localhost:7700'),
      apiKey: config.get<string>('meilisearch.masterKey'),
    });
  }

  async onModuleInit() {
    const index = this.client.index(this.INDEX);
    await index.updateSettings({
      searchableAttributes: ['name', 'description', 'brand', 'category', 'colour', 'material', 'frameShape'],
      filterableAttributes: ['category', 'brand', 'gender', 'frameShape', 'colour', 'price', 'stock', 'isFeatured'],
      sortableAttributes: ['price', 'mrp', 'createdAt'],
      typoTolerance: { enabled: true, minWordSizeForTypos: { oneTypo: 5, twoTypos: 9 } },
    });
  }

  async search(query: string, options?: { filters?: string; page?: number; limit?: number; sort?: string[] }) {
    const index = this.client.index(this.INDEX);
    return index.search(query, {
      filter: options?.filters,
      hitsPerPage: options?.limit ?? 20,
      page: options?.page ?? 1,
      sort: options?.sort,
    });
  }

  async indexProduct(product: Record<string, unknown>) {
    const index = this.client.index(this.INDEX);
    await index.addDocuments([product]);
  }

  async removeProduct(id: string) {
    await this.client.index(this.INDEX).deleteDocument(id);
  }

  async bulkIndexProducts(products: Record<string, unknown>[]) {
    await this.client.index(this.INDEX).addDocuments(products, { primaryKey: 'id' });
  }
}
