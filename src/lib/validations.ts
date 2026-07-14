import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  street: z.string().min(3),
  city: z.string().min(2),
  region: z.string().min(2),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Please write a comment'),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().min(1),
  supplier: z.string().optional(),
  price: z.number().min(0),
  costPrice: z.number().min(0),
  discountPrice: z.number().optional(),
  stock: z.number().min(0),
  lowStockThreshold: z.number().optional(),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  shades: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['pending','accepted','processing','packed','ready','delivered','cancelled','refunded']),
});

export const couponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(['percentage','fixed']),
  discountValue: z.number().min(0),
  minOrder: z.number().optional(),
  maxDiscount: z.number().optional(),
  expiresAt: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
