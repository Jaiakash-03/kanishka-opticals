/**
 * Database seed script — 50 sample products + categories + brands + lens options
 * + 1 admin user + 1 test customer + 1 store location + feature flags.
 *
 * Run: pnpm db:seed
 */
import { PrismaClient, Gender, LensType, LensCoating, LensMaterial } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Cleanup (order matters due to FK constraints) ──────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.lensOption.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Cleaned existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@Kanishka2024!', 12);
  const customerPassword = await bcrypt.hash('Customer@Test123!', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Store Admin',
      email: 'admin@kanishkaopticals.in',
      phone: '+919876543210',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '+919876543211',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      isVerified: true,
    },
  });
  console.log('  ✓ Users created (admin + test customer)');

  // ── Store location ─────────────────────────────────────────────────────────
  await prisma.store.create({
    data: {
      name: 'Kanishka Opticals – RS Puram',
      address: '123, Avinashi Road, RS Puram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641002',
      phone: '+914224567890',
      lat: 11.0168,
      lng: 76.9558,
      workingHours: {
        mon: '09:00-19:00',
        tue: '09:00-19:00',
        wed: '09:00-19:00',
        thu: '09:00-19:00',
        fri: '09:00-19:00',
        sat: '09:00-20:00',
        sun: '10:00-18:00',
      },
      isActive: true,
    },
  });
  console.log('  ✓ Store location created');

  // ── Feature flags ──────────────────────────────────────────────────────────
  await prisma.featureFlag.createMany({
    data: [
      { key: 'LENS_WIZARD', enabled: false, description: 'Phase 2: Full lens selection wizard' },
      { key: 'WISHLIST', enabled: false, description: 'Phase 2: Wishlist feature' },
      { key: 'REVIEWS', enabled: false, description: 'Phase 2: Product reviews' },
      { key: 'WHATSAPP_NOTIFY', enabled: false, description: 'Phase 2: WhatsApp notifications' },
      { key: 'VIRTUAL_TRYON', enabled: false, description: 'Phase 3: AR virtual try-on' },
    ],
  });
  console.log('  ✓ Feature flags seeded');

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Eyeglasses', slug: 'eyeglasses', description: 'Prescription eyeglasses for men, women and kids', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Sunglasses', slug: 'sunglasses', description: 'UV-protected sunglasses for all styles', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Contact Lenses', slug: 'contact-lenses', description: 'Daily, monthly and coloured contact lenses', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Reading Glasses', slug: 'reading-glasses', description: 'Comfortable reading glasses for near vision', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Computer Glasses', slug: 'computer-glasses', description: 'Blue-cut lenses for screen protection', sortOrder: 5 } }),
    prisma.category.create({ data: { name: "Kids' Eyewear", slug: 'kids-eyewear', description: 'Durable, safe eyewear for children', sortOrder: 6 } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories', description: 'Cases, cleaning kits and straps', sortOrder: 7 } }),
  ]);
  console.log('  ✓ Categories created');

  // ── Brands ─────────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Ray-Ban', slug: 'ray-ban' } }),
    prisma.brand.create({ data: { name: 'Titan Eyeplus', slug: 'titan-eyeplus' } }),
    prisma.brand.create({ data: { name: 'Vincent Chase', slug: 'vincent-chase' } }),
    prisma.brand.create({ data: { name: 'John Jacobs', slug: 'john-jacobs' } }),
    prisma.brand.create({ data: { name: 'Oakley', slug: 'oakley' } }),
    prisma.brand.create({ data: { name: 'Fastrack', slug: 'fastrack' } }),
    prisma.brand.create({ data: { name: 'Carrera', slug: 'carrera' } }),
    prisma.brand.create({ data: { name: 'Kanishka House', slug: 'kanishka-house' } }),
  ]);
  console.log('  ✓ Brands created');

  // ── Lens options ───────────────────────────────────────────────────────────
  await prisma.lensOption.createMany({
    data: [
      { type: 'ZERO_POWER', coating: 'NONE', material: 'CR39', addOnPrice: 0, label: 'Zero Power – No Coating', sortOrder: 1 },
      { type: 'ZERO_POWER', coating: 'ANTI_GLARE', material: 'CR39', addOnPrice: 299, label: 'Zero Power – Anti-Glare', sortOrder: 2 },
      { type: 'ZERO_POWER', coating: 'BLUE_CUT', material: 'CR39', addOnPrice: 399, label: 'Zero Power – Blue Cut', sortOrder: 3 },
      { type: 'ZERO_POWER', coating: 'ANTI_GLARE_BLUE_CUT', material: 'POLYCARBONATE', addOnPrice: 599, label: 'Zero Power – Anti-Glare + Blue Cut', sortOrder: 4 },
      { type: 'SINGLE_VISION', coating: 'ANTI_GLARE', material: 'CR39', addOnPrice: 799, label: 'Single Vision – Anti-Glare (CR-39)', sortOrder: 5 },
      { type: 'SINGLE_VISION', coating: 'ANTI_GLARE_BLUE_CUT', material: 'POLYCARBONATE', addOnPrice: 1199, label: 'Single Vision – Anti-Glare + Blue Cut (Polycarbonate)', sortOrder: 6 },
      { type: 'SINGLE_VISION', coating: 'PHOTOCHROMIC', material: 'CR39', addOnPrice: 1499, label: 'Single Vision – Photochromic (Transitions)', sortOrder: 7 },
      { type: 'BIFOCAL', coating: 'ANTI_GLARE', material: 'CR39', addOnPrice: 1299, label: 'Bifocal – Anti-Glare', sortOrder: 8 },
      { type: 'PROGRESSIVE', coating: 'ANTI_GLARE', material: 'HIGH_INDEX_1_6', addOnPrice: 2499, label: 'Progressive – Anti-Glare (Hi-Index 1.6)', sortOrder: 9 },
    ],
  });
  console.log('  ✓ Lens options created');

  // ── Helper: slugify ────────────────────────────────────────────────────────
  const slug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // ── 50 Sample products ─────────────────────────────────────────────────────
  const productSeeds = [
    // EYEGLASSES – Men (10)
    { name: 'Classic Aviator Frame', brand: 'Ray-Ban', category: 'Eyeglasses', price: 3499, mrp: 4500, gender: 'MEN', shape: 'Aviator', material: 'Metal', colours: ['Gold/Green', 'Silver/Blue'] },
    { name: 'Bold Rectangle Frame', brand: 'Titan Eyeplus', category: 'Eyeglasses', price: 1899, mrp: 2500, gender: 'MEN', shape: 'Rectangle', material: 'Acetate', colours: ['Matte Black', 'Dark Brown'] },
    { name: 'Slim Rimless Frame', brand: 'Vincent Chase', category: 'Eyeglasses', price: 1299, mrp: 1800, gender: 'MEN', shape: 'Rimless', material: 'Titanium', colours: ['Silver', 'Gunmetal'] },
    { name: 'Navigator Steel Frame', brand: 'John Jacobs', category: 'Eyeglasses', price: 2799, mrp: 3500, gender: 'MEN', shape: 'Navigator', material: 'Stainless Steel', colours: ['Black', 'Gunmetal'] },
    { name: 'Wayfarer Acetate Frame', brand: 'Ray-Ban', category: 'Eyeglasses', price: 3999, mrp: 5000, gender: 'MEN', shape: 'Wayfarer', material: 'Acetate', colours: ['Black', 'Tortoise'] },
    { name: 'Office Pro Rectangle', brand: 'Kanishka House', category: 'Eyeglasses', price: 999, mrp: 1500, gender: 'MEN', shape: 'Rectangle', material: 'TR90', colours: ['Black', 'Blue'] },
    { name: 'Retro Round Frame', brand: 'Vincent Chase', category: 'Eyeglasses', price: 1599, mrp: 2200, gender: 'MEN', shape: 'Round', material: 'Acetate', colours: ['Tortoise', 'Black'] },
    { name: 'Flex Titanium Frame', brand: 'Titan Eyeplus', category: 'Eyeglasses', price: 2499, mrp: 3200, gender: 'MEN', shape: 'Rectangle', material: 'Titanium', colours: ['Matte Black'] },
    { name: 'Wide Browline Frame', brand: 'John Jacobs', category: 'Eyeglasses', price: 2199, mrp: 2800, gender: 'MEN', shape: 'Browline', material: 'Acetate', colours: ['Black/Gold', 'Brown/Gold'] },
    { name: 'Cat-Eye Men\'s Frame', brand: 'Fastrack', category: 'Eyeglasses', price: 1499, mrp: 2000, gender: 'MEN', shape: 'Cat-Eye', material: 'TR90', colours: ['Black'] },

    // EYEGLASSES – Women (10)
    { name: 'Elegant Cat-Eye Frame', brand: 'John Jacobs', category: 'Eyeglasses', price: 2599, mrp: 3500, gender: 'WOMEN', shape: 'Cat-Eye', material: 'Acetate', colours: ['Rose Gold', 'Black'] },
    { name: 'Butterfly Floral Frame', brand: 'Vincent Chase', category: 'Eyeglasses', price: 1799, mrp: 2400, gender: 'WOMEN', shape: 'Butterfly', material: 'Acetate', colours: ['Floral Pink', 'Purple'] },
    { name: 'Oval Thin Frame', brand: 'Titan Eyeplus', category: 'Eyeglasses', price: 1999, mrp: 2700, gender: 'WOMEN', shape: 'Oval', material: 'Metal', colours: ['Gold', 'Silver'] },
    { name: 'Retro Square Frame', brand: 'Kanishka House', category: 'Eyeglasses', price: 1099, mrp: 1600, gender: 'WOMEN', shape: 'Square', material: 'Acetate', colours: ['Tortoise', 'Burgundy'] },
    { name: 'Rimless Oval Frame', brand: 'Ray-Ban', category: 'Eyeglasses', price: 3199, mrp: 4000, gender: 'WOMEN', shape: 'Oval', material: 'Titanium', colours: ['Rose Gold'] },
    { name: 'Geometric Hexagon Frame', brand: 'John Jacobs', category: 'Eyeglasses', price: 2299, mrp: 3000, gender: 'WOMEN', shape: 'Geometric', material: 'TR90', colours: ['Crystal Clear', 'Light Blue'] },
    { name: 'Wide Wrap Frame', brand: 'Fastrack', category: 'Eyeglasses', price: 1299, mrp: 1800, gender: 'WOMEN', shape: 'Wrap', material: 'TR90', colours: ['Pink', 'White'] },
    { name: 'Classic Wayfarer Women', brand: 'Ray-Ban', category: 'Eyeglasses', price: 3699, mrp: 4800, gender: 'WOMEN', shape: 'Wayfarer', material: 'Acetate', colours: ['Marbled Blue', 'Nude'] },
    { name: 'Slim Rectangle Women', brand: 'Titan Eyeplus', category: 'Eyeglasses', price: 1699, mrp: 2300, gender: 'WOMEN', shape: 'Rectangle', material: 'Stainless Steel', colours: ['Rose Gold', 'Silver'] },
    { name: 'Round Vintage Women', brand: 'Vincent Chase', category: 'Eyeglasses', price: 1399, mrp: 1900, gender: 'WOMEN', shape: 'Round', material: 'Metal', colours: ['Gold', 'Bronze'] },

    // SUNGLASSES (10)
    { name: 'Wayfarer UV400 Sunglasses', brand: 'Ray-Ban', category: 'Sunglasses', price: 5999, mrp: 7500, gender: 'UNISEX', shape: 'Wayfarer', material: 'Acetate', colours: ['Black/G15', 'Tortoise/Brown'] },
    { name: 'Aviator Classic Sunglasses', brand: 'Ray-Ban', category: 'Sunglasses', price: 6499, mrp: 8000, gender: 'UNISEX', shape: 'Aviator', material: 'Metal', colours: ['Gold/G15', 'Silver/Blue'] },
    { name: 'Sports Wrap Sunglasses', brand: 'Oakley', category: 'Sunglasses', price: 7999, mrp: 10000, gender: 'MEN', shape: 'Wrap', material: 'Polycarbonate', colours: ['Matte Black', 'Dark Grey'] },
    { name: 'Oversized Square Sunnies', brand: 'Fastrack', category: 'Sunglasses', price: 1999, mrp: 2800, gender: 'WOMEN', shape: 'Square', material: 'Acetate', colours: ['Black', 'Tortoise'] },
    { name: 'Round Metal Sunglasses', brand: 'Vincent Chase', category: 'Sunglasses', price: 1799, mrp: 2500, gender: 'UNISEX', shape: 'Round', material: 'Metal', colours: ['Gold/Green', 'Silver/Blue'] },
    { name: 'Cat-Eye Fashion Sunnies', brand: 'Carrera', category: 'Sunglasses', price: 3499, mrp: 4500, gender: 'WOMEN', shape: 'Cat-Eye', material: 'Acetate', colours: ['Black', 'Red'] },
    { name: 'Clubmaster Retro', brand: 'Ray-Ban', category: 'Sunglasses', price: 5499, mrp: 7000, gender: 'UNISEX', shape: 'Browline', material: 'Acetate', colours: ['Black/Gold', 'Brown/Gold'] },
    { name: 'Navigator Polarised', brand: 'Oakley', category: 'Sunglasses', price: 6999, mrp: 9000, gender: 'MEN', shape: 'Navigator', material: 'Metal', colours: ['Gunmetal/Grey'] },
    { name: 'Fashion Oval Sunnies', brand: 'Fastrack', category: 'Sunglasses', price: 1499, mrp: 2000, gender: 'WOMEN', shape: 'Oval', material: 'TR90', colours: ['Pink', 'Purple'] },
    { name: 'Classic Wayfarer Fastrack', brand: 'Fastrack', category: 'Sunglasses', price: 1699, mrp: 2400, gender: 'MEN', shape: 'Wayfarer', material: 'Acetate', colours: ['Matte Black'] },

    // KIDS EYEWEAR (5)
    { name: 'Kids Flex Frame Blue', brand: 'Kanishka House', category: "Kids' Eyewear", price: 799, mrp: 1200, gender: 'KIDS', shape: 'Rectangle', material: 'TR90', colours: ['Blue', 'Red'] },
    { name: 'Kids Round Silicone Frame', brand: 'Vincent Chase', category: "Kids' Eyewear", price: 999, mrp: 1500, gender: 'KIDS', shape: 'Round', material: 'Silicone', colours: ['Pink', 'Blue'] },
    { name: 'Kids Sports Frame', brand: 'Fastrack', category: "Kids' Eyewear", price: 1199, mrp: 1700, gender: 'KIDS', shape: 'Wrap', material: 'TR90', colours: ['Green', 'Yellow'] },
    { name: 'Kids Square Frame', brand: 'Titan Eyeplus', category: "Kids' Eyewear", price: 899, mrp: 1300, gender: 'KIDS', shape: 'Square', material: 'TR90', colours: ['Red', 'Blue'] },
    { name: 'Kids Rubber Temple Frame', brand: 'Kanishka House', category: "Kids' Eyewear", price: 699, mrp: 1100, gender: 'KIDS', shape: 'Rectangle', material: 'TR90', colours: ['Purple', 'Orange'] },

    // READING GLASSES (5)
    { name: 'Classic Reading +1.00', brand: 'Kanishka House', category: 'Reading Glasses', price: 499, mrp: 800, gender: 'UNISEX', shape: 'Round', material: 'Metal', colours: ['Silver', 'Gold'] },
    { name: 'Slim Reader +1.50', brand: 'Titan Eyeplus', category: 'Reading Glasses', price: 799, mrp: 1100, gender: 'UNISEX', shape: 'Rectangle', material: 'TR90', colours: ['Black', 'Brown'] },
    { name: 'Folding Reader +2.00', brand: 'Vincent Chase', category: 'Reading Glasses', price: 899, mrp: 1300, gender: 'UNISEX', shape: 'Rectangle', material: 'Metal', colours: ['Silver', 'Gunmetal'] },
    { name: 'Full Rim Reader +2.50', brand: 'Kanishka House', category: 'Reading Glasses', price: 599, mrp: 900, gender: 'UNISEX', shape: 'Round', material: 'Metal', colours: ['Gold', 'Black'] },
    { name: 'Designer Reader Cat-Eye', brand: 'John Jacobs', category: 'Reading Glasses', price: 1499, mrp: 2000, gender: 'WOMEN', shape: 'Cat-Eye', material: 'Acetate', colours: ['Tortoise', 'Purple'] },

    // COMPUTER GLASSES (5)
    { name: 'Screen Shield Blue Cut', brand: 'Kanishka House', category: 'Computer Glasses', price: 1299, mrp: 1800, gender: 'UNISEX', shape: 'Rectangle', material: 'TR90', colours: ['Black', 'Transparent'] },
    { name: 'Office Zero Power Blue Cut', brand: 'Vincent Chase', category: 'Computer Glasses', price: 1499, mrp: 2000, gender: 'UNISEX', shape: 'Rectangle', material: 'Acetate', colours: ['Matte Black', 'Dark Brown'] },
    { name: 'Gaming Pro Blue Cut', brand: 'Fastrack', category: 'Computer Glasses', price: 1799, mrp: 2400, gender: 'MEN', shape: 'Rectangle', material: 'TR90', colours: ['Black/Yellow'] },
    { name: 'Lite Computer Frame', brand: 'Titan Eyeplus', category: 'Computer Glasses', price: 1099, mrp: 1500, gender: 'UNISEX', shape: 'Rectangle', material: 'Acetate', colours: ['Transparent', 'Black'] },
    { name: 'Night Vision Yellow Frame', brand: 'Kanishka House', category: 'Computer Glasses', price: 999, mrp: 1400, gender: 'UNISEX', shape: 'Wrap', material: 'TR90', colours: ['Yellow'] },

    // ACCESSORIES (5)
    { name: 'Microfibre Cleaning Kit', brand: 'Kanishka House', category: 'Accessories', price: 149, mrp: 250, gender: 'UNISEX', shape: 'N/A', material: 'Microfibre', colours: ['Mixed'] },
    { name: 'Leather Hard Case', brand: 'Titan Eyeplus', category: 'Accessories', price: 399, mrp: 599, gender: 'UNISEX', shape: 'N/A', material: 'Leather', colours: ['Brown', 'Black'] },
    { name: 'Anti-Slip Silicone Strap', brand: 'Kanishka House', category: 'Accessories', price: 99, mrp: 199, gender: 'UNISEX', shape: 'N/A', material: 'Silicone', colours: ['Clear', 'Black'] },
    { name: 'Spray Lens Cleaner 30ml', brand: 'Kanishka House', category: 'Accessories', price: 199, mrp: 299, gender: 'UNISEX', shape: 'N/A', material: 'N/A', colours: ['N/A'] },
    { name: 'Sports Floating Strap', brand: 'Fastrack', category: 'Accessories', price: 249, mrp: 399, gender: 'UNISEX', shape: 'N/A', material: 'Neoprene', colours: ['Blue', 'Black'] },
  ];

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]));

  let productCount = 0;
  for (const seed of productSeeds) {
    const productSlug = slug(`${seed.brand}-${seed.name}`);
    const categoryId = categoryMap[seed.category];
    const brandId = brandMap[seed.brand];

    if (!categoryId || !brandId) {
      console.warn(`  ⚠ Skipping "${seed.name}" — missing category or brand`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name: seed.name,
        slug: productSlug,
        categoryId,
        brandId,
        description: `Premium ${seed.name} by ${seed.brand}. ${seed.material} frame in ${seed.shape} shape. Available in multiple colours.`,
        gender: seed.gender as Gender,
        frameShape: seed.shape !== 'N/A' ? seed.shape : null,
        material: seed.material !== 'N/A' ? seed.material : null,
        isActive: true,
        isFeatured: productCount < 8, // First 8 are featured
      },
    });

    // Create one variant per colour
    for (let i = 0; i < seed.colours.length; i++) {
      const colour = seed.colours[i];
      if (!colour) continue;
      const variantSku = `${seed.brand.substring(0, 2).toUpperCase()}-${productCount + 1}-${i + 1}`;
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantSku,
          colour,
          size: ['accessories', 'contact-lenses'].includes(seed.category.toLowerCase()) ? null : 'M',
          price: seed.price,
          mrp: seed.mrp,
          stock: Math.floor(Math.random() * 50) + 5,
          imageUrls: [], // Populated during real import
          isDefault: i === 0,
        },
      });
    }
    productCount++;
  }

  console.log(`  ✓ ${productCount} products seeded with variants`);
  console.log('\n✅ Database seeded successfully!\n');
  console.log('Admin credentials:');
  console.log('  Email:    admin@kanishkaopticals.in');
  console.log('  Password: Admin@Kanishka2024!\n');
  console.log('Test customer credentials:');
  console.log('  Email:    customer@test.com');
  console.log('  Password: Customer@Test123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
