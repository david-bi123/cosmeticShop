import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// ---- load .env.local ----
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

import { User } from '../src/models/User';
import { Category } from '../src/models/Category';
import { Brand } from '../src/models/Brand';
import { Supplier } from '../src/models/Supplier';
import { Product } from '../src/models/Product';
import { Order } from '../src/models/Order';
import { Coupon } from '../src/models/Coupon';
import { InventoryTransaction } from '../src/models/InventoryTransaction';
import { AuditLog } from '../src/models/AuditLog';
import { UserRole, OrderStatus, PaymentMethod, PaymentStatus } from '../src/lib/constants';

const IMAGES = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
  'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=600&q=80',
  'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&q=80',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
  'https://picsum.photos/seed/lumiere-cosmetics/800/800',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&q=80',
];

const GHANA_FIRST = ['Ama', 'Kwame', 'Akosua', 'Yaa', 'Kofi', 'Efua', 'Yaw', 'Adwoa', 'Kojo', 'Abena', 'Kwesi', 'Mansa', 'Kwaku', 'Afia', 'Osei', 'Akua', 'Nana', 'Yaa', 'Kwabena', 'Serwaa'];
const GHANA_LAST = ['Mensah', 'Owusu', 'Boateng', 'Agyeman', 'Amponsah', 'Osei', 'Frimpong', 'Acheampong', 'Antwi', 'Asante', 'Kumi', 'Sarpong', 'Addo', 'Mensah', 'Tano', 'Baidoo', 'Quaye', 'Ankomah', 'Nyarko', 'Sefa'];
const REGIONS = ['Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta', 'Northern', 'Bono', 'Ahafo', 'Western North'];
const CITIES = ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tamale', 'Tema', 'Sunyani', 'Ho', 'Koforidua', 'Wa'];
const STREETS = ['Oxford Street', 'Ring Road', 'Liberation Road', 'Independence Ave', 'Market Road', 'Spintex Road', 'Accra Mall Rd', 'Adum High St', 'Knutsford Ave', 'Cantonments Rd'];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const pickMany = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(rand(0, copy.length - 1), 1)[0]);
  return out;
};
const ghanaPhone = () => `+233 ${rand(20, 59)} ${rand(100, 999)} ${rand(1000, 9999)}`;
const fullName = () => `${pick(GHANA_FIRST)} ${pick(GHANA_LAST)}`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const skuGen = (p: string, n: number) => `${p}-${String(n).padStart(4, '0')}`;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri, { dbName: 'cosmetic-shop' });
  console.log('Connected to MongoDB');

  // clean
  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Brand.deleteMany({}), Supplier.deleteMany({}),
    Product.deleteMany({}), Order.deleteMany({}), Coupon.deleteMany({}), InventoryTransaction.deleteMany({}), AuditLog.deleteMany({}),
  ]);
  console.log('Cleared collections');

  // Categories (15)
  const categoryNames = ['Skincare', 'Makeup', 'Lipstick', 'Foundation', 'Eyeshadow', 'Fragrance', 'Haircare', 'Nails', 'Serums', 'Sunscreen', 'Moisturizers', 'Mascara', 'Concealer', 'Blush', 'Brushes & Tools'];
  const categories = [];
  for (const name of categoryNames) {
    categories.push(await Category.create({ name, slug: slugify(name), description: `${name} collection`, image: pick(IMAGES), isActive: true }));
  }
  console.log(`Created ${categories.length} categories`);

  // Brands (20)
  const brandNames = ['Lumière', 'GlowGhana', 'Akan Beauty', 'Sankofa Skin', 'Accra Glow', 'Kente Cosmetics', 'GoldCoast', 'Nubian', 'PureShea', 'Baobab Beauty', 'TwiLuxe', 'Volta Cosmetics', 'Ashanti Glow', 'Cedi Skin', 'Mango Butter Co', 'Cocoa Glow', 'Tamale Beauty', 'Ho Skincare', 'Cape Coast Cosmetics', 'Elmina Esthetics'];
  const brandCountries = ['Ghana', 'Ghana', 'Ghana', 'France', 'USA', 'Ghana', 'Nigeria', 'Ghana', 'Ghana', 'Kenya'];
  const brands = [];
  for (const name of brandNames) {
    brands.push(await Brand.create({ name, slug: slugify(name), description: `${name} beauty products`, logo: pick(IMAGES), country: pick(brandCountries), isActive: true }));
  }
  console.log(`Created ${brands.length} brands`);

  // Suppliers (10)
  const suppliers = [];
  for (let i = 0; i < 10; i++) {
    const name = `${pick(brandNames)} Supplies`;
    suppliers.push(await Supplier.create({ name, contactPerson: fullName(), phone: ghanaPhone(), email: `${slugify(name)}@supplier.com`, address: `${rand(1, 99)} ${pick(STREETS)}`, city: pick(CITIES), isActive: true }));
  }
  console.log(`Created ${suppliers.length} suppliers`);

  // Products (150)
  const productTypes = ['Serum', 'Cream', 'Lotion', 'Oil', 'Palette', 'Lipstick', 'Foundation', 'Mascara', 'Perfume', 'Mask', 'Toner', 'Primer', 'Concealer', 'Blush', 'Setting Spray', 'Cleanser', 'Sunscreen', 'Shampoo', 'Conditioner', 'Polish'];
  const adjectives = ['Radiant', 'Velvet', 'Matte', 'Hydra', 'Glow', 'Luxe', 'Pure', 'Silk', 'Golden', 'Dewy', 'Prime', 'Soft', 'Bright', 'Cocoa', 'Shea'];
  const products = [];
  for (let i = 0; i < 150; i++) {
    const name = `${pick(adjectives)} ${pick(productTypes)} ${rand(10, 99)}`;
    const cat = pick(categories);
    const brand = pick(brands);
    const supplier = pick(suppliers);
    const cost = rand(15, 180);
    const price = Math.round(cost * (1.3 + Math.random() * 0.9));
    const stock = rand(0, 200);
    const isNew = Math.random() < 0.3;
    const hasShades = cat.name === 'Lipstick' || cat.name === 'Foundation' || cat.name === 'Concealer' || cat.name === 'Blush';
    const shades = hasShades ? pickMany(['Porcelain', 'Honey', 'Caramel', 'Cocoa', 'Ebony', 'Rose', 'Nude', 'Berry', 'Plum', 'Coral'], rand(3, 6)) : [];
    const sizes = ['30ml', '50ml', '100ml', '15ml'].slice(0, rand(1, 3));
    const colors = ['Red', 'Pink', 'Nude', 'Brown', 'Gold', 'Berry'];
    const p = await Product.create({
      name,
      slug: slugify(name) + '-' + i,
      description: `Premium ${name.toLowerCase()} crafted for radiant Ghanaian skin. Enriched with natural ingredients for a luminous finish.`,
      shortDescription: `Luxury ${name.toLowerCase()} for everyday glow.`,
      category: cat._id,
      brand: brand._id,
      supplier: supplier._id,
      images: pickMany(IMAGES, rand(2, 4)).map((u) => ({ url: u })),
      price,
      costPrice: cost,
      discountPrice: Math.random() < 0.25 ? Math.round(price * 0.8) : undefined,
      sku: skuGen(slugify(cat.name).slice(0, 3).toUpperCase(), i + 1000),
      barcode: String(rand(1000000000000, 9999999999999)),
      stock,
      lowStockThreshold: 10,
      sizes: Math.random() < 0.5 ? sizes : [],
      colors: Math.random() < 0.4 ? pickMany(colors, rand(2, 4)) : [],
      shades,
      weight: pick(['30g', '50g', '100g', '15ml', '50ml']),
      manufactureDate: new Date(Date.now() - rand(10, 300) * 86400000),
      expiryDate: new Date(Date.now() + rand(200, 900) * 86400000),
      isFeatured: Math.random() < 0.25,
      isBestSeller: Math.random() < 0.2,
      isNewArrival: isNew,
      isActive: true,
      rating: Number((3 + Math.random() * 2).toFixed(1)),
      ratingCount: rand(0, 320),
      views: rand(50, 5000),
    });
    products.push(p);
    if (stock > 0 && stock <= 10) {
      // low stock already reflected
    }
  }
  console.log(`Created ${products.length} products`);

  // Reviews on random products
  let reviewCount = 0;
  for (const p of products) {
    if (Math.random() < 0.7) {
      const n = rand(1, 5);
      p.reviews = p.reviews || [];
      for (let i = 0; i < n; i++) {
        p.reviews.push({ user: null as any, name: fullName(), rating: rand(3, 5), comment: pick(['Love this product!', 'Great quality, will repurchase.', 'Skin feels amazing.', 'Fast delivery and good packaging.', 'Worth every cedi.', 'My new favorite.']), createdAt: new Date(Date.now() - rand(1, 200) * 86400000) });
        reviewCount++;
      }
      const ratings = p.reviews.map((r: any) => r.rating);
      p.rating = Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1));
      p.ratingCount = ratings.length;
      await p.save();
    }
  }
  console.log(`Created ${reviewCount} reviews`);

  // Coupons (8)
  const couponCodes = ['WELCOME10', 'GLOW20', 'LUMIERE15', 'FREESHIP', 'BEAUTY25', 'VIP30', 'SAVE50', 'NEWYEAR'];
  for (const code of couponCodes) {
    await Coupon.create({
      code,
      description: `${code} discount`,
      discountType: Math.random() < 0.7 ? 'percentage' : 'fixed',
      discountValue: Math.random() < 0.7 ? pick([10, 15, 20, 25, 30]) : pick([20, 50, 100]),
      minOrder: pick([0, 100, 200, 300]),
      maxDiscount: rand(50, 200),
      expiresAt: new Date(Date.now() + rand(30, 365) * 86400000),
      usageLimit: pick([50, 100, 200, 500]),
      usedCount: rand(0, 40),
      isActive: true,
    });
  }
  console.log('Created coupons');

  // Staff (15): 1 super admin, 4 admin, 10 staff
  const staffPermissions = ['manage_products', 'manage_orders', 'manage_customers', 'manage_inventory', 'view_reports', 'manage_staff'];
  const createdStaff = [];
  const superAdmin = await User.create({ name: 'Lumière Admin', email: 'admin@lumiere.gh', password: await hash('Admin123!'), phone: ghanaPhone(), role: UserRole.SUPER_ADMIN, permissions: staffPermissions, emailVerified: true });
  createdStaff.push(superAdmin);
  for (let i = 0; i < 4; i++) {
    createdStaff.push(await User.create({ name: fullName(), email: `admin${i}@lumiere.gh`, password: await hash('Staff123!'), phone: ghanaPhone(), role: UserRole.ADMIN, permissions: staffPermissions, emailVerified: true }));
  }
  for (let i = 0; i < 10; i++) {
    createdStaff.push(await User.create({ name: fullName(), email: `staff${i}@lumiere.gh`, password: await hash('Staff123!'), phone: ghanaPhone(), role: UserRole.STAFF, permissions: pickMany(staffPermissions, rand(1, 4)), emailVerified: true }));
  }
  console.log(`Created ${createdStaff.length} staff`);

  // Customers (40)
  const customers = [];
  for (let i = 0; i < 40; i++) {
    const name = fullName();
    const city = pick(CITIES);
    const region = pick(REGIONS);
    customers.push(await User.create({
      name,
      email: `customer${i}@example.com`,
      password: await hash('Customer123!'),
      phone: ghanaPhone(),
      role: UserRole.CUSTOMER,
      emailVerified: Math.random() < 0.8,
      blocked: Math.random() < 0.05,
      addresses: [{
        fullName: name,
        phone: ghanaPhone(),
        street: `${rand(1, 200)} ${pick(STREETS)}`,
        city,
        region,
        landmark: pick(['Near mall', 'Opposite bank', 'Beside school', '']),
        isDefault: true,
      }],
    }));
  }
  console.log(`Created ${customers.length} customers`);

  // Orders (120)
  const statuses = Object.values(OrderStatus);
  const orderCount = 120;
  let totalRevenue = 0;
  for (let i = 0; i < orderCount; i++) {
    const customer = pick(customers);
    const itemCount = rand(1, 4);
    const chosen = pickMany(products, itemCount);
    const items = chosen.map((p) => ({
      product: p._id,
      name: p.name,
      image: p.images[0].url,
      price: p.discountPrice || p.price,
      quantity: rand(1, 3),
      sku: p.sku,
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipping = subtotal > 300 ? 0 : 25;
    const discount = Math.random() < 0.2 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount + shipping;
    const status = pick(statuses);
    const paymentMethod = pick([PaymentMethod.MOBILE_MONEY, PaymentMethod.CASH_ON_DELIVERY]);
    const daysAgo = rand(0, 120);
    const created = new Date(Date.now() - daysAgo * 86400000);
    const order = await Order.create({
      orderNumber: `LUM-${String(100000 + i)}`,
      customer: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items,
      subtotal,
      discount,
      shipping,
      total,
      status,
      paymentMethod,
      paymentStatus: status === OrderStatus.CANCELLED ? PaymentStatus.REFUNDED : (paymentMethod === PaymentMethod.MOBILE_MONEY ? (Math.random() < 0.8 ? PaymentStatus.PAID : PaymentStatus.PENDING) : PaymentStatus.PENDING),
      shippingAddress: customer.addresses[0],
      history: [{ status, at: created, by: 'system' }],
      createdAt: created,
    });
    totalRevenue += total;
    if (Math.random() < 0.6) {
      await InventoryTransaction.create({ product: chosen[0]._id, type: 'sale', quantity: -items[0].quantity, previousStock: 100, newStock: 50, reason: `Sale ${order.orderNumber}`, createdAt: created });
    }
    // sales history = orders themselves
  }
  console.log(`Created ${orderCount} orders (total revenue GHS ${totalRevenue.toFixed(2)})`);

  // Inventory transactions extra (purchase history)
  for (let i = 0; i < 60; i++) {
    const p = pick(products);
    await InventoryTransaction.create({
      product: p._id,
      type: 'purchase',
      quantity: rand(20, 100),
      previousStock: rand(0, 50),
      newStock: rand(50, 150),
      reason: 'Supplier restock',
      performedBy: pick(createdStaff)._id,
      createdAt: new Date(Date.now() - rand(1, 200) * 86400000),
    });
  }
  console.log('Created inventory transactions');

  // Audit logs sample
  for (let i = 0; i < 30; i++) {
    await AuditLog.create({
      action: pick(['create_product', 'update_order_status', 'create_staff', 'create_coupon', 'adjust_stock']),
      entity: pick(['product', 'order', 'user', 'coupon', 'inventory']),
      performedBy: pick(createdStaff)._id,
      performedByRole: pick(['admin', 'super_admin', 'staff']),
      details: 'Seed audit entry',
      createdAt: new Date(Date.now() - rand(1, 100) * 86400000),
    });
  }
  console.log('Created audit logs');

  await mongoose.disconnect();
  console.log('Seed complete.');
}

async function hash(pw: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hash(pw, 12);
}

main().catch((e) => { console.error(e); process.exit(1); });
