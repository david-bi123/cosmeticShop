import { getCurrentUser } from '@/lib/session';
import { AddressBook } from '@/components/shared/address-book';

export const metadata = { title: 'Addresses | Lumière Beauty' };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const addresses = (user.addresses || []).map((a: any) => ({
    fullName: a.fullName,
    phone: a.phone,
    street: a.street,
    city: a.city,
    region: a.region,
    landmark: a.landmark,
    isDefault: a.isDefault,
  }));
  return <AddressBook initial={addresses} />;
}
