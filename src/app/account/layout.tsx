import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getToken } from '@/lib/auth';
import { AccountSidebar } from '@/components/shared/account-sidebar';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const payload = await getToken();
  if (!payload) redirect('/login?redirect=/account');
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/account');

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountSidebar role={user.role} />
        <div>{children}</div>
      </div>
    </div>
  );
}
