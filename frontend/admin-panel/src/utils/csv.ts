// Export a table to a CSV file the browser downloads (opens in Excel / Google Sheets).
const escape = (value: unknown): string => {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (headers: string[], rows: unknown[][]): string => [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');

export const downloadCsv = (filename: string, headers: string[], rows: unknown[][]): void => {
  const blob = new Blob([toCsv(headers, rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
