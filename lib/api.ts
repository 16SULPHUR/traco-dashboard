/**
 * Traco API client — wraps fetch calls to the Cloudflare Worker backend.
 * All dashboard endpoints require a Supabase JWT in the Authorization header.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

async function apiFetch<T = unknown>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (body as { error?: string }).error || `API error: ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

// ── Sites ──

export interface Site {
  id: string;
  name: string;
  domain: string;
  api_key_prefix: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function createSite(
  token: string,
  data: { name: string; domain: string },
) {
  return apiFetch<{ success: boolean; site: Site; apiKey: string }>(
    "/api/sites",
    token,
    { method: "POST", body: JSON.stringify(data) },
  );
}

export async function listSites(token: string) {
  return apiFetch<{ success: boolean; sites: Site[] }>("/api/sites", token);
}

export async function deleteSite(token: string, siteId: string) {
  return apiFetch(`/api/sites/${siteId}`, token, { method: "DELETE" });
}

export async function rotateKey(token: string, siteId: string) {
  return apiFetch<{ success: boolean; apiKey: string; apiKeyPrefix: string }>(
    `/api/sites/${siteId}/rotate-key`,
    token,
    { method: "POST" },
  );
}

// ── Dashboard ──

export interface OverviewData {
  totalViews: number;
  uniqueVisitors: number;
  from: string;
  to: string;
}

export interface TimeseriesPoint {
  date: string;
  views: number;
  visitors: number;
}

export interface PageData {
  path: string;
  views: number;
  visitors: number;
}

export interface ReferrerData {
  referrer: string;
  views: number;
  visitors: number;
}

export interface CountryData {
  country: string;
  views: number;
  visitors: number;
}

export interface CityData {
  country: string;
  city: string;
  views: number;
}

export interface DeviceEntry {
  name: string;
  views: number;
}

export interface LiveData {
  activeVisitors: number;
  recentPageviews: number;
  windowMinutes: number;
}

export async function getOverview(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{ success: boolean; overview: OverviewData }>(
    `/api/dashboard/${siteId}/overview?${params}`,
    token,
  );
}

export async function getTimeseries(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{ success: boolean; timeseries: TimeseriesPoint[] }>(
    `/api/dashboard/${siteId}/timeseries?${params}`,
    token,
  );
}

export async function getTopPages(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{ success: boolean; pages: PageData[] }>(
    `/api/dashboard/${siteId}/pages?${params}`,
    token,
  );
}

export async function getTopReferrers(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{ success: boolean; referrers: ReferrerData[] }>(
    `/api/dashboard/${siteId}/referrers?${params}`,
    token,
  );
}

export async function getGeo(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{ success: boolean; countries: CountryData[]; cities: CityData[] }>(
    `/api/dashboard/${siteId}/geo?${params}`,
    token,
  );
}

export async function getDevices(token: string, siteId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<{
    success: boolean;
    devices: DeviceEntry[];
    browsers: DeviceEntry[];
    operatingSystems: DeviceEntry[];
  }>(`/api/dashboard/${siteId}/devices?${params}`, token);
}

export async function getLive(token: string, siteId: string) {
  return apiFetch<{ success: boolean; live: LiveData }>(
    `/api/dashboard/${siteId}/live`,
    token,
  );
}

export async function getInsights(token: string, siteId: string) {
  return apiFetch<{ success: boolean; insight: string }>(
    `/api/dashboard/${siteId}/insights`,
    token,
  );
}
