const DAY = 24 * 60 * 60 * 1000;

export const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

/** Data local de hoje no formato YYYY-MM-DD. */
export function today(): string {
  const now = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
}

export function weekday(date: string): Weekday {
  return WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}

export function formatBR(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function parseWeekdays(value: string): Weekday[] {
  const days = value.split(",").map((day) => day.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""));
  const invalid = days.filter((day) => !WEEKDAYS.includes(day as Weekday));
  if (invalid.length > 0 || days.length === 0) {
    throw new Error(`dias inválidos: ${invalid.join(", ")}. Use ${WEEKDAYS.join(",")}`);
  }
  return WEEKDAYS.filter((day) => days.includes(day));
}
