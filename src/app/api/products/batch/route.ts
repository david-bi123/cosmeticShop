import { NextRequest, NextResponse } from 'next/server';
import { getProductsByIds } from '@/actions/catalog';

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get('ids') || '').split(',').filter(Boolean);
  if (!ids.length) return NextResponse.json({ products: [] });
  const products = await getProductsByIds(ids);
  return NextResponse.json({ products });
}
