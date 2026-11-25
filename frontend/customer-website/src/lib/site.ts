// ─────────────────────────────────────────────────────────────
// Central brand / site configuration.
// ─────────────────────────────────────────────────────────────
import type { IconName } from '@/types/common';

export const SITE = {
  name: 'Keian Luxandor',
  fullName: 'Keian Luxandor',
  logoTop: 'Keian',
  logoBottom: 'Luxandor',
  description: 'Keian Luxandor fine jewelry — engagement rings, wedding bands, everyday diamonds and gifts, finished by hand.',
  phone: '+91 9898552297',
  email: 'info@keianluxandor.com',
  currency: 'USD',
  locale: 'en-US',
  social: [
    { name: 'Facebook', url: '#', icon: 'facebook' },
    { name: 'Instagram', url: '#', icon: 'instagram' },
    { name: 'Pinterest', url: '#', icon: 'pinterest' },
    { name: 'YouTube', url: '#', icon: 'youtube' },
    { name: 'LinkedIn', url: '#', icon: 'linkedin' },
  ] satisfies { name: string; url: string; icon: IconName }[],
} as const;
