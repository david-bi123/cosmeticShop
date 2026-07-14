'use server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/db';
import { Order, IOrderItem } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Coupon } from '@/models/Coupon';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { AuditLog } from '@/models/AuditLog';
import { getToken, CART_COOKIE } from '@/lib/auth';
import { PaymentMethod, OrderStatus } from '@/lib/constants';
import { checkOrigin, getClientIp } from '@/lib/security';
import { revalidatePath } from 'next/cache';

interface CartCookie {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: any;
  stock: number;
  sku: string;
}

function orderNumber(): string {
  return 'LUM-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);
}

export async function placeOrderAction(formData: FormData) {
  if (!(await checkOrigin())) return { success: false, error: 'Invalid request origin' };
  const payload = await getToken();
  if (!payload) return { success: false, error: 'Please login to checkout' };

  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  if (!raw) return { success: false, error: 'Your cart is empty' };
  let cart: CartCookie[];
  try {
    cart = JSON.parse(decodeURIComponent(raw));
  } catch {
    return { success: false, error: 'Invalid cart' };
  }
  if (!cart.length) return { success: false, error: 'Your cart is empty' };

  const address = {
    fullName: String(formData.get('fullName')),
    phone: String(formData.get('phone')),
    street: String(formData.get('street')),
    city: String(formData.get('city')),
    region: String(formData.get('region')),
    landmark: String(formData.get('landmark') || ''),
  };
  const paymentMethod = (formData.get('paymentMethod') as string) || PaymentMethod.CASH_ON_DELIVERY;
  const couponCode = String(formData.get('coupon') || '').toUpperCase();

  await dbConnect();
  const productIds = cart.map((c) => c.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const items: IOrderItem[] = [];
  let subtotal = 0;
  for (const c of cart) {
    const p = products.find((pp) => pp._id.toString() === c.productId);
    if (!p) continue;
    if (p.stock < c.quantity) return { success: false, error: `${p.name} is out of stock` };
    items.push({
      product: p._id,
      name: p.name,
      image: c.image,
      price: c.price,
      quantity: c.quantity,
      variant: c.variant,
      sku: p.sku,
    });
    subtotal += c.price * c.quantity;
  }

  let discount = 0;
  let couponDoc = null;
  if (couponCode) {
    couponDoc = await Coupon.findOne({ code: couponCode, isActive: true });
    if (couponDoc) {
      if (couponDoc.discountType === 'percentage') {
        discount = (subtotal * couponDoc.discountValue) / 100;
        if (couponDoc.maxDiscount) discount = Math.min(discount, couponDoc.maxDiscount);
      } else discount = couponDoc.discountValue;
      discount = Math.min(discount, subtotal);
    }
  }

  const shipping = subtotal - discount > 300 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const order = await Order.create({
    orderNumber: orderNumber(),
    customer: payload.userId,
    customerName: address.fullName,
    customerPhone: address.phone,
    items,
    subtotal,
    discount,
    shipping,
    total,
    status: OrderStatus.PENDING,
    paymentMethod,
    paymentStatus: paymentMethod === PaymentMethod.MOBILE_MONEY ? 'pending' : 'pending',
    coupon: couponCode || undefined,
    shippingAddress: address,
    history: [{ status: OrderStatus.PENDING, at: new Date(), by: payload.name }],
  });

  for (const item of items) {
    const p = products.find((pp) => pp._id.toString() === (item.product as any).toString());
    if (!p) continue;
    const prev = p.stock;
    p.stock -= item.quantity;
    await p.save();
    await InventoryTransaction.create({
      product: p._id,
      type: 'sale',
      quantity: -item.quantity,
      previousStock: prev,
      newStock: p.stock,
      reason: `Sale - Order ${order.orderNumber}`,
      performedBy: payload.userId,
    });
  }

  await User.findByIdAndUpdate(payload.userId, { $inc: { totalSpent: total, totalOrders: 1 } });
  if (couponDoc) await Coupon.findByIdAndUpdate(couponDoc._id, { $inc: { usedCount: 1 } });
  await AuditLog.create({ action: 'create_order', entity: 'order', entityId: order._id.toString(), performedBy: payload.userId, performedByRole: payload.role, details: `Order ${order.orderNumber} placed`, ip: await getClientIp() });

  cookieStore.delete(CART_COOKIE);
  revalidatePath('/account/orders');
  return { success: true, orderId: order._id.toString(), orderNumber: order.orderNumber };
}

