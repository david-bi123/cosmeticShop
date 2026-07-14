import { AuthShell } from '@/components/shared/auth-shell';
import { ResetForm } from '@/components/shared/reset-form';

export const metadata = { title: 'Reset Password | Lumière Beauty' };

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <AuthShell title="Set new password" subtitle="Enter your new password below">
      <ResetForm token={token} />
    </AuthShell>
  );
}
