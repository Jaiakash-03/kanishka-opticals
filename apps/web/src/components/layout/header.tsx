'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

export function Header() {
  const { user, logout } = useAuthStore();
  const { getItemCount, toggleCart } = useCartStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-bold text-brand-600">
          Kanishka<span className="text-gray-900">Opticals</span>
        </Link>

        <nav className="hidden space-x-8 md:flex">
          <Link href="/eyeglasses" className="text-sm font-medium text-gray-700 hover:text-brand-600">Eyeglasses</Link>
          <Link href="/sunglasses" className="text-sm font-medium text-gray-700 hover:text-brand-600">Sunglasses</Link>
          <Link href="/contact-lenses" className="text-sm font-medium text-gray-700 hover:text-brand-600">Contact Lenses</Link>
          <Link href="/eye-test" className="text-sm font-medium text-brand-600 hover:text-brand-700">Book Eye Test</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const q = (form.elements.namedItem('q') as HTMLInputElement).value;
            if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }} className="hidden md:flex relative">
            <input name="q" type="text" placeholder="Search..." className="w-48 pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </form>
          
          <button 
            onClick={toggleCart}
            className="relative p-2 text-gray-600 hover:text-brand-600" 
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {getItemCount() > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {getItemCount()}
              </span>
            )}
          </button>

          {user ? (
            <div className="group relative">
              <button className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 hover:text-brand-600">
                <span>{user.name.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 top-full hidden w-48 rounded-lg border border-gray-100 bg-white p-2 shadow-lg group-hover:block">
                <Link href="/account" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                <Link href="/account/orders" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                {['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                  <Link href="/admin" className="block rounded-md px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50">Admin Dashboard</Link>
                )}
                <button onClick={() => logout()} className="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden text-sm font-medium text-gray-700 hover:text-brand-600 md:block">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
