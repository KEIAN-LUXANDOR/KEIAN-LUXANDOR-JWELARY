// ─────────────────────────────────────────────────────────────
// Home page content. Every `image` field is optional — leave it empty to
// show the styled placeholder, or use an image from the public folder
// like '/banners/heroBanner.webp'.
// ─────────────────────────────────────────────────────────────
import type { Tone } from '@/types/common';

interface Cta {
  label: string;
  to: string;
}

export const HERO: { eyebrow: string; title: string; cta: Cta; image: string; tone: Tone } = {
  eyebrow: 'The Keian Signature Collection',
  title: 'Brilliance, Redefined',
  cta: { label: 'Shop Signature', to: '/collections/signature' },
  image: '/banners/heroBanner.webp',
  tone: 'gold',
};

export const CATEGORIES: { label: string; to: string; tone: Tone; image?: string }[] = [
  {
    label: 'Earrings',
    to: '/earrings',
    tone: 'gold',
    image: '/images/earring.webp',
  },
  {
    label: 'Rings',
    to: '/rings',
    tone: 'rose',
    image: '/images/ring.webp',
  },
  {
    label: 'Bracelets',
    to: '/bracelets',
    tone: 'silver',
    image: '/images/bracelet.webp',
  },
  {
    label: 'Pendants',
    to: '/pendants',
    tone: 'gold',
    image: '/images/pendant.webp',
  },
  {
    label: 'Necklaces',
    to: '/necklaces',
    tone: 'cream',
    image: '/images/necklace.webp',
  },
];

export const CAMPAIGN: { title: string; text: string; cta: Cta; image?: string; tone: Tone } = {
  title: 'Unmistakably Her',
  text: 'You know her style and all her little things. Find a Keian Luxandor piece that feels just like her — lab-grown diamonds, made to be treasured.',
  cta: { label: 'Shop Gifts for Her', to: '/collections/gifts' },
  image: '/banners/her-style.webp',
  tone: 'cream',
};

// Zig-zag story section (below the "Unmistakably Her" section)
export const STORIES: { eyebrow: string; title: string; text: string; cta: Cta; image: string }[] = [
  {
    eyebrow: 'A Keian Promise',
    title: 'Promise Ring',
    text: 'A promise made in brilliance — lab-grown diamonds, set to be worn every day and treasured for a lifetime.',
    cta: { label: 'Shop Rings', to: '/rings' },
    image: '/images/ring.webp',
  },
  {
    eyebrow: 'The Keian Signature',
    title: 'Tennis Bracelet',
    text: 'A continuous line of light around her wrist — effortless sparkle from day to night.',
    cta: { label: 'Shop Bracelets', to: '/bracelets' },
    image: '/images/bracelet.webp',
  },
];

// "Our Craft" section (below the Promise Ring / Tennis Bracelet banners)
export const CRAFT: {
  eyebrow: string;
  title: [string, string];
  text: string;
  cta: Cta;
  video?: string;
  poster?: string;
  image: string;
} = {
  eyebrow: 'Our Craft',
  title: ['Made by Hand,', 'Made to Last'],
  text: 'From the first sketch to the final polish, every Keian Luxandor piece is shaped with care — lab-grown diamonds, finished to shine for a lifetime.',
  cta: { label: 'Discover Our Story', to: '/about-us' },
  // Ring video in the arch (plays silently on repeat). Remove `video` to show `image` instead.
  video: '/videos/craft-ring.mp4',
  poster: '/videos/craft-ring.webp',
  image: '/images/bracelet.webp',
};

// Benefits strip (end of home page, above the newsletter).
// Please keep these in line with Keian's real shipping, returns and warranty policies.
export const BENEFITS: { icon: 'ship' | 'returns' | 'warranty' | 'appointment'; title: string; text: string }[] = [
  { icon: 'ship', title: 'Complimentary Shipping', text: 'Every order is insured and delivered with care.' },
  { icon: 'returns', title: '15-Day Returns', text: 'Return any piece within 15 days in its original condition.' },
  { icon: 'warranty', title: 'Lifetime Warranty', text: 'Every Keian Luxandor piece is covered for life.' },
  { icon: 'appointment', title: 'Personal Appointment', text: 'Find your piece one-to-one with a Keian expert.' },
];
