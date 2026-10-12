import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Transactional email and SMS service. BullMQ queue integration added in Stage 3. */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly config: ConfigService) {}

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    // TODO Stage 3: SendGrid / SES via BullMQ
    this.logger.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
  }

  async sendSms(to: string, message: string): Promise<void> {
    // TODO Stage 3: MSG91
    this.logger.log(`[SMS] To: ${to} | ${message}`);
  }

  async sendOrderConfirmation(email: string, orderNumber: string, total: number) {
    await this.sendEmail(email, `Order Confirmed — ${orderNumber}`, `<p>Thank you! Your order <strong>${orderNumber}</strong> is confirmed. Total: ₹${total}</p>`);
  }

  async sendOtp(phone: string, otp: string) {
    await this.sendSms(phone, `Your Kanishka Opticals OTP is ${otp}. Valid for 10 minutes. Do not share.`);
  }
}
