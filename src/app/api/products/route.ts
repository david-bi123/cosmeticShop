import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/actions/catalog';
import { CART_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const result = await getProducts({
    search: sp.get('q') || undefined,
    category: sp.get('category') || undefined,
    brand: sp.get('brand') || undefined,
    featured: sp.get('featured') === '1',
    bestSeller: sp.get('best') === '1',
    newArrival: sp.get('new') === '1',
    sort: sp.get('sort') || undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 24,
  });
  return NextResponse.json(result);
}
