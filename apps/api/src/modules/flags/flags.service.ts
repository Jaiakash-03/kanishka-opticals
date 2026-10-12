import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FlagsService {
  private cache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private readonly TTL = 60_000;
  constructor(private readonly prisma: PrismaService) {}

  async isEnabled(key: string): Promise<boolean> {
    const now = Date.now();
    const expiry = this.cacheExpiry.get(key);
    if (expiry && now < expiry && this.cache.has(key)) return this.cache.get(key) ?? false;
    const flag = await this.prisma.featureFlag.findUnique({ where: { key } });
    const enabled = flag?.enabled ?? false;
    this.cache.set(key, enabled); this.cacheExpiry.set(key, now + this.TTL);
    return enabled;
  }

  async getAll() { return this.prisma.featureFlag.findMany({ orderBy: { key: 'asc' } }); }

  async update(key: string, enabled: boolean) {
    const result = await this.prisma.featureFlag.upsert({ where: { key }, update: { enabled }, create: { key, enabled } });
    this.cache.set(key, enabled); this.cacheExpiry.set(key, Date.now() + this.TTL);
    return result;
  }
}
