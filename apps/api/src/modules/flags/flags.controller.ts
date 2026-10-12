import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FlagsService } from './flags.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@kanishka/shared-types';

@ApiTags('admin')
@Controller({ path: 'admin/flags', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('access-token')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}
  @Get() @ApiOperation({ summary: '[Admin] Get all feature flags' }) getAll() { return this.flagsService.getAll(); }
  @Patch(':key') @ApiOperation({ summary: '[Admin] Update feature flag' }) update(@Param('key') key: string, @Body('enabled') enabled: boolean) { return this.flagsService.update(key, enabled); }
}
