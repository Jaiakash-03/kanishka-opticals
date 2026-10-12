/**
 * Cart store — Zustand with immer middleware.
 * Guest cart state is held in memory (and synced to server on add/remove).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { cartApi } from '@/lib/api-client';
import type { CartDto, CartItemDto } from '@kanishka/shared-types';

interface CartState {
  cart: CartDto | null;
  isLoading: boolean;
  isOpen: boolean; // Cart drawer open/close
  // Actions
  setCart: (cart: CartDto) => void;
  fetchCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number, unitPrice: number, lensOptionId?: string, prescriptionId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      cart: null,
      isLoading: false,
      isOpen: false,

      setCart: (cart) => set((state) => { state.cart = cart; }),

      fetchCart: async () => {
        set((state) => { state.isLoading = true; });
        try {
          const cart = await cartApi.getCart();
          set((state) => { state.cart = cart; });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set((state) => { state.isLoading = false; });
        }
      },

      addItem: async (variantId, quantity, unitPrice, lensOptionId, prescriptionId) => {
        set((state) => { state.isLoading = true; });
        try {
          await cartApi.addItem({ variantId, quantity, unitPrice, lensOptionId, prescriptionId });
          await get().fetchCart();
        } catch {
          // Local fallback for offline/preview mode
          set((state) => {
            if (!state.cart) {
              state.cart = { id: 'local-cart', items: [], subtotal: 0, totalItems: 0 };
            }
            const existing = state.cart.items.find((i: any) => i.variantId === variantId);
            if (existing) {
              existing.quantity += quantity;
              existing.subtotal = existing.quantity * existing.unitPrice;
            } else {
              state.cart.items.push({
                id: `item-${Date.now()}`,
                variantId,
                productName: 'Eyewear Frame',
                variantSku: 'SKU-' + variantId,
                colour: 'Classic Frame',
                size: 'M',
                imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
                unitPrice,
                mrp: Math.round(unitPrice * 1.3),
                quantity,
                subtotal: unitPrice * quantity,
              } as any);
            }
            state.cart.totalItems = state.cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
            state.cart.subtotal = state.cart.items.reduce((s: number, i: any) => s + i.subtotal, 0);
          });
        } finally {
          set((state) => {
            state.isLoading = false;
            state.isOpen = true; // Open cart drawer
          });
        }
      },

      updateItem: async (itemId, quantity) => {
        try {
          await cartApi.updateItem(itemId, quantity);
          await get().fetchCart();
        } catch {
          set((state) => {
            if (!state.cart) return;
            if (quantity <= 0) {
              state.cart.items = state.cart.items.filter((i: any) => i.id !== itemId);
            } else {
              const item = state.cart.items.find((i: any) => i.id === itemId);
              if (item) {
                item.quantity = quantity;
                item.subtotal = item.unitPrice * quantity;
              }
            }
            state.cart.totalItems = state.cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
            state.cart.subtotal = state.cart.items.reduce((s: number, i: any) => s + i.subtotal, 0);
          });
        }
      },

      removeItem: async (itemId) => {
        try {
          await cartApi.removeItem(itemId);
          await get().fetchCart();
        } catch {
          set((state) => {
            if (!state.cart) return;
            state.cart.items = state.cart.items.filter((i: any) => i.id !== itemId);
            state.cart.totalItems = state.cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
            state.cart.subtotal = state.cart.items.reduce((s: number, i: any) => s + i.subtotal, 0);
          });
        }
      },

      openCart: () => set((state) => { state.isOpen = true; }),
      closeCart: () => set((state) => { state.isOpen = false; }),
      toggleCart: () => set((state) => { state.isOpen = !state.isOpen; }),

      getItemCount: () => get().cart?.totalItems ?? 0,
      getSubtotal: () => get().cart?.subtotal ?? 0,
    })),
    {
      name: 'kanishka-cart',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ cart: state.cart }), // Only persist cart data
    },
  ),
);
