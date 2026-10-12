import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as XLSX from 'xlsx';

export interface ImportResult { total: number; successful: number; failed: number; errors: { row: number; sku: string; error: string }[] }

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  constructor(private readonly prisma: PrismaService) {}

  async importFromBuffer(buffer: Buffer, _mimeType: string): Promise<ImportResult> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]!]!;
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    const result: ImportResult = { total: rows.length, successful: 0, failed: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      try {
        await this.processRow(row);
        result.successful++;
      } catch (err) {
        result.failed++;
        result.errors.push({ row: i + 2, sku: String(row['SKU'] ?? ''), error: (err as Error).message });
      }
    }
    this.logger.log(`Import: ${result.successful}/${result.total} rows successful`);
    return result;
  }

  private async processRow(row: Record<string, unknown>) {
    const required = ['name', 'brand', 'category', 'price', 'mrp', 'stock', 'SKU'];
    for (const f of required) { if (!row[f] && row[f] !== 0) throw new Error(`Missing: ${f}`); }

    const category = await this.prisma.category.findFirst({ where: { name: { equals: String(row['category']), mode: 'insensitive' } } });
    if (!category) throw new Error(`Category not found: ${row['category']}`);
    const brand = await this.prisma.brand.findFirst({ where: { name: { equals: String(row['brand']), mode: 'insensitive' } } });
    if (!brand) throw new Error(`Brand not found: ${row['brand']}`);
    const slug = String(row['name']).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + String(row['SKU']).toLowerCase();

    const product = await this.prisma.product.upsert({
      where: { slug }, update: {},
      create: { name: String(row['name']), slug, categoryId: category.id, brandId: brand.id, description: row['description'] ? String(row['description']) : null, gender: (String(row['gender'] ?? 'UNISEX').toUpperCase()) as never, frameShape: row['frame shape'] ? String(row['frame shape']) : null, material: row['material'] ? String(row['material']) : null },
    });

    await this.prisma.productVariant.upsert({
      where: { sku: String(row['SKU']) },
      update: { stock: Number(row['stock']), price: Number(row['price']), mrp: Number(row['mrp']) },
      create: { productId: product.id, sku: String(row['SKU']), colour: row['colour'] ? String(row['colour']) : 'Default', size: row['size'] ? String(row['size']) : 'M', price: Number(row['price']), mrp: Number(row['mrp']), stock: Number(row['stock']), imageUrls: row['image URLs'] ? String(row['image URLs']).split(',').map(u => u.trim()) : [], isDefault: true },
    });
  }
}
