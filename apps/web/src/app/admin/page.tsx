'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api-client';
import {
  TrendingUp,
  ShoppingCart,
  CalendarDays,
  Activity,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now until adminApi.getDashboardMetrics is fully implemented in the backend
    setMetrics({
      totalRevenue: 154200,
      totalOrders: 48,
      pendingAppointments: 12,
    });
    setLoading(false);
  }, []);

  if (loading) return <div>Loading metrics...</div>;

  const STATS = [
    { label: 'Total Revenue', value: `â‚¹${metrics.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: metrics.totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Appointments', value: metrics.pendingAppointments.toString(), icon: CalendarDays, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Active Users', value: '1,204', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back to the Kanishka Opticals admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center space-x-4">
              <div className={`p-4 rounded-full ${stat.bg} dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="text-center text-gray-500 py-12">
          Charts and recent activity feed will appear here.
        </div>
      </div>
    </div>
  );
}
