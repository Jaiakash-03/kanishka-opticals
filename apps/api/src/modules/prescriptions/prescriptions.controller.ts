import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Prisma } from '@prisma/client';

@ApiTags('prescriptions')
@Controller({ path: 'prescriptions', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my prescriptions' })
  findAll(@CurrentUser() user: { id: string }) { return this.prescriptionsService.findAll(user.id); }

  @Post()
  @ApiOperation({ summary: 'Add a new prescription' })
  create(@CurrentUser() user: { id: string }, @Body() body: Prisma.PrescriptionCreateWithoutUserInput) {
    return this.prescriptionsService.create(user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Request prescription deletion (DPDP compliance)' })
  requestDeletion(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.prescriptionsService.requestDeletion(id, user.id);
  }
}
