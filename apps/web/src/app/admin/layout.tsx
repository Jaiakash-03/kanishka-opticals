'use client';

import dynamic from 'next/dynamic';

const AdminLayoutInner = dynamic(() => import('./AdminLayoutInner'), {
  ssr: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}
