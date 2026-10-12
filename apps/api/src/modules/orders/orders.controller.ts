import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Public } from '../../common/decorators/roles.decorator';
import { UserRole } from '@kanishka/shared-types';

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('checkout')
  @ApiOperation({ summary: 'Create an order from the current cart' })
  async checkout(
    @Req() req: Request,
    @Body() dto: { shippingAddressId: string }
  ) {
    const userId = (req.user as any).id;
    const cart = await this.cartService.getCart(userId);
    const order = await this.ordersService.createOrderFromCart(cart.id, userId, dto.shippingAddressId);
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Get current user orders' })
  async getMyOrders(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const userId = (req.user as any).id;
    return this.ordersService.getUserOrders(userId, Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my/:id')
  @ApiOperation({ summary: 'Get order details for current user' })
  async getMyOrderById(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    return this.ordersService.getOrderById(id, userId);
  }

  // â”€â”€ Admin Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Admin: Get all orders' })
  async getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: any
  ) {
    return this.ordersService.getAllOrders(Number(page), Number(limit), status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update order status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.ordersService.updateStatus(id, status);
  }
}
