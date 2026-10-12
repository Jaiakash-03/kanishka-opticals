'use client';

import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <button className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No addresses saved</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">Add a shipping address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address cards would go here */}
        </div>
      )}
    </div>
  );
}
