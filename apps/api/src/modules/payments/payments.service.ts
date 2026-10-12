import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import Razorpay from 'razorpay';
import crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly config: ConfigService, private readonly prisma: PrismaService) {
    this.razorpay = new Razorpay({ key_id: config.get('razorpay.keyId')!, key_secret: config.get('razorpay.keySecret')! });
  }

  async createRazorpayOrder(orderId: string, amountInPaise: number) {
    const rzOrder = await this.razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt: orderId, notes: { orderId } });
    await this.prisma.payment.create({ data: { orderId, razorpayOrderId: rzOrder.id, method: 'UPI', status: 'CREATED', amount: amountInPaise / 100 } });
    return { razorpayOrderId: rzOrder.id, amount: amountInPaise, currency: 'INR', keyId: this.config.get('razorpay.keyId')! };
  }

  async verifyPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string }) {
    const body = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expected = crypto.createHmac('sha256', this.config.get('razorpay.keySecret')!).update(body).digest('hex');
    if (expected !== data.razorpaySignature) throw new BadRequestException('Payment signature verification failed');
    await this.prisma.payment.update({ where: { razorpayOrderId: data.razorpayOrderId }, data: { razorpayPaymentId: data.razorpayPaymentId, razorpaySignature: data.razorpaySignature, status: 'CAPTURED' } });
    await this.prisma.order.update({ where: { id: data.orderId }, data: { status: 'CONFIRMED' } });
    this.logger.log(`Payment captured for order ${data.orderId}`);
    return { verified: true, orderId: data.orderId };
  }

  async handleWebhook(payload: string, signature: string) {
    const expected = crypto.createHmac('sha256', this.config.get('razorpay.webhookSecret')!).update(payload).digest('hex');
    if (expected !== signature) throw new BadRequestException('Webhook signature invalid');
    const event = JSON.parse(payload) as { event: string; payload: { payment: { entity: { order_id: string; error_description?: string } } } };
    this.logger.log(`Razorpay webhook: ${event.event}`);
    if (event.event === 'payment.failed') {
      await this.prisma.payment.updateMany({ where: { razorpayOrderId: event.payload.payment.entity.order_id }, data: { status: 'FAILED', failureReason: event.payload.payment.entity.error_description } });
    }
    return { received: true };
  }
}
