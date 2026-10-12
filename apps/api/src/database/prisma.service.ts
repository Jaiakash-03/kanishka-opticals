import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * Prisma service wrapping PrismaClient.
 * Handles connection lifecycle and query logging.
 * Injected into feature services via DatabaseModule (global).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: { url: config.get<string>('DATABASE_URL') },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to PostgreSQL via Prisma...');
    await this.$connect();
    this.logger.log('✅ PostgreSQL connected');

    // Log slow queries (> 500ms) in development
    if (this.config.get('NODE_ENV') === 'development') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$on as any)('query', (event: { duration: number; query: string }) => {
        if (event.duration > 500) {
          this.logger.warn(`Slow query (${event.duration}ms): ${event.query}`);
        }
      });
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from PostgreSQL...');
    await this.$disconnect();
  }


}
