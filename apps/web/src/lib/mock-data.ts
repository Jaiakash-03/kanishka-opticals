export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  gender: 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS';
  frameShape: string;
  material: string;
  description: string;
  images: { url: string; alt: string }[];
  isFeatured: boolean;
  variants: {
    id: string;
    sku: string;
    colour: string;
    size: string;
    price: number;
    mrp: number;
    stock: number;
    imageUrls: string[];
  }[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Classic Aviator Gold Frame',
    slug: 'ray-ban-classic-aviator-frame',
    price: 3499,
    mrp: 4500,
    brand: { id: 'b-1', name: 'Ray-Ban', slug: 'ray-ban' },
    category: { id: 'c-1', name: 'Eyeglasses', slug: 'eyeglasses' },
    gender: 'MEN',
    frameShape: 'Aviator',
    material: 'Stainless Steel',
    description: 'Iconic teardrop aviator silhouette engineered with lightweight metallic alloys for long-wearing comfort. Features adjustable silicone nose-pads.',
    images: [
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', alt: 'Classic Aviator Gold' },
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', alt: 'Side View' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-1', sku: 'RB-AV-01', colour: 'Gold/Green', size: 'M (55mm)', price: 3499, mrp: 4500, stock: 24, imageUrls: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'] },
      { id: 'v-2', sku: 'RB-AV-02', colour: 'Matte Silver', size: 'M (55mm)', price: 3499, mrp: 4500, stock: 15, imageUrls: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-2',
    name: 'Bold Matte Black Rectangle',
    slug: 'titan-eyeplus-bold-rectangle-frame',
    price: 1899,
    mrp: 2500,
    brand: { id: 'b-2', name: 'Titan Eyeplus', slug: 'titan-eyeplus' },
    category: { id: 'c-1', name: 'Eyeglasses', slug: 'eyeglasses' },
    gender: 'MEN',
    frameShape: 'Rectangle',
    material: 'Italian Acetate',
    description: 'Contemporary deep-set rectangular eyeglasses handcrafted from premium hypoallergenic acetate. Ideal for everyday computer & office wear.',
    images: [
      { url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80', alt: 'Bold Matte Black' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-3', sku: 'TE-REC-01', colour: 'Matte Black', size: 'L (54mm)', price: 1899, mrp: 2500, stock: 40, imageUrls: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'] },
      { id: 'v-4', sku: 'TE-REC-02', colour: 'Havana Tortoise', size: 'L (54mm)', price: 1899, mrp: 2500, stock: 20, imageUrls: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-3',
    name: 'Retro Round Tortoise Frame',
    slug: 'vincent-chase-retro-round-frame',
    price: 1599,
    mrp: 2200,
    brand: { id: 'b-3', name: 'Vincent Chase', slug: 'vincent-chase' },
    category: { id: 'c-1', name: 'Eyeglasses', slug: 'eyeglasses' },
    gender: 'UNISEX',
    frameShape: 'Round',
    material: 'TR90 Ultra-flex',
    description: 'Vintage-inspired circular frames in rich amber tortoiseshell. Featherlight TR-90 construction ensures zero nose pressure.',
    images: [
      { url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80', alt: 'Retro Round Tortoise' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-5', sku: 'VC-RD-01', colour: 'Tortoise Brown', size: 'M (49mm)', price: 1599, mrp: 2200, stock: 32, imageUrls: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-4',
    name: 'UV400 Wayfarer Classic Polarized',
    slug: 'ray-ban-wayfarer-uv400-sunglasses',
    price: 5999,
    mrp: 7500,
    brand: { id: 'b-1', name: 'Ray-Ban', slug: 'ray-ban' },
    category: { id: 'c-2', name: 'Sunglasses', slug: 'sunglasses' },
    gender: 'UNISEX',
    frameShape: 'Wayfarer',
    material: 'Bio-Acetate',
    description: 'Timeless rock-and-roll styling meets cutting-edge 100% UV400 polarized optical clarity. Cuts harsh road & water glares.',
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', alt: 'Wayfarer Sunglasses' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-6', sku: 'RB-WF-01', colour: 'Gloss Black / G-15 Green', size: 'Standard (50mm)', price: 5999, mrp: 7500, stock: 18, imageUrls: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-5',
    name: 'Elegant Rose Gold Cat-Eye',
    slug: 'john-jacobs-elegant-cat-eye-frame',
    price: 2599,
    mrp: 3500,
    brand: { id: 'b-4', name: 'John Jacobs', slug: 'john-jacobs' },
    category: { id: 'c-1', name: 'Eyeglasses', slug: 'eyeglasses' },
    gender: 'WOMEN',
    frameShape: 'Cat-Eye',
    material: 'Titanium & Acetate',
    description: 'Graceful feminine contouring accented with gleaming rose gold rim details. An exquisite blend of luxury aesthetics and daily durability.',
    images: [
      { url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80', alt: 'Rose Gold Cat-Eye' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-7', sku: 'JJ-CE-01', colour: 'Rose Gold / Soft Pink', size: 'S (51mm)', price: 2599, mrp: 3500, stock: 25, imageUrls: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-6',
    name: 'Screen Shield Zero Power Blue-Cut',
    slug: 'kanishka-screen-shield-blue-cut',
    price: 1299,
    mrp: 1800,
    brand: { id: 'b-5', name: 'Kanishka House', slug: 'kanishka-house' },
    category: { id: 'c-5', name: 'Computer Glasses', slug: 'computer-glasses' },
    gender: 'UNISEX',
    frameShape: 'Rectangle',
    material: 'TR90 Memory Polymer',
    description: 'Shield your eyes from digital fatigue, headaches, and sleep disruption. Blocks 98% of harmful blue light emitted from screens.',
    images: [
      { url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80', alt: 'Blue-Cut Computer Glasses' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-8', sku: 'KH-BC-01', colour: 'Crystal Clear', size: 'M (52mm)', price: 1299, mrp: 1800, stock: 50, imageUrls: ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'] },
      { id: 'v-9', sku: 'KH-BC-02', colour: 'Midnight Black', size: 'M (52mm)', price: 1299, mrp: 1800, stock: 45, imageUrls: ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-7',
    name: 'AquaComfort Daily Moisture Contact Lenses',
    slug: 'aquacomfort-daily-contact-lenses',
    price: 1499,
    mrp: 1999,
    brand: { id: 'b-2', name: 'Titan Eyeplus', slug: 'titan-eyeplus' },
    category: { id: 'c-3', name: 'Contact Lenses', slug: 'contact-lenses' },
    gender: 'UNISEX',
    frameShape: 'N/A',
    material: 'Hydrogel 58% Water',
    description: 'All-day breathable hydration with blink-activated moisture technology. Pack of 30 disposable daily lenses.',
    images: [
      { url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80', alt: 'Contact Lenses Box' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-10', sku: 'CL-DAY-30', colour: 'Clear Natural', size: 'Standard Base Curve 8.6', price: 1499, mrp: 1999, stock: 60, imageUrls: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
  {
    id: 'prod-8',
    name: 'Kids SuperFlex Shatterproof Frame',
    slug: 'kanishka-kids-flex-frame',
    price: 799,
    mrp: 1200,
    brand: { id: 'b-5', name: 'Kanishka House', slug: 'kanishka-house' },
    category: { id: 'c-6', name: "Kids' Eyewear", slug: 'kids-eyewear' },
    gender: 'KIDS',
    frameShape: 'Round',
    material: 'Food-Grade Flexible Silicone',
    description: 'Bendy, twisty, and 100% unbreakable kids frame with soft headband strap included. Safe for school and sports.',
    images: [
      { url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', alt: 'Kids Eyewear' },
    ],
    isFeatured: true,
    variants: [
      { id: 'v-11', sku: 'KH-KD-BL', colour: 'Sky Blue / Navy', size: 'Kids (46mm)', price: 799, mrp: 1200, stock: 35, imageUrls: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'] },
    ],
  },
];
