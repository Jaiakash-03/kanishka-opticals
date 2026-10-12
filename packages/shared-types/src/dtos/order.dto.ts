import type { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';

/** Create order from cart (checkout) */
export interface CreateOrderDto {
  shippingAddressId?: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  couponCode?: string;
  paymentMethod: PaymentMethod;
  guestEmail?: string;     // for guest checkout
  guestPhone?: string;
}

/** Order summary for listings */
export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
  trackingNumber?: string;
}

/** Full order detail */
export interface OrderDetailDto extends OrderSummaryDto {
  items: OrderItemDto[];
  shippingAddress: AddressDto;
  payment?: PaymentDto;
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  couponCode?: string;
  carrier?: string;
  updatedAt: string;
}

/** Single order line item */
export interface OrderItemDto {
  id: string;
  productName: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
  lensOption?: string;
}

/** Payment record */
export interface PaymentDto {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  razorpayPaymentId?: string;
  createdAt: string;
}

/** Address (shipping / billing) */
export interface AddressDto {
  id?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

/** Coupon validation response */
export interface CouponValidationDto {
  valid: boolean;
  code: string;
  discountAmount?: number;
  message?: string;
}

/** Razorpay payment initiation */
export interface RazorpayOrderDto {
  razorpayOrderId: string;
  amount: number;       // in paise
  currency: string;
  keyId: string;
}

/** Razorpay payment verification */
export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}
