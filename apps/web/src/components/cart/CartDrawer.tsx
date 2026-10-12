'use client';

import { useCartStore } from '@/store/cart.store';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, getSubtotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-brand-50 text-brand-700 font-medium rounded-full hover:bg-brand-100 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0">
                    {item.imageUrl ? (
                      <Image 
                        src={item.imageUrl} 
                        alt={item.productName} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🕶️</div>
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.productName || 'Eyewear'}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.colour} • {item.size}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart?.items && cart.items.length > 0 && (
          <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{getSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">₹{getSubtotal().toLocaleString()}</span>
            </div>

            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="w-full mt-4 bg-brand-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
