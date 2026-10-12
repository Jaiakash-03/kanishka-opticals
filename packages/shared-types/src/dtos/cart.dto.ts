/** Add item to cart */
export interface AddToCartDto {
  variantId: string;
  quantity: number;
  unitPrice: number;
  lensOptionId?: string;
  prescriptionId?: string;
}

/** Update cart item quantity */
export interface UpdateCartItemDto {
  quantity: number;
}

/** Cart item detail */
export interface CartItemDto {
  id: string;
  variantId: string;
  productName: string;
  variantSku: string;
  colour: string;
  size: string;
  imageUrl: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  subtotal: number;
  lensOption?: {
    id: string;
    label: string;
    addOnPrice: number;
  };
  prescription?: {
    id: string;
    name: string;
  };
}

/** Full cart */
export interface CartDto {
  id: string;
  items: CartItemDto[];
  subtotal: number;
  totalItems: number;
}
