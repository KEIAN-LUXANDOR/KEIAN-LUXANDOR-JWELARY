import type { Metadata } from 'next';
import SettingsForm from '@/features/settings/components/SettingsForm';

export const metadata: Metadata = { title: 'Settings' };

// Address: /settings
export default function Page() {
  return <SettingsForm />;
}
