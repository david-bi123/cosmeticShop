import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffForm } from '@/components/admin/staff-form';

export const metadata = { title: 'Edit Staff | Admin' };

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const staff = await User.findById(id).lean();
  if (!staff) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Staff</h1>
      <Card><CardHeader><CardTitle>{(staff as any).name}</CardTitle></CardHeader><CardContent><StaffForm staff={staff as any} /></CardContent></Card>
    </div>
  );
}
