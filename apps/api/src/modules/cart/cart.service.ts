import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { CartDto, CartItemDto } from '@kanishka/shared-types';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId?: string, sessionId?: string): Promise<CartDto> {
    if (!userId && !sessionId) {
      throw new BadRequestException('Either userId or sessionId must be provided');
    }

    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { brand: true },
                },
              },
            },
            lensOption: true,
            prescription: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, sessionId },
        include: {
          items: {
            include: {
              variant: { include: { product: { include: { brand: true } } } },
              lensOption: true,
              prescription: { select: { id: true, name: true } },
            },
          },
        },
      });
    }

    return this.formatCartDto(cart);
  }

  async addItem(
    cartId: string,
    data: { variantId: string; quantity: number; lensOptionId?: string; prescriptionId?: string },
  ) {
    // Validate variant exists and get price
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: data.variantId },
    });
    if (!variant || !variant.isActive) throw new NotFoundException('Product variant not available');

    // Calculate total unit price including lens option if any
    let unitPrice = Number(variant.price);
    if (data.lensOptionId) {
      const lens = await this.prisma.lensOption.findUnique({ where: { id: data.lensOptionId } });
      if (!lens || !lens.isActive) throw new NotFoundException('Lens option not available');
      unitPrice += Number(lens.addOnPrice);
    }

    const existing = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        variantId: data.variantId,
        lensOptionId: data.lensOptionId ?? null,
        prescriptionId: data.prescriptionId ?? null,
      },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        variantId: data.variantId,
        lensOptionId: data.lensOptionId,
        prescriptionId: data.prescriptionId,
        quantity: data.quantity,
        unitPrice,
      },
    });
  }

  async updateItem(itemId: string, quantity: number) {
    if (quantity <= 0) return this.removeItem(itemId);
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
    return { message: 'Cart cleared' };
  }

  async mergeSessionCartToUser(sessionId: string, userId: string) {
    const sessionCart = await this.prisma.cart.findFirst({ where: { sessionId }, include: { items: true } });
    if (!sessionCart || sessionCart.items.length === 0) return;

    let userCart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!userCart) {
      userCart = await this.prisma.cart.create({ data: { userId } });
    }

    // Move items to user cart
    for (const item of sessionCart.items) {
      const existing = await this.prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          variantId: item.variantId,
          lensOptionId: item.lensOptionId,
          prescriptionId: item.prescriptionId,
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.update({
          where: { id: item.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete empty session cart
    await this.prisma.cart.delete({ where: { id: sessionCart.id } });
  }

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private formatCartDto(cart: any): CartDto {
    let subtotal = 0;
    let totalItems = 0;

    const items: CartItemDto[] = cart.items.map((item: any) => {
      const lineSubtotal = Number(item.unitPrice) * item.quantity;
      subtotal += lineSubtotal;
      totalItems += item.quantity;

      const variant = item.variant;
      const product = variant.product;
      const brand = product.brand;

      return {
        id: item.id,
        variantId: variant.id,
        productName: `${brand.name} ${product.name}`,
        variantSku: variant.sku,
        colour: variant.colour,
        size: variant.size,
        imageUrl: variant.imageUrls?.[0] || '',
        unitPrice: Number(item.unitPrice),
        mrp: Number(variant.mrp),
        quantity: item.quantity,
        subtotal: lineSubtotal,
        lensOption: item.lensOption
          ? {
              id: item.lensOption.id,
              label: `${item.lensOption.type} - ${item.lensOption.coating}`,
              addOnPrice: Number(item.lensOption.addOnPrice),
            }
          : undefined,
        prescription: item.prescription
          ? {
              id: item.prescription.id,
              name: item.prescription.name,
            }
          : undefined,
      };
    });

    return {
      id: cart.id,
      items,
      subtotal,
      totalItems,
    };
  }
}
