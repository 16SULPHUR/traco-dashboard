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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <div className="card p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
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
}: {
  title: string;
  icon: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  labelKey: string;
  valueKey: string;
  delay?: number;
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
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm truncate max-w-[70%]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {String(item[labelKey]) || "—"}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
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

  const loadSites = useCallback(async () => {
    try {
      const token = await getToken();
      const { sites: s } = await api.listSites(token);
      setSites(s);
      if (s.length > 0 && !activeSiteId) {
        setActiveSiteId(s[0]!.id);
      }
    } catch (e) {
      console.error("Failed to load sites:", e);
    }
  }, [getToken, activeSiteId]);

  const loadDashboard = useCallback(async () => {
    if (!activeSiteId) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [activeSiteId, getToken]);

  const loadInsight = useCallback(async () => {
    if (!activeSiteId) return;
    setInsightLoading(true);
    try {
      const token = await getToken();
      const { insight: i } = await api.getInsights(token, activeSiteId);
      setInsight(i);
    } catch (e) {
      console.error("Insight load failed:", e);
    } finally {
      setInsightLoading(false);
    }
  }, [activeSiteId, getToken]);

  useEffect(() => { loadSites(); }, [loadSites]);
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Your analytics at a glance
          </p>
        </div>

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
          <div className="col-span-full skeleton h-72 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Chart */}
          <div className="card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Traffic — Last 30 Days
            </h3>
            {timeseries.length === 0 ? (
              <p className="text-sm py-16 text-center" style={{ color: "var(--text-muted)" }}>
                No data yet. Pageviews will appear here once visitors arrive.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timeseries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Rank lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RankList
              title="Top Pages"
              icon={FileText}
              items={pages}
              labelKey="path"
              valueKey="views"
              delay={300}
            />
            <RankList
              title="Top Referrers"
              icon={Link2}
              items={referrers}
              labelKey="referrer"
              valueKey="views"
              delay={350}
            />
            <RankList
              title="Countries"
              icon={Globe}
              items={countries}
              labelKey="country"
              valueKey="views"
              delay={400}
            />
            <RankList
              title="Devices"
              icon={MonitorSmartphone}
              items={devices}
              labelKey="name"
              valueKey="views"
              delay={450}
            />
          </div>

          {/* AI Insights */}
          <div className="card p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
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
        </>
      )}
    </div>
  );
}
