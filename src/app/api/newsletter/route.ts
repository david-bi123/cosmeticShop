import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Newsletter } from '@/models/Newsletter';
import { checkOrigin } from '@/lib/security';

export async function POST(req: NextRequest) {
  if (!(await checkOrigin())) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  const form = await req.formData();
  const email = String(form.get('email') || '').toLowerCase().trim();
  if (!email.includes('@')) return NextResponse.redirect(new URL('/?nl=error', req.url));
  await dbConnect();
  await Newsletter.findOneAndUpdate({ email }, { email, subscribed: true }, { upsert: true });
  return NextResponse.redirect(new URL('/?nl=success', req.url));
}

