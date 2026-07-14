import { redirect } from 'next/navigation';
import { getToken, isAdminRole } from '@/lib/auth';
import { AdminSidebar } from '@/components/shared/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getToken();
  if (!payload) redirect('/login?redirect=/admin');
  if (!isAdminRole(payload.role) && payload.role !== 'staff') redirect('/account');
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-background">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 pt-20 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}
