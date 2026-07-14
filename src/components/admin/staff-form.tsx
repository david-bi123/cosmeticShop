'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createStaffAction, updateStaffAction } from '@/actions/admin';
import { toast } from 'sonner';
import { ALL_PERMISSIONS, StaffPermissions, UserRole } from '@/lib/constants';

const PERM_LABELS: Record<string, string> = {
  manage_products: 'Manage Products',
  manage_orders: 'Manage Orders',
  manage_customers: 'Manage Customers',
  manage_inventory: 'Manage Inventory',
  view_reports: 'View Reports',
  manage_staff: 'Manage Staff',
};

export function StaffForm({ staff }: { staff?: any }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = staff ? await updateStaffAction(staff._id, fd) : await createStaffAction(fd);
    setBusy(false);
    if (res.success) { toast.success('Saved'); router.push('/admin/employees'); router.refresh(); }
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Full Name</Label><Input name="name" defaultValue={staff?.name} required className="mt-1" /></div>
        <div><Label className="text-xs">Email</Label><Input name="email" type="email" defaultValue={staff?.email} required disabled={!!staff} className="mt-1" /></div>
        <div><Label className="text-xs">Phone</Label><Input name="phone" defaultValue={staff?.phone} className="mt-1" /></div>
        <div><Label className="text-xs">Role</Label><select name="role" defaultValue={staff?.role || 'staff'} className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm"><option value="staff">Staff</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select></div>
        {!staff && <div className="sm:col-span-2"><Label className="text-xs">Temporary Password</Label><Input name="password" type="password" required minLength={6} className="mt-1" /></div>}
      </div>
      <div>
        <Label className="text-xs">Permissions</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ALL_PERMISSIONS.map((p) => (
            <label key={p} className="flex items-center gap-2 rounded-lg border border-white/40 p-2 text-sm">
              <Checkbox name="permissions" value={p} defaultChecked={staff?.permissions?.includes(p)} />
              {PERM_LABELS[p]}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/employees')}>Cancel</Button>
      </div>
    </form>
  );
}

