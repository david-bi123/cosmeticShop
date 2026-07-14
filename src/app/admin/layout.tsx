import { redirect } from 'next/navigation';
import { getToken, isAdminRole } from '@/lib/auth';
import { AdminSidebar } from '@/components/shared/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let payload;
  try {
    payload = await getToken();
  } catch (e) {
    console.error('[ADMIN_LAYOUT] getToken failed:', e instanceof Error ? e.message : String(e), e instanceof Error ? e.stack : '');
    redirect('/login?redirect=/admin');
  }
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
