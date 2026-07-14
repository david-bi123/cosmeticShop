import { dbConnect } from '@/lib/db';
import { Product, IProduct } from '@/models/Product';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';
import { Order } from '@/models/Order';
import mongoose from 'mongoose';

export interface ProductFilter {
  category?: string;
  brand?: string;
  search?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
  inStock?: boolean;
}

export async function getProducts(filter: ProductFilter = {}) {
  await dbConnect();
  const query: any = { isActive: true };
  if (filter.category) query.category = new mongoose.Types.ObjectId(filter.category);
  if (filter.brand) query.brand = new mongoose.Types.ObjectId(filter.brand);
  if (filter.featured) query.isFeatured = true;
  if (filter.bestSeller) query.isBestSeller = true;
  if (filter.newArrival) query.isNewArrival = true;
  if (filter.inStock) query.stock = { $gt: 0 };
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
      { sku: { $regex: filter.search, $options: 'i' } },
    ];
  }
  if (typeof filter.minPrice === 'number') query.price = { ...(query.price || {}), $gte: filter.minPrice };
  if (typeof filter.maxPrice === 'number') query.price = { ...(query.price || {}), $lte: filter.maxPrice };

  const sort: any = { createdAt: -1 };
  if (filter.sort === 'price_asc') sort.price = 1;
  else if (filter.sort === 'price_desc') sort.price = -1;
  else if (filter.sort === 'rating') sort.rating = -1;
  else if (filter.sort === 'popular') sort.views = -1;

  const page = filter.page || 1;
  const pageSize = filter.pageSize || 24;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  return { products: products as unknown as IProduct[], total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProductBySlug(slug: string) {
  await dbConnect();
  return Product.findOne({ slug }).populate('category', 'name slug').populate('brand', 'name slug').populate('supplier', 'name').lean();
}

export async function getProductById(id: string) {
  await dbConnect();
  return Product.findById(id).populate('category', 'name slug').populate('brand', 'name slug').lean();
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 8) {
  await dbConnect();
  return Product.find({ category: categoryId, _id: { $ne: productId }, isActive: true })
    .limit(limit)
    .populate('brand', 'name slug')
    .lean();
}

export async function getCategories() {
  await dbConnect();
  return Category.find({ isActive: true }).sort({ name: 1 }).lean();
}

export async function getBrands() {
  await dbConnect();
  return Brand.find({ isActive: true }).sort({ name: 1 }).lean();
}

export async function getFeaturedProducts(limit = 8) {
  await dbConnect();
  return Product.find({ isFeatured: true, isActive: true }).limit(limit).populate('brand', 'name slug').lean();
}

export async function getBestSellers(limit = 8) {
  await dbConnect();
  return Product.find({ isBestSeller: true, isActive: true }).limit(limit).populate('brand', 'name slug').lean();
}

export async function getNewArrivals(limit = 8) {
  await dbConnect();
  return Product.find({ isNewArrival: true, isActive: true }).limit(limit).populate('brand', 'name slug').lean();
}

export async function getProductsByIds(ids: string[]) {
  await dbConnect();
  return Product.find({ _id: { $in: ids.map((i) => new mongoose.Types.ObjectId(i)) }, isActive: true })
    .populate('brand', 'name slug')
    .lean();
}

export async function getBestSellingProducts(limit = 5) {
  await dbConnect();
  const agg = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
  ]);
  const ids = agg.map((a) => a._id);
  const products = await Product.find({ _id: { $in: ids } }).populate('brand', 'name slug').lean();
  return agg
    .map((a) => {
      const p = products.find((pp) => pp._id.toString() === a._id.toString());
      return p ? { ...p, totalSold: a.totalSold, revenue: a.revenue } : null;
    })
    .filter(Boolean);
}
