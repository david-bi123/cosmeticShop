'use server';
import { dbConnect } from '@/lib/db';
import { Product } from '@/models/Product';
import { getToken } from '@/lib/auth';
import { checkOrigin, rateLimit, getClientIp } from '@/lib/security';
import { revalidatePath } from 'next/cache';

export async function addReviewAction(productId: string, formData: FormData) {
  if (!(await checkOrigin())) return { success: false, error: 'Invalid request' };
  const ip = await getClientIp();
  if (!rateLimit(`review_${ip}`, 5, 60_000)) return { success: false, error: 'Too many reviews. Slow down.' };

  const payload = await getToken();
  if (!payload) return { success: false, error: 'Please login to review' };

  const rating = Number(formData.get('rating'));
  const comment = String(formData.get('comment') || '').trim();
  if (rating < 1 || rating > 5) return { success: false, error: 'Select a rating' };
  if (comment.length < 3) return { success: false, error: 'Write a comment' };

  await dbConnect();
  const product = await Product.findById(productId);
  if (!product) return { success: false, error: 'Product not found' };

  product.reviews = product.reviews || [];
  product.reviews.push({ user: payload.userId as any, name: payload.name, rating, comment, createdAt: new Date() });
  const ratings = product.reviews.map((r: any) => r.rating);
  product.rating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
  product.ratingCount = ratings.length;
  await product.save();

  revalidatePath(`/products/${product.slug}`);
  return { success: true };
}

