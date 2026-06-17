"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import * as api from "@/lib/api";
import Link from "next/link";
import {
  Eye,
  Users,
  TrendingUp,
  Activity,
  Globe,
  MonitorSmartphone,
  FileText,
  Link2,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  Download,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="card p-3.5 md:p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <div
          className="w-8 h-8 md:w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-4 md:w-4.5 h-4 md:h-4.5" />
        </div>
        <span className="text-[10px] md:text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function RankList({
  title,
  icon: Icon,
  items,
  labelKey,
  valueKey,
  delay = 0,
  renderIcon,
}: {
  title: string;
  icon: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  labelKey: string;
  valueKey: string;
  delay?: number;
  renderIcon?: (item: any) => React.ReactNode;
}) {
  const maxVal = Math.max(...items.map((i) => Number(i[valueKey]) || 0), 1);

  return (
    <div className="card p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
          No data yet
        </p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1 items-center gap-2">
                <span
                  className="text-sm truncate max-w-[70%] flex items-center gap-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {renderIcon ? renderIcon(item) : null}
                  <span className="truncate">{String(item[labelKey]) || "—"}</span>
                </span>
                <span className="text-sm font-medium flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                  {Number(item[valueKey]).toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "var(--bg-surface)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(Number(item[valueKey]) / maxVal) * 100}%`,
                    background: "var(--accent)",
                    opacity: 1 - i * 0.15,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

const COUNTRY_MAP: Record<string, string> = {
  IN: "🇮🇳 India",
  US: "🇺🇸 United States",
  TW: "🇹🇼 Taiwan",
  GB: "🇬🇧 United Kingdom",
  DE: "🇩🇪 Germany",
  FR: "🇫🇷 France",
  JP: "🇯🇵 Japan",
  CA: "🇨🇦 Canada",
  AU: "🇦🇺 Australia",
  BR: "🇧🇷 Brazil",
  ES: "🇪🇸 Spain",
  IT: "🇮🇹 Italy",
  NL: "🇳🇱 Netherlands",
  SG: "🇸🇬 Singapore",
  CN: "🇨🇳 China",
  RU: "🇷🇺 Russia",
  KR: "🇰🇷 South Korea",
  UA: "🇺🇦 Ukraine",
  PL: "🇵🇱 Poland",
  TR: "🇹🇷 Turkey",
  VN: "🇻🇳 Vietnam",
  MX: "🇲🇽 Mexico",
  ID: "🇮🇩 Indonesia",
  SE: "🇸🇪 Sweden",
  NO: "🇳🇴 Norway",
  FI: "🇫🇮 Finland",
  DK: "🇩🇰 Denmark",
  CH: "🇨🇭 Switzerland",
  BE: "🇧🇪 Belgium",
  AT: "🇦🇹 Austria",
  IE: "🇮🇪 Ireland",
  NZ: "🇳🇿 New Zealand",
  ZA: "🇿🇦 South Africa",
  AE: "🇦🇪 United Arab Emirates",
  SA: "🇸🇦 Saudi Arabia",
  IL: "🇮🇱 Israel",
  MY: "🇲🇾 Malaysia",
  TH: "🇹🇭 Thailand",
  PH: "🇵🇭 Philippines",
};

function ReferrerLogo({ referrer }: { referrer: string }) {
  const refLower = referrer.toLowerCase();
  
  if (refLower.includes("linkedin")) {
    return (
      <svg className="w-4 h-4 text-[#0a66c2] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  }
  if (refLower.includes("github")) {
    return (
      <svg className="w-4 h-4 text-[#f0f6fc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    );
  }
  if (refLower.includes("twitter") || refLower.includes("x.com")) {
    return (
      <svg className="w-4 h-4 text-[#1d9bf0] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (refLower.includes("google")) {
    return (
      <svg className="w-4 h-4 text-[#ea4335] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.529-7.989 7.859-7.989 2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955.577 15.342 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.055 0 11.75-4.943 11.75-11.964 0-.807-.087-1.422-.192-2.231H12.24z"/>
      </svg>
    );
  }
  if (refLower.includes("reddit")) {
    return (
      <svg className="w-4 h-4 text-[#ff4500] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-5.99-1.72l1.24-3.91 4 1.15c.08.67.66 1.21 1.37 1.21 1.1 0 2-1.07 2-2 0-.93-.9-2-2-2-.76 0-1.38.49-1.62 1.22l-4.5-1.2c-.3-.1-.61.1-.69.41l-1.46 4.6C6.18 7.37 3.97 8 1.66 8.08c-.53-.73-1.4-1.18-2.34-1.18-1.65 0-3 1.35-3 3 0 1.1.6 2.05 1.48 2.58-.04.28-.06.56-.06.84 0 3.42 4.03 6.2 9 6.2s9-2.78 9-6.2c0-.28-.02-.56-.06-.84.88-.53 1.48-1.48 1.48-2.58zM4.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    );
  }
  if (referrer === "(direct)") return <ArrowRight className="w-4 h-4 text-[#6366f1] flex-shrink-0" />;
  
  let hostname = referrer;
  try {
    if (referrer.startsWith("http://") || referrer.startsWith("https://")) {
      hostname = new URL(referrer).hostname;
    }
  } catch {
    // ignore
  }

  if (hostname && hostname !== "(direct)") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://www.google.com/s2/favicons?sz=32&domain=${hostname}`}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    );
  }
  
  return <Globe className="w-4 h-4 text-zinc-500 flex-shrink-0" />;
}

