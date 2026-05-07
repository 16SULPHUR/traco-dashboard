"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Settings, User, Key } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your account settings
        </p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold">Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Name
            </label>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {user?.user_metadata?.display_name || "—"}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {user?.email || "—"}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Account Created
            </label>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold">Plan</h3>
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: "var(--accent-muted)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              Free Plan
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Up to 5 sites · 50K pageviews/day per site · AI insights
            </p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "var(--accent)", color: "white" }}
          >
            ACTIVE
          </span>
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold">About Traco</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Traco is a free, privacy-first analytics tool. No cookies, no invasive
          tracking — just clean insights about your website visitors. Built with
          Cloudflare Workers, Supabase, and Analytics Engine.
        </p>
      </div>
    </div>
  );
}
