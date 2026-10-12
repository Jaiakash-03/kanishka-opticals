'use client';

import { useState, useEffect } from 'react';
import { prescriptionsApi } from '@/lib/api-client';
import { PrescriptionDto } from '@kanishka/shared-types';
import { FileText, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AccountPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = () => {
    setLoading(true);
    prescriptionsApi.getAll()
      .then(res => {
        setPrescriptions(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to request deletion of this prescription? (DPDP Compliance)')) return;
    try {
      await prescriptionsApi.requestDeletion(id);
      toast.success('Deletion requested successfully');
      fetchPrescriptions(); // refresh list
    } catch (err) {
      toast.error('Failed to request deletion');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <button className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Your prescriptions are securely stored and encrypted in compliance with DPDP guidelines. You can request deletion of any prescription at any time.
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-xl border border-gray-100"></div>
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No prescriptions found</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">You haven't uploaded any eye prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prescriptions.map(rx => (
            <div key={rx.id} className="border border-gray-200 rounded-xl p-5 hover:border-brand-200 transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{rx.name || 'Eye Prescription'}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Added {format(new Date(rx.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex gap-2 justify-between items-center">
                <span className="text-sm text-gray-600">
                  {rx.consentGiven ? 'Consent Provided' : 'No Consent'}
                </span>
                
                <button 
                  onClick={() => handleDelete(rx.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Request Deletion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
