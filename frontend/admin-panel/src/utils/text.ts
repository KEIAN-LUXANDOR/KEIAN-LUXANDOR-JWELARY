/** "Engagement Rings" → "engagement-rings" */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Short unique id for records created in the browser (the backend issues real ids). */
export const createId = (prefix = 'id'): string => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Every word of the query must appear somewhere in the text. */
export const matchesSearch = (text: string, query: string): boolean => {
  const t = text.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => t.includes(w));
};
