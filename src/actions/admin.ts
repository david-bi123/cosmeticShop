'use server';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { Coupon } from '@/models/Coupon';
import { AuditLog } from '@/models/AuditLog';
import { getToken, isAdminRole, hasPermission, type UserRoleType } from '@/lib/auth';
import { UserRole, StaffPermissions, OrderStatus, type OrderStatusType } from '@/lib/constants';
import { checkOrigin, getClientIp } from '@/lib/security';
import { revalidatePath } from 'next/cache';
import { slugify, generateSKU, generateBarcode, normalizeImages } from '@/lib/utils';
import { uploadImage } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';

function err(m: string) { return { success: false, error: m }; }

function parseList(value?: string): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseImages(formData: FormData): { url: string; publicId?: string }[] {
  const json = formData.get('imagesJson');
  if (json) {
    try {
      const parsed = JSON.parse(String(json));
      if (Array.isArray(parsed)) return normalizeImages(parsed);
    } catch {
      /* fall through to textarea parsing */
    }
  }
  const lines = formData.getAll('images').map(String).filter(Boolean);
  return normalizeImages(lines);
}

export async function requireAdmin(perm?: string) {
  const payload = await getToken();
  if (!payload) redirect('/login?redirect=/admin');
  if (!isAdminRole(payload.role) && !hasPermission(payload, perm || '')) redirect('/account');
  return payload;
}

async function audit(action: string, entity: string, entityId: string, payload: any) {
  return AuditLog.create({ action, entity, entityId, performedBy: payload?.userId, performedByRole: payload?.role, ip: await getClientIp() });
}

/* ---------------- PRODUCTS ---------------- */
export async function createProductAction(formData: FormData) {
  if (!(await checkOrigin())) return err('Invalid origin');
  const payload = await requireAdmin(StaffPermissions.MANAGE_PRODUCTS);
  await dbConnect();
  const name = String(formData.get('name'));
  const category = String(formData.get('category'));
  const brand = String(formData.get('brand'));
  const price = Number(formData.get('price'));
  const costPrice = Number(formData.get('costPrice'));
  const stock = Number(formData.get('stock'));
  const sku = String(formData.get('sku')) || generateSKU('PRD', Math.floor(Math.random() * 90000) + 10000);
  const product = await Product.create({
    name,
    slug: slugify(name) + '-' + Math.floor(Math.random() * 9999),
    description: String(formData.get('description') || ''),
    category,
    brand,
    supplier: formData.get('supplier') ? String(formData.get('supplier')) : undefined,
    price,
    costPrice,
    stock,
    sku,
    barcode: String(formData.get('barcode') || generateBarcode()),
    lowStockThreshold: Number(formData.get('lowStockThreshold') || 10),
    sizes: parseList(formData.get('sizes') ? String(formData.get('sizes')) : ''),
    colors: parseList(formData.get('colors') ? String(formData.get('colors')) : ''),
    shades: parseList(formData.get('shades') ? String(formData.get('shades')) : ''),
    isFeatured: formData.get('isFeatured') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
    isNewArrival: formData.get('isNewArrival') === 'on',
    images: parseImages(formData),
  });
  await audit('create_product', 'product', product._id.toString(), payload);
  revalidatePath('/admin/products');
  return { success: true, id: product._id.toString() };
}

export async function uploadProductImageAction(formData: FormData) {
  const payload = await requireAdmin(StaffPermissions.MANAGE_PRODUCTS);
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return err('No file provided');
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return err('Cloudinary is not configured. Add your Cloudinary keys to .env.local to enable uploads, or use image URLs instead.');
  }
  try {
    const result = await uploadImage(file);
    return { success: true, url: result.url, publicId: result.publicId };
  } catch (e: any) {
    return err(e?.message || 'Upload failed');
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  if (!(await checkOrigin())) return err('Invalid origin');
  const payload = await requireAdmin(StaffPermissions.MANAGE_PRODUCTS);
  await dbConnect();
  await Product.findByIdAndUpdate(id, {
    name: String(formData.get('name')),
    description: String(formData.get('description') || ''),
    category: String(formData.get('category')),
    brand: String(formData.get('brand')),
    supplier: formData.get('supplier') ? String(formData.get('supplier')) : undefined,
    price: Number(formData.get('price')),
    costPrice: Number(formData.get('costPrice')),
    stock: Number(formData.get('stock')),
    lowStockThreshold: Number(formData.get('lowStockThreshold') || 10),
    sizes: parseList(formData.get('sizes') ? String(formData.get('sizes')) : ''),
    colors: parseList(formData.get('colors') ? String(formData.get('colors')) : ''),
    shades: parseList(formData.get('shades') ? String(formData.get('shades')) : ''),
    isFeatured: formData.get('isFeatured') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
    isNewArrival: formData.get('isNewArrival') === 'on',
    images: parseImages(formData),
  });
  await audit('update_product', 'product', id, payload);
  revalidatePath('/admin/products');
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const payload = await requireAdmin(StaffPermissions.MANAGE_PRODUCTS);
  await dbConnect();
  await Product.findByIdAndDelete(id);
  await audit('delete_product', 'product', id, payload);
  revalidatePath('/admin/products');
  return { success: true };
}

