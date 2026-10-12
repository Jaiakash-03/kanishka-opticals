'use client';

import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, getSubtotal, getItemCount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Simple stub for checkout flow
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order creation API call
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Order placed successfully! (Stub)');
      router.push('/account/orders');
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/eyeglasses" className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors w-full">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Checkout Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-brand-600">
            Kanishka<span className="text-gray-900">Opticals</span>
          </Link>
          <div className="flex items-center text-sm font-medium text-gray-500">
            <Lock className="w-4 h-4 mr-2" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {!isAuthenticated() && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Already have an account?</h3>
                  <p className="text-sm text-gray-500 mt-1">Sign in for a faster checkout experience</p>
                </div>
                <Link href="/auth/login?returnUrl=/checkout" className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Sign In
                </Link>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={shippingAddress.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input required type="text" name="line1" value={shippingAddress.line1} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input type="text" name="line2" value={shippingAddress.line2} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input required type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input required type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-brand-600 bg-brand-50 rounded-xl cursor-pointer">
                    <div className="flex items-center">
                      <input type="radio" name="paymentMethod" value="ONLINE" defaultChecked className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300" />
                      <span className="ml-3 font-medium text-brand-900">Online Payment (UPI, Cards, Netbanking)</span>
                    </div>
                    <CreditCard className="w-5 h-5 text-brand-600" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 bg-white rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="paymentMethod" value="COD" disabled className="w-4 h-4 text-gray-400 border-gray-300" />
                      <span className="ml-3 font-medium text-gray-500">Cash on Delivery (Not available for prescription lenses)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Pay and Place Order'}
                </button>
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-1 text-green-500" />
                  256-bit encryption. Safe and secure payment.
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🕶️</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{item.productName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({getItemCount()} items)</span>
                  <span className="font-medium text-gray-900">₹{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes (Included)</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-2xl text-brand-600">₹{getSubtotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
