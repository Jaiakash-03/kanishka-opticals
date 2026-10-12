import { FeaturedProducts } from '@/components/catalog/FeaturedProducts';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kanishka Opticals — Premium Eyewear in Coimbatore',
  description:
    'Shop premium eyeglasses, sunglasses, contact lenses. Book an eye test. Trusted optical store in Coimbatore since years.',
};

// Statically rendered at build time, revalidated every 60 seconds
export const revalidate = 60;

// ── Homepage structured data (JSON-LD) ────────────────────────────────────────
const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OpticalShop',
  name: 'Kanishka Opticals',
  url: 'https://kanishkaopticals.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  priceRange: '₹₹',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '18:00' },
  ],
};

// ── Category cards ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Eyeglasses', slug: 'eyeglasses', emoji: '👓', desc: 'Prescription frames for every style' },
  { name: 'Sunglasses', slug: 'sunglasses', emoji: '🕶️', desc: 'UV protection with premium style' },
  { name: 'Contact Lenses', slug: 'contact-lenses', emoji: '🔵', desc: 'Daily, monthly & coloured' },
  { name: 'Reading Glasses', slug: 'reading-glasses', emoji: '📖', desc: 'Comfortable near-vision lenses' },
  { name: 'Computer Glasses', slug: 'computer-glasses', emoji: '💻', desc: 'Blue-cut lenses for screens' },
  { name: "Kids' Eyewear", slug: 'kids-eyewear', emoji: '👦', desc: 'Durable frames for children' },
];

const FEATURES = [
  { icon: '🔬', title: 'Free Eye Test', desc: 'Professional optometrist on premises. Book online.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Free shipping on orders above ₹999 across India.' },
  { icon: '↩️', title: '7-Day Returns', desc: 'Not satisfied? Easy returns — no questions asked.' },
  { icon: '💳', title: 'Easy EMI', desc: 'Pay in installments via Razorpay. 0% EMI available.' },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 py-20 text-white md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent-400" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-in">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-200">
                Coimbatore&apos;s Trusted Optical Store
              </p>
              <h1 className="font-display mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                See the World
                <span className="block text-accent-400">in Clarity</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-brand-100">
                Premium eyeglasses, sunglasses and contact lenses. Professional eye tests.
                Over 1,000+ frames starting at just ₹699.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/eyeglasses"
                  className="rounded-full bg-white px-8 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl"
                >
                  Shop Eyeglasses
                </Link>
                <Link
                  href="/eye-test"
                  className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Book Eye Test
                </Link>
              </div>
            </div>
            {/* Placeholder for hero image — replaced with real image post-setup */}
            <div className="flex items-center justify-center">
              <div className="flex h-72 w-72 items-center justify-center rounded-full bg-white/10 text-9xl md:h-96 md:w-96">
                👓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ──────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{f.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ──────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 text-gray-500">Find the perfect eyewear for every need</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
              >
                <span className="mb-3 text-4xl">{cat.emoji}</span>
                <p className="font-semibold text-gray-900 group-hover:text-brand-600">{cat.name}</p>
                <p className="mt-1 text-xs text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products placeholder ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-500">Handpicked frames for the season</p>
            </div>
            <Link href="/eyeglasses" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          {/* Product grid placeholder — replaced by FeaturedProducts component in Stage 3 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card">
                <div className="skeleton aspect-square w-full" />
                <div className="p-4">
                  <div className="skeleton mb-2 h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton mt-3 h-5 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eye Test CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-2 text-brand-200">Get your vision checked</p>
          <h2 className="font-display mb-4 text-3xl font-bold md:text-4xl">
            Book a Free Eye Test Today
          </h2>
          <p className="mb-8 text-brand-100">
            Our certified optometrists in Coimbatore are ready to help. Walk in or book online — it takes just 2 minutes.
          </p>
          <Link
            href="/eye-test"
            className="rounded-full bg-accent-500 px-10 py-4 font-bold text-white shadow-lg transition hover:bg-accent-600 hover:shadow-xl"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
}


