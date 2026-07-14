import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StaffForm } from '@/components/admin/staff-form';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Employees | Admin' };

const ROLE_LABELS: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', staff: 'Staff' };

export default async function EmployeesPage() {
  await dbConnect();
  const staff = await User.find({ role: { $in: ['staff', 'admin', 'super_admin'] } }).sort({ createdAt: -1 }).lean();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Employees</h1><p className="text-muted-foreground">{staff.length} team members</p></div>
        <Dialog>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="h-4 w-4" /> Add Staff</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Staff Account</DialogTitle></DialogHeader>
            <StaffForm />
          </DialogContent>
        </Dialog>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Permissions</th><th className="px-4 py-3 text-left">Joined</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {staff.map((s: any) => (
                <tr key={s._id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3"><Badge variant={s.role === 'super_admin' ? 'gold' : 'secondary'}>{ROLE_LABELS[s.role]}</Badge></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(s.permissions || []).map((p: string) => <Badge key={p} variant="outline" className="text-[10px]">{p.replace('manage_', '')}</Badge>)}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right"><Button asChild variant="ghost" size="icon"><Link href={`/admin/employees/${s._id}/edit`}><Pencil className="h-4 w-4" /></Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
