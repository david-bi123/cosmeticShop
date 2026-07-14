import { AuthShell } from '@/components/shared/auth-shell';
import { ForgotForm } from '@/components/shared/forgot-form';

export const metadata = { title: 'Forgot Password | Lumière Beauty' };

export default function ForgotPage() {
  return (
    <AuthShell title="Reset password" subtitle="We'll send you a reset link">
      <ForgotForm />
    </AuthShell>
  );
}
