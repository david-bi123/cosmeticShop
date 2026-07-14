import { NextRequest, NextResponse } from 'next/server';
import { addReviewAction } from '@/actions/reviews';

export async function POST(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const fd = await req.formData();
  const result = await addReviewAction(productId, fd);
  return NextResponse.json(result);
}
