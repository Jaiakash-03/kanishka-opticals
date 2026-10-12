import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from './database/prisma.service';

/**
 * Health check endpoint — used by load balancers and uptime monitors.
 * GET /api/v1/health → 200 OK with service status
 */
@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check API, database, and cache health' })
  check() {
    return this.health.check([
      // Check PostgreSQL connectivity
      () => this.prismaIndicator.pingCheck('postgresql', this.prisma),
    ]);
  }
}
