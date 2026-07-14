import { dbConnect } from '@/lib/db';
import { Order, IOrder } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import mongoose from 'mongoose';

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

export async function getDashboardMetrics() {
  await dbConnect();
  const now = new Date();
  const today = startOfDay(now);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 30);

  const paid = { status: { $nin: ['cancelled', 'refunded'] } };
  const [dailyRev, weeklyRev, monthlyRev, totalOrders, pendingOrders, completedOrders, cancelledOrders, lowStock, outOfStock, totalCustomers, totalRevenue] =
    await Promise.all([
      Order.aggregate([{ $match: { ...paid, createdAt: { $gte: today } } }, { $group: { _id: null, sum: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { ...paid, createdAt: { $gte: weekAgo } } }, { $group: { _id: null, sum: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { ...paid, createdAt: { $gte: monthAgo } } }, { $group: { _id: null, sum: { $sum: '$total' } } }]),
      Order.countDocuments(paid),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: { $in: ['cancelled', 'refunded'] } }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ stock: 0 }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([{ $match: paid }, { $group: { _id: null, sum: { $sum: '$total' } } }]),
    ]);

  const daily = dailyRev[0]?.sum || 0;
  const weekly = weeklyRev[0]?.sum || 0;
  const monthly = monthlyRev[0]?.sum || 0;
  const lifetime = totalRevenue[0]?.sum || 0;

  // Sales last 14 days
  const salesTrend = await Order.aggregate([
    { $match: { ...paid, createdAt: { $gte: new Date(today.getTime() - 13 * 86400000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Revenue by weekday (last 4 weeks)
  const revenueByDay = await Order.aggregate([
    { $match: { ...paid, createdAt: { $gte: weekAgo } } },
    { $group: { _id: { $dayOfWeek: '$createdAt' }, revenue: { $sum: '$total' } } },
  ]);

  // Top products
  const topProducts = await Order.aggregate([
    { $match: paid },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, name: { $first: '$items.name' }, image: { $first: '$items.image' } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  // Top customers
  const topCustomers = await Order.aggregate([
    { $match: paid },
    { $group: { _id: '$customer', spent: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { spent: -1 } },
    { $limit: 5 },
  ]);
  const custIds = topCustomers.map((c) => c._id);
  const custDocs = await User.find({ _id: { $in: custIds } }).lean();
  const topCustomersFull = topCustomers.map((c) => {
    const u = custDocs.find((x) => (x as any)._id.toString() === (c._id as any).toString());
    return { ...c, name: (u as any)?.name || 'Customer', email: (u as any)?.email };
  });

  const recentOrders = await Order.find(paid).sort({ createdAt: -1 }).limit(8).lean();
  const inventoryAlerts = await Product.find({ $or: [{ stock: { $lte: 10, $gt: 0 } }, { stock: 0 }] }).limit(8).lean();

  return {
    revenue: { daily, weekly, monthly, lifetime },
    counts: { totalOrders, pendingOrders, completedOrders, cancelledOrders, lowStock, outOfStock, totalCustomers },
    salesTrend: salesTrend.map((s) => ({ date: s._id, revenue: s.revenue, orders: s.orders })),
    revenueByDay: revenueByDay.map((r) => ({ day: r._id, revenue: r.revenue })),
    topProducts,
    topCustomers: topCustomersFull,
    recentOrders,
    inventoryAlerts,
  };
}

export async function getRevenueChart(range: 'daily' | 'weekly' | 'monthly' = 'daily') {
  await dbConnect();
  const paid = { status: { $nin: ['cancelled', 'refunded'] } };
  if (range === 'daily') {
    const start = startOfDay(new Date());
    const data = await Order.aggregate([
      { $match: { ...paid, createdAt: { $gte: new Date(start.getTime() - 13 * 86400000) } } },
      { $group: { _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return data.map((d) => ({ label: d._id, revenue: d.revenue, orders: d.orders }));
  }
  if (range === 'weekly') {
    const data = await Order.aggregate([
      { $match: paid },
      { $group: { _id: { $dateToString: { format: '%Y-W%V', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 8 },
    ]);
    return data.reverse().map((d) => ({ label: d._id, revenue: d.revenue, orders: d.orders }));
  }
  const data = await Order.aggregate([
    { $match: paid },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 12 },
  ]);
  return data.map((d) => ({ label: d._id, revenue: d.revenue, orders: d.orders }));
}
