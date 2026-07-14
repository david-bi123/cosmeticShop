import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getToken } from '@/lib/auth';
import { CheckoutClient } from '@/components/shared/checkout-client';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Checkout | Lumière Beauty' };

export default async function CheckoutPage() {
  const payload = await getToken();
  if (!payload) redirect('/login?redirect=/checkout');
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/checkout');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <CheckoutClient user={{ name: user.name }} addresses={(user.addresses || []).map((a: any) => ({ fullName: a.fullName, phone: a.phone, street: a.street, city: a.city, region: a.region, landmark: a.landmark }))} />
    </div>
  );
}
