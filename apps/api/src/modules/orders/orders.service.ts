import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CartService } from '../cart/cart.service';
import type { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `KO${yymmdd}-${rand}`;
  }

  async createOrderFromCart(
    cartId: string, 
    userId: string | undefined, 
    shippingAddressId: string,
    guestInfo?: { email: string; phone: string; name: string }
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch cart and calculate totals
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              variant: { include: { product: true } },
              lensOption: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let subtotal = 0;
      const orderItemsData = [];

      // 2. Validate stock and build order items
      for (const item of cart.items) {
        if (item.variant.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${item.variant.sku}`);
        }

        const unitPrice = Number(item.unitPrice);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          variantId: item.variantId,
          lensOptionId: item.lensOptionId,
          prescriptionId: item.prescriptionId,
          productName: item.variant.product.name,
          variantSku: item.variant.sku,
          colour: item.variant.colour,
          imageUrl: item.variant.imageUrls?.[0] ?? null,
          quantity: item.quantity,
          unitPrice,
          totalPrice: itemTotal,
        });

        // Decrement stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Create the order
      const shippingFee = subtotal > 999 ? 0 : 50; // Free shipping over 999
      const total = subtotal + shippingFee;

      const order = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          userId,
          shippingAddressId,
          status: 'PENDING',
          subtotal,
          shippingFee,
          discount: 0,
          taxAmount: 0, // Simplified for now
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // 4. Clear cart
      await tx.cartItem.deleteMany({ where: { cartId } });

      this.logger.log(`Order created: ${order.orderNumber}`);
      return order;
    });
  }

  async getOrderById(id: string, userId?: string) {
    const order = await this.prisma.order.findFirst({ 
      where: { id, ...(userId && { userId }) }, 
      include: { items: true, payments: true, shippingAddress: true } 
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getUserOrders(userId: string, page = 1, limit = 10) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({ 
        where: { userId }, 
        skip: (page - 1) * limit, 
        take: limit, 
        orderBy: { createdAt: 'desc' }, 
        include: { items: true, payments: true } 
      }), 
      this.prisma.order.count({ where: { userId } })
    ]);
    return { 
      items: orders, 
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) } 
    };
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({ 
      where: { id }, 
      data: { status } 
    });
  }

  async getAllOrders(page = 1, limit = 20, status?: OrderStatus) {
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({ 
        where, 
        skip: (page - 1) * limit, 
        take: limit, 
        orderBy: { createdAt: 'desc' }, 
        include: { items: true, user: { select: { name: true, email: true } } } 
      }), 
      this.prisma.order.count({ where })
    ]);
    return { items: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
