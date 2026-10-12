import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Public } from '../../common/decorators/roles.decorator';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { AddToCartDto, UpdateCartItemDto } from '@kanishka/shared-types';

@ApiTags('cart')
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get current cart (user or guest)' })
  async getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = (req.user as any)?.id;
    let sessionId = req.cookies['sessionId'];
    
    // Auto-generate session ID for guests
    if (!userId && !sessionId) {
      sessionId = randomUUID();
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        sameSite: 'lax',
      });
    }

    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  async addItem(@Req() req: Request, @Body() dto: AddToCartDto) {
    const userId = (req.user as any)?.id;
    const sessionId = req.cookies['sessionId'];
    
    const cart = await this.cartService.getCart(userId, sessionId);
    await this.cartService.addItem(cart.id, dto);
    
    return { success: true, message: 'Item added to cart' };
  }

  @Public()
  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    await this.cartService.updateItem(itemId, dto.quantity);
    return { success: true, message: 'Cart updated' };
  }

  @Public()
  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Param('itemId') itemId: string) {
    await this.cartService.removeItem(itemId);
    return { success: true, message: 'Item removed' };
  }

  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Req() req: Request) {
    const userId = (req.user as any)?.id;
    if (userId) {
      const cart = await this.cartService.getCart(userId);
      return this.cartService.clearCart(cart.id);
    }
    return { message: 'No user cart found' };
  }
}
