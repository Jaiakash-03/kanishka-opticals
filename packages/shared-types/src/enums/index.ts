/** User roles controlling access throughout the application */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/** Product gender classification */
export enum Gender {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  UNISEX = 'UNISEX',
  KIDS = 'KIDS',
}

/** Frame size (industry-standard small/medium/large/extra-large) */
export enum FrameSize {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L',
  EXTRA_LARGE = 'XL',
}

/** Lens type options */
export enum LensType {
  ZERO_POWER = 'ZERO_POWER',
  SINGLE_VISION = 'SINGLE_VISION',
  BIFOCAL = 'BIFOCAL',
  PROGRESSIVE = 'PROGRESSIVE',
}

/** Lens coating options */
export enum LensCoating {
  NONE = 'NONE',
  ANTI_GLARE = 'ANTI_GLARE',
  BLUE_CUT = 'BLUE_CUT',
  PHOTOCHROMIC = 'PHOTOCHROMIC',
  POLARIZED = 'POLARIZED',
  ANTI_GLARE_BLUE_CUT = 'ANTI_GLARE_BLUE_CUT',
}

/** Lens material */
export enum LensMaterial {
  CR39 = 'CR39',
  POLYCARBONATE = 'POLYCARBONATE',
  TRIVEX = 'TRIVEX',
  HIGH_INDEX_1_6 = 'HIGH_INDEX_1_6',
  HIGH_INDEX_1_67 = 'HIGH_INDEX_1_67',
}

/** Order lifecycle status */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

/** Payment status from Razorpay */
export enum PaymentStatus {
  CREATED = 'CREATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/** Payment method */
export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  NETBANKING = 'NETBANKING',
  COD = 'COD',
  EMI = 'EMI',
  WALLET = 'WALLET',
}

/** Appointment status */
export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

/** Coupon discount type */
export enum CouponType {
  PERCENT = 'PERCENT',
  FLAT = 'FLAT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

/** Product categories */
export enum ProductCategory {
  EYEGLASSES = 'eyeglasses',
  SUNGLASSES = 'sunglasses',
  CONTACT_LENSES = 'contact-lenses',
  ACCESSORIES = 'accessories',
  READING_GLASSES = 'reading-glasses',
  COMPUTER_GLASSES = 'computer-glasses',
  KIDS_EYEWEAR = 'kids-eyewear',
}