function CountryBarChart({
  countries,
  delay = 0,
}: {
  countries: api.CountryData[];
  delay?: number;
}) {
  const data = countries.slice(0, 5).map(c => {
    const code = c.country.toUpperCase();
    const mapped = COUNTRY_MAP[code];
    return {
      name: mapped || code || "Unknown",
      views: c.views,
    };
  });

  return (
    <div className="card p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Countries
        </h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm py-12 text-center" style={{ color: "var(--text-muted)" }}>
          No data yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                return (
                  <div className="card p-2 px-3 text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.name}: <span style={{ color: "var(--accent)" }}>{Number(item.value).toLocaleString()} views</span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="views"
              fill="var(--accent)"
              radius={[0, 4, 4, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function DevicesDonut({
  devices,
  delay = 0,
}: {
  devices: api.DeviceEntry[];
  delay?: number;
}) {
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];
  
  const data = devices.map((d, index) => ({
    name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
    value: d.views,
    color: COLORS[index % COLORS.length],
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2 mb-4">
        <MonitorSmartphone className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Devices
        </h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm py-12 text-center" style={{ color: "var(--text-muted)" }}>
          No data yet
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0];
                    const percent = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="card p-2 px-3 text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                          {item.name}: <span style={{ color: item.payload.color }}>{Number(item.value).toLocaleString()} ({percent}%)</span>
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] text-[var(--text-muted)] font-medium leading-none">Total Views</span>
              <span className="text-base font-bold mt-1 leading-none text-[var(--text-primary)]">{total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-1.5">
            {data.map((item, i) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.value.toLocaleString()}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatLogDate(dateString: string) {
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  // Custom timezone offset formatting
  const offset = d.getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const offsetHours = Math.floor(absOffset / 60);
  const offsetMinutes = absOffset % 60;
  const offsetSign = offset <= 0 ? "+" : "-";
  const tzAbbr = offset === 0 ? "UTC" : `GMT${offsetSign}${offsetHours}:${offsetMinutes.toString().padStart(2, "0")}`;

  return {
    dateTime: `${day} ${month} ${hours}:${minutes} ${ampm}`,
    tzAbbr: ` ${tzAbbr}`,
  };
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [sites, setSites] = useState<api.Site[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string>("");
  const [overview, setOverview] = useState<api.OverviewData | null>(null);
  const [timeseries, setTimeseries] = useState<api.TimeseriesPoint[]>([]);
  const [pages, setPages] = useState<api.PageData[]>([]);
  const [referrers, setReferrers] = useState<api.ReferrerData[]>([]);
  const [countries, setCountries] = useState<api.CountryData[]>([]);
  const [devices, setDevices] = useState<api.DeviceEntry[]>([]);
  const [live, setLive] = useState<api.LiveData | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Timeframe and slice logic
  const [timeframe, setTimeframe] = useState<"7d" | "14d" | "30d" | "all">("30d");

  const filteredTimeseries = 
    timeframe === "7d" ? timeseries.slice(-7) :
    timeframe === "14d" ? timeseries.slice(-14) :
    timeframe === "30d" ? timeseries.slice(-30) :
    timeseries;

  // Visitor Logs States
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<api.LogEntry[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit] = useState(10);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsCountry, setLogsCountry] = useState("");
  const [logsDevice, setLogsDevice] = useState("");
  const [logsPath, setLogsPath] = useState("");
  const [logsLoading, setLogsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<api.LogEntry | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const loadSites = useCallback(async () => {
    setError("");
    try {
      const token = await getToken();
      const { sites: s } = await api.listSites(token);
      setSites(s);
      if (s.length > 0) {
        if (!activeSiteId) {
          setActiveSiteId(s[0]!.id);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to load sites:", e);
      setError("Failed to load sites. Please ensure the backend server is running and reachable.");
      setLoading(false);
    }
  }, [getToken, activeSiteId]);

  const loadDashboard = useCallback(async () => {
    if (!activeSiteId) return;
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const [ov, ts, pg, ref, geo, dev, lv] = await Promise.all([
        api.getOverview(token, activeSiteId),
        api.getTimeseries(token, activeSiteId),
        api.getTopPages(token, activeSiteId),
        api.getTopReferrers(token, activeSiteId),
        api.getGeo(token, activeSiteId),
        api.getDevices(token, activeSiteId),
        api.getLive(token, activeSiteId),
      ]);
      setOverview(ov.overview);
      setTimeseries(ts.timeseries);
      setPages(pg.pages);
      setReferrers(ref.referrers);
      setCountries(geo.countries);
      setDevices(dev.devices);
      setLive(lv.live);
    } catch (e) {
      console.error("Dashboard load failed:", e);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [activeSiteId, getToken]);

  const loadInsight = useCallback(async () => {
    if (!activeSiteId) return;
    setInsightLoading(true);
    setError("");
    try {
      const token = await getToken();
      const { insight: i } = await api.getInsights(token, activeSiteId);
      setInsight(i);
    } catch (e) {
      console.error("Insight load failed:", e);
      setError("Insight load failed. Please try again later.");
    } finally {
      setInsightLoading(false);
    }
  }, [activeSiteId, getToken]);

  const loadLogs = useCallback(async () => {
    if (!activeSiteId || !showLogs) return;
    setLogsLoading(true);
    try {
      const token = await getToken();
      const res = await api.getLogs(token, activeSiteId, {
        page: logsPage,
        limit: logsLimit,
        search: logsSearch,
        country: logsCountry,
        device: logsDevice,
        path: logsPath,
      });
      setLogs(res.logs);
      setLogsTotal(res.pagination.total);
    } catch (e) {
      console.error("Failed to load logs:", e);
    } finally {
      setLogsLoading(false);
    }
  }, [activeSiteId, showLogs, logsPage, logsLimit, logsSearch, logsCountry, logsDevice, logsPath, getToken]);

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      "ID",
      "Date/Time",
      "IP Address",
      "Country",
      "City",
      "Region",
      "Timezone",
      "Path",
      "Referrer",
      "UTM Source",
      "Device Type",
      "Browser",
      "OS",
      "Screen Resolution",
      "User Agent",
    ];
    
    const rows = logs.map((log) => [
      log.id,
      new Date(log.created_at).toLocaleString(),
      log.ip_address,
      log.country,
      log.city,
      log.region,
      log.timezone,
      log.path,
      log.referrer,
      log.utm_source || "",
      log.device_type,
      log.browser,
      log.os,
      `${log.screen_w}x${log.screen_h}`,
      `"${log.user_agent.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visitor_logs_${activeSiteId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => { loadSites(); }, [loadSites]);
  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Reset page when queries change
  useEffect(() => {
    setLogsPage(1);
  }, [logsSearch, logsCountry, logsDevice, logsPath]);

  // Refresh live count every 30s
  useEffect(() => {
    if (!activeSiteId) return;
    const interval = setInterval(async () => {
      try {
        const token = await getToken();
        const { live: lv } = await api.getLive(token, activeSiteId);
        setLive(lv);
      } catch { /* silent */ }
    }, 30_000);
    return () => clearInterval(interval);
  }, [activeSiteId, getToken]);

  // No sites — onboarding
  if (!loading && sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: "var(--accent-muted)" }}
        >
          <Globe className="w-10 h-10" style={{ color: "var(--accent)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Add your first site</h2>
        <p className="text-sm mb-8 text-center max-w-md" style={{ color: "var(--text-muted)" }}>
          Create a site to get your tracking script. Embed it on your website and start seeing visitor analytics in real-time.
        </p>
        <Link
          href="/dashboard/sites/new"
          className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "var(--accent)" }}
        >
          <Plus className="w-4 h-4" />
          Add Site
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Your analytics at a glance
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Logs toggle button */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: showLogs ? "var(--accent)" : "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: showLogs ? "#fff" : "var(--text-primary)",
            }}
          >
            <Activity className="w-4 h-4" />
            {showLogs ? "Hide Visitor Logs" : "View Visitor Logs"}
          </button>

          {/* Site picker */}
          {sites.length > 1 && (
          <select
            value={activeSiteId}
            onChange={(e) => setActiveSiteId(e.target.value)}
            className="h-10 px-4 rounded-xl text-sm font-medium outline-none cursor-pointer"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.domain}
              </option>
            ))}
          </select>
        )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm animate-fade-in" style={{ background: "var(--danger-muted)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-20 md:h-28 rounded-xl md:rounded-2xl" />
          ))}
          <div className="col-span-full skeleton h-56 md:h-72 rounded-xl md:rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={Eye}
              label="Total Views"
              value={overview?.totalViews ?? 0}
              color="#6366f1"
              delay={0}
            />
            <StatCard
              icon={Users}
              label="Unique Visitors"
              value={overview?.uniqueVisitors ?? 0}
              color="#22c55e"
              delay={50}
            />
            <StatCard
              icon={Activity}
              label="Live Now"
              value={live?.activeVisitors ?? 0}
              color="#10b981"
              delay={100}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Views/Day"
              value={
                timeseries.length > 0
                  ? Math.round(
                      timeseries.reduce((s, p) => s + p.views, 0) / timeseries.length,
                    )
                  : 0
              }
              color="#f59e0b"
              delay={150}
            />
          </div>

          {/* Visitor Log Records */}
          {showLogs && (
            <div className="card p-4 md:p-5 animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Visitor Log Records
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                    {logsTotal} records
                  </span>
                </div>
                <button
                  onClick={() => setShowLogs(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-secondary)] cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-2 md:flex md:flex-row md:items-center gap-2 md:gap-3">
                {/* Search */}
                <div className="relative col-span-2 md:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search city, country, page, referrer..."
                    value={logsSearch}
                    onChange={(e) => setLogsSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl text-xs font-medium outline-none transition-all"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Country Filter */}
                <select
                  value={logsCountry}
                  onChange={(e) => setLogsCountry(e.target.value)}
                  className="col-span-1 h-10 px-2 md:px-3.5 rounded-xl text-xs font-semibold outline-none cursor-pointer"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Device Filter */}
                <select
                  value={logsDevice}
                  onChange={(e) => setLogsDevice(e.target.value)}
                  className="col-span-1 h-10 px-2 md:px-3.5 rounded-xl text-xs font-semibold outline-none cursor-pointer"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>

                {/* Page Filter */}
                <select
                  value={logsPath}
                  onChange={(e) => setLogsPath(e.target.value)}
                  className="col-span-1 h-10 px-2 md:px-3.5 rounded-xl text-xs font-semibold outline-none cursor-pointer md:max-w-[150px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Pages</option>
                  {pages.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.path}
                    </option>
                  ))}
                </select>

                {/* CSV Export */}
                <button
                  onClick={exportToCSV}
                  disabled={logs.length === 0}
                  className="col-span-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
                      <th className="p-3 font-semibold w-10">#</th>
                      <th className="p-3 font-semibold">DATE / TIME</th>
                      <th className="p-3 font-semibold">LOCATION</th>
                      <th className="p-3 font-semibold">PAGE</th>
                      <th className="hidden sm:table-cell p-3 font-semibold">SOURCE</th>
                      <th className="hidden md:table-cell p-3 font-semibold">REFERRER</th>
                      <th className="hidden lg:table-cell p-3 font-semibold">SCREEN</th>
                      <th className="hidden lg:table-cell p-3 font-semibold">TIMEZONE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {logsLoading ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[var(--accent)] animate-spin" />
                            Loading visitor logs...
                          </div>
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
                          No visitor logs match your search.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log, index) => {
                        const rowNum = (logsPage - 1) * logsLimit + index + 1;
                        const deviceIcon = log.device_type === "mobile" ? "📱" : log.device_type === "tablet" ? "📟" : "💻";
                        const dateFormatted = formatLogDate(log.created_at);
                        
                        return (
                          <tr
                            key={log.id}
                            onClick={() => {
                              setSelectedLog(log);
                              setShowRawJson(false);
                            }}
                            className="hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <td className="p-3 font-medium text-[var(--text-muted)]">{rowNum}</td>
                            <td className="p-3 whitespace-nowrap">
                              {dateFormatted.dateTime}
                              <span className="hidden lg:inline text-[var(--text-muted)] ml-1">{dateFormatted.tzAbbr}</span>
                            </td>
                            <td className="p-3 font-semibold text-[var(--text-primary)]">
                              {log.city !== "Unknown" ? `${log.city}, ` : ""}{log.country}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                                {log.path}
                              </span>
                            </td>
                            <td className="hidden sm:table-cell p-3">
                              {log.utm_source ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "var(--success-muted)", color: "var(--success)" }}>
                                  {log.utm_source}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="hidden md:table-cell p-3 truncate max-w-[140px]" title={log.referrer}>
                              {log.referrer === "" || log.referrer === "direct" || log.referrer.toLowerCase() === "(direct)" ? (
                                <span style={{ color: "var(--text-muted)" }}>Direct</span>
                              ) : (
                                log.referrer
                              )}
                            </td>
                            <td className="hidden lg:table-cell p-3 whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <span>{deviceIcon}</span>
                                <span>{log.screen_w}x{log.screen_h}</span>
                              </span>
                            </td>
                            <td className="hidden lg:table-cell p-3 whitespace-nowrap">{log.timezone}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {logsTotal > logsLimit && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Showing {Math.min(logsTotal, (logsPage - 1) * logsLimit + 1)}-{Math.min(logsTotal, logsPage * logsLimit)} of {logsTotal}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLogsPage(1)}
                      disabled={logsPage === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[var(--bg-secondary)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer text-xs"
                    >
                      «
                    </button>
                    <button
                      onClick={() => setLogsPage(prev => Math.max(1, prev - 1))}
                      disabled={logsPage === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[var(--bg-secondary)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer text-xs"
                    >
                      ‹
                    </button>
                    <span className="h-8 px-3 rounded-lg flex items-center justify-center text-xs font-bold bg-[var(--accent)] text-white">
                      {logsPage}
                    </span>
                    <button
                      onClick={() => setLogsPage(prev => Math.min(Math.ceil(logsTotal / logsLimit), prev + 1))}
                      disabled={logsPage >= Math.ceil(logsTotal / logsLimit)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[var(--bg-secondary)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer text-xs"
                    >
                      ›
                    </button>
                    <button
                      onClick={() => setLogsPage(Math.ceil(logsTotal / logsLimit))}
                      disabled={logsPage >= Math.ceil(logsTotal / logsLimit)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[var(--bg-secondary)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer text-xs"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chart */}
          <div className="card p-4 md:p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Traffic — {timeframe === "all" ? "All Time" : `Last ${timeframe.slice(0, -1)} Days`}
              </h3>
              
              {/* Timeframe pill selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit">
                {(["7d", "14d", "30d", "all"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className="text-[10px] md:text-xs font-semibold px-2 md:px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    style={{
                      background: timeframe === t ? "var(--accent)" : "transparent",
                      color: timeframe === t ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {timeseries.length === 0 ? (
              <p className="text-sm py-16 text-center" style={{ color: "var(--text-muted)" }}>
                No data yet. Pageviews will appear here once visitors arrive.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={filteredTimeseries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => d.slice(5)}
                    stroke="var(--text-muted)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Views"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#viewsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#visitorsGrad)"
                  />
                  <Brush
                    dataKey="date"
                    height={20}
                    stroke="var(--border-default)"
                    fill="var(--bg-secondary)"
                    tickFormatter={(d: string) => d ? d.slice(5) : ""}
                    travellerWidth={6}
                    className="recharts-brush"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Rank lists & visual charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RankList
              title="Top Pages"
              icon={FileText}
              items={pages}
              labelKey="path"
              valueKey="views"
              delay={300}
              renderIcon={() => <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
            />
            <RankList
              title="Top Referrers"
              icon={Link2}
              items={referrers}
              labelKey="referrer"
              valueKey="views"
              delay={350}
              renderIcon={(item) => <ReferrerLogo referrer={item.referrer} />}
            />
            <CountryBarChart
              countries={countries}
              delay={400}
            />
            <DevicesDonut
              devices={devices}
              delay={450}
            />
          </div>

          {/* AI Insights */}
          <div className="card p-4 md:p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <h3 className="text-sm font-semibold">AI Insights</h3>
              </div>
              <button
                onClick={loadInsight}
                disabled={insightLoading}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
              >
                {insightLoading ? "Analyzing..." : "Generate"}
              </button>
            </div>
            {insight ? (
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {insight}
              </p>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Click &quot;Generate&quot; for an AI-powered summary of your traffic trends.
              </p>
            )}
          </div>

          {/* Visitor Details Profile Modal */}
          {selectedLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                onClick={() => setSelectedLog(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
              />
              
              {/* Modal Box */}
              <div className="card w-full max-w-2xl relative z-10 overflow-y-auto max-h-[90vh] animate-fade-in flex flex-col" style={{ background: "var(--bg-card)" }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      Visitor Details Profile
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-secondary)] cursor-pointer"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
                  {/* Location Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      Location Information
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Country</span>
                        <span className="text-base font-bold mt-1 block text-[var(--text-primary)]">
                          {selectedLog.country}
                        </span>
                      </div>
                      <div className="bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">City</span>
                        <span className="text-base font-bold mt-1 block text-[var(--text-primary)]">
                          {selectedLog.city}
                        </span>
                      </div>
                      <div className="bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Region</span>
                        <span className="text-base font-bold mt-1 block text-[var(--text-primary)]">
                          {selectedLog.region}
                        </span>
                      </div>
                      <div className="bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Timezone</span>
                        <span className="text-base font-bold mt-1 block text-[var(--text-primary)]">
                          {selectedLog.timezone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traffic Source & Destination */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                      <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                      Traffic Source & Destination
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Page Visited</span>
                          <span className="inline-block px-2.5 py-0.5 rounded font-mono text-xs mt-1" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                            {selectedLog.path}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Referrer</span>
                          <span className="text-sm font-semibold block mt-1 truncate text-[var(--text-primary)]" title={selectedLog.referrer}>
                            {selectedLog.referrer || "(direct)"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">UTM Source</span>
                          <span className="text-sm font-semibold block mt-1 text-[var(--text-primary)]">
                            {selectedLog.utm_source || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Date & Time</span>
                          <span className="text-sm font-semibold block mt-1 text-[var(--text-primary)]">
                            {(() => {
                              const formatted = formatLogDate(selectedLog.created_at);
                              return `${formatted.dateTime}${formatted.tzAbbr}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Technical Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                      <MonitorSmartphone className="w-3.5 h-3.5 text-indigo-400" />
                      Client Technical Metadata
                    </div>
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Screen Resolution</span>
                          <span className="text-sm font-semibold block mt-1 text-[var(--text-primary)]">
                            {selectedLog.screen_w} x {selectedLog.screen_h}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">IP Address</span>
                          <span className="text-sm font-semibold block mt-1 text-[var(--text-primary)] font-mono break-all">
                            {selectedLog.ip_address}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">User Agent</span>
                        <span className="text-xs font-medium block mt-1 leading-relaxed text-[var(--text-secondary)] font-mono">
                          {selectedLog.user_agent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON viewer */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all bg-[var(--bg-secondary)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    >
                      {showRawJson ? "Hide Raw JSON" : "Show Raw JSON"}
                    </button>
                    {showRawJson && (
                      <pre className="mt-4 p-3.5 rounded-xl overflow-x-auto text-[10px] text-left leading-relaxed font-mono" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                        {JSON.stringify(selectedLog, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
