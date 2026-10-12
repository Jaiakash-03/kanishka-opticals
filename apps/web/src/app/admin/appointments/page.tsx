'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api-client';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { AppointmentStatus } from '@kanishka/shared-types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    adminApi.getAppointments({ limit: 50 }).then((res) => {
      setAppointments(res.items);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateAppointmentStatus(id, newStatus);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case AppointmentStatus.BOOKED: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Booked</span>;
      case AppointmentStatus.CONFIRMED: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">Confirmed</span>;
      case AppointmentStatus.COMPLETED: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case AppointmentStatus.NO_SHOW: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">No Show</span>;
      case AppointmentStatus.CANCELLED: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eye Test Appointments</h1>
          <p className="text-gray-500">Manage bookings for in-store eye tests.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <Calendar className="w-4 h-4 mr-2" />
            Filter by Date
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Store</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No appointments scheduled.</td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {apt.user?.name || apt.guestName}
                      </div>
                      <div className="text-xs text-gray-500">{apt.user?.phone || apt.guestPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">{apt.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {apt.store?.name}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusChange(apt.id, AppointmentStatus.COMPLETED)}
                        title="Mark Completed"
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <CheckCircle className="w-5 h-5 inline" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(apt.id, AppointmentStatus.CANCELLED)}
                        title="Cancel"
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <XCircle className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
