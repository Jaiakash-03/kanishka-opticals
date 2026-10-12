import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global database module.
 * Exports PrismaService so every feature module can inject it without
 * needing to import DatabaseModule individually.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
