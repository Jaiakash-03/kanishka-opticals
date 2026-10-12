'use client';

import { useAuthStore } from '@/store/auth.store';

export default function AccountProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-500">Full Name</label>
          <div className="mt-1 text-lg font-medium text-gray-900">{user.name}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500">Email Address</label>
          <div className="mt-1 text-lg font-medium text-gray-900">{user.email}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500">Phone Number</label>
          <div className="mt-1 text-lg font-medium text-gray-900">{user.phone}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500">Account Role</label>
          <div className="mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.role}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Edit Profile
        </button>
        <button className="ml-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Change Password
        </button>
      </div>
    </div>
  );
}
