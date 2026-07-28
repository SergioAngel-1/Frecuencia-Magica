export type DateOption = {
  iso: string;
  dow: string;
  day: string;
  month: string;
};

export const AVAILABLE_TIMES = ['09:00', '12:00', '17:00', '20:00'] as const;

export function upcomingDates(from: Date, count: number, locale = 'es'): DateOption[] {
  const result: DateOption[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i + 1);

    result.push({
      iso: d.toISOString().slice(0, 10),
      dow: d.toLocaleDateString(locale, { weekday: 'short' }),
      day: String(d.getDate()),
      month: d.toLocaleDateString(locale, { month: 'short' }),
    });
  }

  return result;
}
