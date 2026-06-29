export function nowIso(): string {
  return new Date().toISOString();
}

export function toIsoDate(value: Date | string): string {
  return new Date(value).toISOString();
}
