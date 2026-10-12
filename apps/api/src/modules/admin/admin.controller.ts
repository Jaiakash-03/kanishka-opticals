import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from '../catalog/catalog.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@kanishka/shared-types';
import type { Prisma } from '@prisma/client';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly appointmentsService: AppointmentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('metrics') @ApiOperation({ summary: '[Admin] Get dashboard metrics' })
  async getMetrics() {
    // Basic implementation for metrics
    const [orders, appointments] = await Promise.all([
      this.ordersService.getAllOrders(1, 1000), // simplistic approach
      this.appointmentsService.getAll(1, 1000),
    ]);
    
    const totalRevenue = orders.items.reduce((sum, order) => sum + Number(order.total), 0);
    const pendingAppointments = appointments.items.filter(a => a.status === 'BOOKED').length;

    return {
      totalRevenue,
      totalOrders: orders.meta.total,
      pendingAppointments,
    };
  }

  @Get('appointments') @ApiOperation({ summary: '[Admin] List appointments' })
  getAppointments(@Query() q: Record<string, string>) { 
    return this.appointmentsService.getAll(+(q['page'] ?? 1), +(q['limit'] ?? 20)); 
  }

  @Patch('appointments/:id/status') @ApiOperation({ summary: '[Admin] Update appointment status' })
  updateAppointmentStatus(@Param('id') id: string, @Body('status') status: any) { 
    return this.appointmentsService.updateStatus(id, status); 
  }

  @Get('products') @ApiOperation({ summary: '[Admin] List all products' })
  getProducts(@Query() q: Record<string, string>) { return this.catalogService.getProducts({ page: +(q['page'] ?? 1), limit: +(q['limit'] ?? 20) }); }

  @Post('products') @ApiOperation({ summary: '[Admin] Create product' })
  createProduct(@Body() body: Prisma.ProductCreateInput) { return this.catalogService.createProduct(body); }

  @Put('products/:id') @ApiOperation({ summary: '[Admin] Update product' })
  updateProduct(@Param('id') id: string, @Body() body: Prisma.ProductUpdateInput) { return this.catalogService.updateProduct(id, body); }

  @Delete('products/:id') @ApiOperation({ summary: '[Admin] Soft-delete product' })
  deleteProduct(@Param('id') id: string) { return this.catalogService.deleteProduct(id); }

  @Put('variants/:id/stock') @ApiOperation({ summary: '[Admin] Update variant stock' })
  updateStock(@Param('id') id: string, @Body('stock') stock: number) { return this.catalogService.updateStock(id, stock); }
}
