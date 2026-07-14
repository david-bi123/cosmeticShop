'use client';
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addAddressAction } from '@/actions/auth';
import { toast } from 'sonner';

interface Addr { fullName: string; phone: string; street: string; city: string; region: string; landmark?: string; isDefault?: boolean }

export function AddressBook({ initial }: { initial: Addr[] }) {
  const [addresses, setAddresses] = React.useState<Addr[]>(initial);
  const [showForm, setShowForm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await addAddressAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) {
      toast.success('Address added');
      setShowForm(false);
      location.reload();
    } else toast.error((res as any).error || 'Failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="rounded-full"><Plus className="h-4 w-4" /> Add Address</Button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="glass-card mt-4 grid gap-3 rounded-xl p-4 sm:grid-cols-2">
          <div><Label className="text-xs">Full Name</Label><Input name="fullName" required className="mt-1" /></div>
          <div><Label className="text-xs">Phone</Label><Input name="phone" required className="mt-1" /></div>
          <div className="sm:col-span-2"><Label className="text-xs">Street Address</Label><Input name="street" required className="mt-1" /></div>
          <div><Label className="text-xs">City</Label><Input name="city" required className="mt-1" /></div>
          <div><Label className="text-xs">Region</Label><Input name="region" required className="mt-1" /></div>
          <div className="sm:col-span-2"><Label className="text-xs">Landmark</Label><Input name="landmark" className="mt-1" /></div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="isDefault" /> Set as default</label>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" disabled={busy} size="sm">Save Address</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {addresses.map((a, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium">{a.fullName}</p>
              {a.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Default</span>}
            </div>
            <p className="text-muted-foreground">{a.phone}</p>
            <p className="text-muted-foreground">{a.street}, {a.city}, {a.region}</p>
          </div>
        ))}
      </div>
      {addresses.length === 0 && !showForm && <p className="mt-4 text-sm text-muted-foreground">No addresses saved yet.</p>}
    </div>
  );
}

