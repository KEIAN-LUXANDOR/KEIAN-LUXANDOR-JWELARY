import { SITE } from '@/lib/site';

const formatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
});

/** 1999 → "$1,999" */
export const formatPrice = (value: number): string => formatter.format(value);
