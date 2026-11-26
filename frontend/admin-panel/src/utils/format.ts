// Display helpers: money, dates and numbers.
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const moneyCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const number = new Intl.NumberFormat('en-US');
const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/** 1999 → "$1,999" */
export const formatCurrency = (value: number): string => money.format(value);
/** 19.5 → "$19.50" */
export const formatCurrencyExact = (value: number): string => moneyCents.format(value);
export const formatNumber = (value: number): string => number.format(value);
export const formatDate = (iso: string): string => date.format(new Date(iso));
export const formatDateTime = (iso: string): string => dateTime.format(new Date(iso));
export const formatPercent = (value: number, digits = 0): string => `${value.toFixed(digits)}%`;

/** "2026-11-25T…" → "2026-11-25" (for date inputs). */
export const toDateInput = (iso: string): string => (iso ? iso.slice(0, 10) : '');
/** "2026-11-25" → ISO string at local midnight. */
export const fromDateInput = (value: string): string => (value ? new Date(`${value}T00:00:00`).toISOString() : '');

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
