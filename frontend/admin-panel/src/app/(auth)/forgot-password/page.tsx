import type { Metadata } from 'next';
import AuthCard from '@/components/common/AuthCard';
import ForgotPasswordForm from '@/features/users/components/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Forgot password' };

// Address: /forgot-password
export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" text="Enter your admin email and we’ll send you a reset link.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
