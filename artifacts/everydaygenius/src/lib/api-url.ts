const RAW_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "";

export function apiUrl(path: string): string {
  return `${RAW_BASE}${path}`;
}

export function apiBaseUrl(): string {
  return RAW_BASE;
}
