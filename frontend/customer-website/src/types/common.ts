// Shared data definitions used across the whole website.

/** Background colour family used by image placeholders and banners. */
export type Tone = 'cream' | 'gold' | 'rose' | 'silver' | 'blush';

/** Names of the inline SVG icons in components/common/Icon.tsx. */
export type IconName =
  | 'search' | 'heart' | 'bag' | 'user' | 'pin' | 'phone' | 'mail' | 'chat' | 'calendar'
  | 'menu' | 'close' | 'chevronDown' | 'chevronRight' | 'chevronLeft' | 'arrowRight'
  | 'plus' | 'minus' | 'award' | 'gem' | 'leaf' | 'hash' | 'star' | 'truck' | 'shield'
  | 'refresh' | 'locate' | 'facebook' | 'instagram' | 'pinterest' | 'youtube' | 'linkedin';

/** Overlays that can be opened from anywhere on the site. */
export type OverlayName = 'search' | 'appointment' | 'chat' | 'menu';

export interface CtaLink {
  label: string;
  to: string;
}

export interface NavLinkItem extends CtaLink {
  strong?: boolean;
  swatch?: string;
  shape?: string;
  thumb?: boolean;
}

export interface MenuColumn {
  title: string;
  links: NavLinkItem[];
  wide?: boolean;
  grid?: boolean;
}

export interface NavMenu {
  id: string;
  label: string;
  to: string;
  intro?: { title: string; text: string };
  columns: MenuColumn[];
  explore?: NavLinkItem;
  feature?: { title: string; cta: string; to: string; tone: Tone };
}

export interface UtilityLink extends CtaLink {
  icon: IconName;
}

export interface FooterLink {
  label: string;
  to?: string;
  href?: string;
  action?: OverlayName;
  icon?: IconName;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface Crumb {
  label: string;
  to?: string;
}

export interface StoreLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  type: string;
}