/* ---------------- ORDERS ---------------- */
export async function updateOrderStatusAction(formData: FormData) {
  if (!(await checkOrigin())) return err('Invalid origin');
  const payload = await requireAdmin(StaffPermissions.MANAGE_ORDERS);
  const orderId = String(formData.get('orderId'));
  const status = String(formData.get('status')) as OrderStatusType;
  await dbConnect();
  const order = await Order.findById(orderId);
  if (!order) return err('Order not found');
  order.status = status;
  if (status === 'delivered') order.deliveredAt = new Date();
  order.history = order.history || [];
  order.history.push({ status, at: new Date(), by: payload.name });
  await order.save();
  await audit('update_order_status', 'order', orderId, payload);
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

/* ---------------- INVENTORY ---------------- */
export async function adjustStockAction(formData: FormData) {
  if (!(await checkOrigin())) return err('Invalid origin');
  const payload = await requireAdmin(StaffPermissions.MANAGE_INVENTORY);
  const productId = String(formData.get('productId'));
  const type = String(formData.get('type')) as 'adjustment' | 'restock' | 'damage' | 'return';
  const qty = Number(formData.get('quantity'));
  const reason = String(formData.get('reason') || 'Manual adjustment');
  await dbConnect();
  const product = await Product.findById(productId);
  if (!product) return err('Product not found');
  const prev = product.stock;
  if (type === 'damage') product.stock = Math.max(0, product.stock - qty);
  else if (type === 'return') product.stock += qty;
  else product.stock += qty;
  await product.save();
  await InventoryTransaction.create({ product: productId, type, quantity: type === 'damage' ? -qty : qty, previousStock: prev, newStock: product.stock, reason, performedBy: payload.userId });
  await audit('adjust_stock', 'product', productId, payload);
  revalidatePath('/admin/inventory');
  return { success: true };
}

/* ---------------- CUSTOMERS ---------------- */
export async function updateCustomerAction(formData: FormData) {
  const payload = await requireAdmin(StaffPermissions.MANAGE_CUSTOMERS);
  const id = String(formData.get('id'));
  await dbConnect();
  await User.findByIdAndUpdate(id, {
    blocked: formData.get('blocked') === 'on',
    notes: String(formData.get('notes') || ''),
  });
  await audit('update_customer', 'user', id, payload);
  revalidatePath('/admin/customers');
  return { success: true };
}

/* ---------------- STAFF ---------------- */
export async function createStaffAction(formData: FormData) {
  if (!(await checkOrigin())) return err('Invalid origin');
  const payload = await requireAdmin(StaffPermissions.MANAGE_STAFF);
  await dbConnect();
  const name = String(formData.get('name'));
  const email = String(formData.get('email')).toLowerCase();
  const password = String(formData.get('password'));
  const role = String(formData.get('role')) as UserRoleType;
  const permissions = formData.getAll('permissions').map(String);
  const hashed = await bcrypt.hash(password, 12);
  const staff = await User.create({ name, email, password: hashed, role, permissions, phone: String(formData.get('phone') || '') });
  await audit('create_staff', 'user', staff._id.toString(), payload);
  revalidatePath('/admin/employees');
  return { success: true, id: staff._id.toString() };
}

export async function updateStaffAction(id: string, formData: FormData) {
  const payload = await requireAdmin(StaffPermissions.MANAGE_STAFF);
  await dbConnect();
  await User.findByIdAndUpdate(id, {
    name: String(formData.get('name')),
    role: String(formData.get('role')),
    permissions: formData.getAll('permissions').map(String),
    blocked: formData.get('blocked') === 'on',
  });
  await audit('update_staff', 'user', id, payload);
  revalidatePath('/admin/employees');
  return { success: true };
}

export async function deleteStaffAction(id: string) {
  const payload = await requireAdmin(StaffPermissions.MANAGE_STAFF);
  await dbConnect();
  await User.findByIdAndDelete(id);
  await audit('delete_staff', 'user', id, payload);
  revalidatePath('/admin/employees');
  return { success: true };
}

/* ---------------- COUPONS ---------------- */
export async function createCouponAction(formData: FormData) {
  const payload = await requireAdmin();
  await dbConnect();
  const code = String(formData.get('code')).toUpperCase();
  const coupon = await Coupon.create({
    code,
    description: String(formData.get('description') || ''),
    discountType: String(formData.get('discountType')) as 'percentage' | 'fixed',
    discountValue: Number(formData.get('discountValue')),
    minOrder: Number(formData.get('minOrder') || 0),
    maxDiscount: formData.get('maxDiscount') ? Number(formData.get('maxDiscount')) : undefined,
    expiresAt: formData.get('expiresAt') ? new Date(String(formData.get('expiresAt'))) : undefined,
    usageLimit: formData.get('usageLimit') ? Number(formData.get('usageLimit')) : undefined,
  });
  await audit('create_coupon', 'coupon', coupon._id.toString(), payload);
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCouponAction(id: string) {
  const payload = await requireAdmin();
  await dbConnect();
  await Coupon.findByIdAndDelete(id);
  await audit('delete_coupon', 'coupon', id, payload);
  revalidatePath('/admin/coupons');
  return { success: true };
}




