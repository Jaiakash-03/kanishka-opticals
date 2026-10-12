import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely (handles conflicting classes) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format Indian Rupees */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Calculate discount percentage */
export function discountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Truncate text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** Slugify a string (lowercase, hyphens) */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate CDN image URL for a given S3 key and size */
export function cdnUrl(key: string, size?: 'thumb' | 'medium' | 'large'): string {
  const cdn = process.env['NEXT_PUBLIC_CDN_URL'] ?? '';
  if (!key) return '/images/placeholder-product.png';
  if (size && !key.includes(size)) {
    const parts = key.split('.');
    const ext = parts.pop();
    return `${cdn}/${parts.join('.')}-${size}.${ext}`;
  }
  return `${cdn}/${key}`;
}

/** Format a date string for display */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/** Generate order number display (KO-XXXXXX) */
export function formatOrderNumber(num: string): string {
  return num.toUpperCase();
}

/** Check if a value is a non-empty string */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
