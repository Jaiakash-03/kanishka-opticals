'use client';

import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api-client';
import { OrderSummaryDto, PaginatedResponse } from '@kanishka/shared-types';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getMyOrders()
      .then(res => {
        setOrders(res.items);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Package className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl border border-gray-100"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">You haven't placed any orders with us.</p>
          <Link href="/eyeglasses" className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Order Placed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Total</p>
                    <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Order #</p>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/account/orders/${order.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <span className="font-medium text-gray-900">{order.status}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
