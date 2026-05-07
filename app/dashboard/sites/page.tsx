"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import * as api from "@/lib/api";
import Link from "next/link";
import {
  Globe,
  Plus,
  Trash2,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  Key,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function SitesPage() {
  const { getToken } = useAuth();
  const [sites, setSites] = useState<api.Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string>("");
  const [rotatingId, setRotatingId] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string>("");
  const [newKey, setNewKey] = useState<{ siteId: string; key: string } | null>(null);
  const [expandedProxy, setExpandedProxy] = useState<string>("");

  const loadSites = useCallback(async () => {
    try {
      const token = await getToken();
      const { sites: s } = await api.listSites(token);
      setSites(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadSites(); }, [loadSites]);

  async function handleDelete(siteId: string) {
    if (!confirm("Delete this site? All analytics data will be lost.")) return;
    setDeletingId(siteId);
    try {
      const token = await getToken();
      await api.deleteSite(token, siteId);
      setSites((s) => s.filter((site) => site.id !== siteId));
    } catch (e) {
      alert("Failed to delete site");
    } finally {
      setDeletingId("");
    }
  }

  async function handleRotateKey(siteId: string) {
    if (!confirm("Rotate API key? The old key will stop working immediately.")) return;
    setRotatingId(siteId);
    try {
      const token = await getToken();
      const result = await api.rotateKey(token, siteId);
      setNewKey({ siteId, key: result.apiKey });
      setSites((s) =>
        s.map((site) =>
          site.id === siteId
            ? { ...site, api_key_prefix: result.apiKeyPrefix }
            : site,
        ),
      );
    } catch (e) {
      alert("Failed to rotate key");
    } finally {
      setRotatingId("");
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  }

  function getEmbedCode(siteId: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.traco.dev";
    return `<script defer src="${apiUrl}/api/script/${siteId}"></script>`;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-48 rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Sites</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Manage your tracked websites
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "var(--accent)" }}
        >
          <Plus className="w-4 h-4" />
          Add Site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="card p-12 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No sites yet. Add your first site to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--accent-muted)" }}
                  >
                    <Globe className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {site.name}
                    </h3>
                    <p className="text-sm flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      {site.domain}
                      <ExternalLink className="w-3 h-3" />
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Key className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      <code className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {site.api_key_prefix}...
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyToClipboard(getEmbedCode(site.id), site.id)}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                      background: copiedId === site.id ? "var(--success-muted)" : "var(--bg-surface)",
                      color: copiedId === site.id ? "var(--success)" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {copiedId === site.id ? (
                      <><Check className="w-3.5 h-3.5" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Embed Code</>
                    )}
                  </button>
                  <button
                    onClick={() => handleRotateKey(site.id)}
                    disabled={rotatingId === site.id}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                    style={{
                      background: "var(--warning-muted)",
                      color: "var(--warning)",
                    }}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${rotatingId === site.id ? "animate-spin" : ""}`} />
                    Rotate Key
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    disabled={deletingId === site.id}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                    style={{
                      background: "var(--danger-muted)",
                      color: "var(--danger)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Embed code preview */}
              <div className="mt-4 p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  Embed this in your website&apos;s &lt;head&gt;:
                </p>
                <code className="text-xs font-mono break-all" style={{ color: "var(--accent)" }}>
                  {getEmbedCode(site.id)}
                </code>
              </div>

              {/* Proxy setup guide */}
              <button
                onClick={() => setExpandedProxy(expandedProxy === site.id ? "" : site.id)}
                className="mt-3 flex items-center gap-2 text-xs font-medium cursor-pointer transition-colors"
                style={{ color: "var(--accent)" }}
              >
                <Shield className="w-3.5 h-3.5" />
                Bypass ad blockers (first-party proxy setup)
                {expandedProxy === site.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {expandedProxy === site.id && (
                <div className="mt-2 space-y-3 animate-fade-in">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Proxy Traco through your own domain so tracking requests appear first-party.
                    Ad blockers (Brave, uBlock) can&apos;t block same-origin requests.
                  </p>

                  {/* Proxied embed code */}
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                      1. Use this embed instead:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono flex-1 break-all" style={{ color: "var(--success)" }}>
                        {`<script defer src="/traco/script/${site.id}"></script>`}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`<script defer src="/traco/script/${site.id}"></script>`, `proxy-${site.id}`)}
                        className="p-1.5 rounded cursor-pointer hover:bg-white/10 flex-shrink-0"
                      >
                        {copiedId === `proxy-${site.id}` ? (
                          <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
                        ) : (
                          <Copy className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Vercel / Next.js */}
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                      2a. Vercel / Next.js — add to next.config.ts:
                    </p>
                    <code className="text-xs font-mono break-all block whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
{`async rewrites() {
  return [{
    source: "/traco/:path*",
    destination: "${process.env.NEXT_PUBLIC_API_URL || "https://tracoapi.ankitpatil.tech"}/api/:path*"
  }];
}`}
                    </code>
                  </div>

                  {/* Nginx */}
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                      2b. Nginx:
                    </p>
                    <code className="text-xs font-mono break-all block whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
{`location /traco/ {
    proxy_pass ${process.env.NEXT_PUBLIC_API_URL || "https://tracoapi.ankitpatil.tech"}/api/;
    proxy_set_header X-Forwarded-For $remote_addr;
}`}
                    </code>
                  </div>

                  {/* Cloudflare Pages */}
                  <div className="p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                      2c. Cloudflare Pages — add to _redirects:
                    </p>
                    <code className="text-xs font-mono break-all block" style={{ color: "var(--text-muted)" }}>
                      {`/traco/* ${process.env.NEXT_PUBLIC_API_URL || "https://tracoapi.ankitpatil.tech"}/api/:splat 200`}
                    </code>
                  </div>
                </div>
              )}

              {/* Rotated key display */}
              {newKey?.siteId === site.id && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--warning-muted)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--warning)" }}>
                    ⚠️ New API Key (save it now — it won&apos;t be shown again):
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono flex-1 break-all" style={{ color: "var(--text-primary)" }}>
                      {newKey.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newKey.key, "newkey")}
                      className="p-1.5 rounded cursor-pointer hover:bg-white/10"
                    >
                      {copiedId === "newkey" ? (
                        <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
