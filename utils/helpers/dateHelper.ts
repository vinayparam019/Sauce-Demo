export function getIsoWeekNumber(date: Date) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function extractDayNumber(date: string) {
  return parseInt(date.replace(/(st|nd|rd|th)/, ''), 10);
}

export function calculateEndDate(startDate: Date, month: number) {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + month);
  endDate.setDate(endDate.getDate() - 1);
  return endDate;
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getDateSuffix(date: number): string {
  let suffix = 'th';
  if (date < 11 || date > 13) {
    switch (date % 10) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
    }
  }
  return suffix;
}

export function formatNumber(value: number): number {
  return Number(value.toFixed(2));
}
