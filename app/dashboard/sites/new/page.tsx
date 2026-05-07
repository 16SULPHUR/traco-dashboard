"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import * as api from "@/lib/api";
import { Globe, ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewSitePage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    site: api.Site;
    apiKey: string;
  } | null>(null);
  const [copied, setCopied] = useState<"key" | "embed" | "">("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await getToken();
      const res = await api.createSite(token, { name, domain });
      setResult({ site: res.site, apiKey: res.apiKey });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create site");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, what: "key" | "embed") {
    navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(""), 2000);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.traco.dev";

  // Success state — show the API key and embed code
  if (result) {
    const embedCode = `<script defer src="${apiUrl}/api/script/${result.site.id}"></script>`;

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="card p-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--success-muted)" }}
          >
            <Sparkles className="w-8 h-8" style={{ color: "var(--success)" }} />
          </div>
          <h2 className="text-xl font-bold mb-1">Site Created!</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <strong>{result.site.name}</strong> ({result.site.domain}) is ready to track visitors.
          </p>

          {/* API Key */}
          <div className="text-left mb-4">
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--warning)" }}>
              ⚠️ Your API Key (save it now — shown only once)
            </label>
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
              <code className="text-sm font-mono flex-1 break-all" style={{ color: "var(--text-primary)" }}>
                {result.apiKey}
              </code>
              <button
                onClick={() => copyText(result.apiKey, "key")}
                className="p-1.5 rounded cursor-pointer hover:bg-white/10 flex-shrink-0"
              >
                {copied === "key" ? (
                  <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="text-left mb-6">
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              Embed this in your website&apos;s &lt;head&gt;
            </label>
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
              <code className="text-xs font-mono flex-1 break-all" style={{ color: "var(--accent)" }}>
                {embedCode}
              </code>
              <button
                onClick={() => copyText(embedCode, "embed")}
                className="p-1.5 rounded cursor-pointer hover:bg-white/10 flex-shrink-0"
              >
                {copied === "embed" ? (
                  <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer"
            style={{ background: "var(--accent)" }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <Link
        href="/dashboard/sites"
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sites
      </Link>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-muted)" }}
          >
            <Globe className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Add a New Site</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              You&apos;ll get a tracking script to embed on your website
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="site-name" className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}>
              Site Name
            </label>
            <input
              id="site-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Portfolio"
              required
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
            />
          </div>

          <div>
            <label htmlFor="site-domain" className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}>
              Domain
            </label>
            <input
              id="site-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Without https:// — e.g. mysite.com or blog.mysite.com
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "var(--danger-muted)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !domain.trim()}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ background: "var(--accent)" }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Site"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
