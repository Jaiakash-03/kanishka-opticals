import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold text-brand-600">
              Kanishka<span className="text-gray-900">Opticals</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
              Premium eyewear for the modern visionary. Experience clarity, comfort, and style with our curated collection of eyeglasses, sunglasses, and contact lenses.
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900">Store Address:</p>
              <p className="mt-1 text-sm text-gray-500">123, Avinashi Road, RS Puram<br />Coimbatore, Tamil Nadu 641002</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/eyeglasses" className="text-sm text-gray-500 hover:text-brand-600">Eyeglasses</Link></li>
              <li><Link href="/sunglasses" className="text-sm text-gray-500 hover:text-brand-600">Sunglasses</Link></li>
              <li><Link href="/contact-lenses" className="text-sm text-gray-500 hover:text-brand-600">Contact Lenses</Link></li>
              <li><Link href="/accessories" className="text-sm text-gray-500 hover:text-brand-600">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Services</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/eye-test" className="text-sm text-gray-500 hover:text-brand-600">Book Eye Test</Link></li>
              <li><Link href="/prescriptions/upload" className="text-sm text-gray-500 hover:text-brand-600">Upload Prescription</Link></li>
              <li><Link href="/track-order" className="text-sm text-gray-500 hover:text-brand-600">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="text-sm text-gray-500 hover:text-brand-600">Refund Policy</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-brand-600">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 py-8 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {year} Kanishka Opticals. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            {/* Social Icons Placeholder */}
            <a href="#" className="text-gray-400 hover:text-brand-600">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-brand-600">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-brand-600">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
