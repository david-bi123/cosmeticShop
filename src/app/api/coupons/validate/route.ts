import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Coupon } from '@/models/Coupon';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const total = Number(req.nextUrl.searchParams.get('total') || 0);
  if (!code) return NextResponse.json({ valid: false, error: 'No code' });
  await dbConnect();
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return NextResponse.json({ valid: false, error: 'Coupon expired' });
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' });
  if (total < (coupon.minOrder || 0))
    return NextResponse.json({ valid: false, error: `Minimum order ${coupon.minOrder} GHS` });

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (total * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  discount = Math.min(discount, total);
  return NextResponse.json({ valid: true, code: coupon.code, discount: Math.round(discount * 100) / 100 });
}
