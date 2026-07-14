import { getCurrentUser } from '@/lib/session';
import { SecurityForm } from '@/components/shared/security-form';

export const metadata = { title: 'Security | Lumière Beauty' };

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Security</h2>
      <SecurityForm email={user.email} verified={user.emailVerified} />
    </div>
  );
}
