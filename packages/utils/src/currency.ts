export function formatCurrency(amount: number, currency: string = 'ETB', locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatETB(amount: number, isAmharic: boolean = false): string {
  if (isAmharic) {
    return `${amount.toLocaleString('am-ET')} ብር`;
  }
  return `${amount.toLocaleString('en-ET')} ETB`;
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}