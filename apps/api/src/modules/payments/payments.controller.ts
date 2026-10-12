import { Controller, Post, Body, Param, Req, UseGuards, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/roles.decorator';

@ApiTags('payments')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders/:orderId/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create Razorpay order for checkout' })
  createOrder(@Param('orderId') orderId: string, @Body('amountInPaise') amountInPaise: number) {
    return this.paymentsService.createRazorpayOrder(orderId, amountInPaise);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  verify(@Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string }) {
    return this.paymentsService.verifyPayment(body);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Razorpay webhook handler (HMAC verified)' })
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('x-razorpay-signature') signature: string) {
    const payload = req.rawBody?.toString('utf-8') ?? '';
    return this.paymentsService.handleWebhook(payload, signature);
  }
}
