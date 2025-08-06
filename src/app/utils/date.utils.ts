export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseInputDate(dateString: string): Date {
  return new Date(dateString);
}