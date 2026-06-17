"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  BarChart3,
  LayoutDashboard,
  Globe,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sites", label: "My Sites", icon: Globe },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--border-subtle)",
              borderTopColor: "var(--accent)",
            }}
          />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30"
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <BarChart3 className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Traco</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "var(--accent-muted)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              {(user.email?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {user.user_metadata?.display_name || user.email?.split("@")[0]}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 glass"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Traco</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/sites/new"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-muted)" }}
          >
            <Plus className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </Link>
          <button
            onClick={signOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav Bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 flex items-center justify-around px-4 border-t glass safe-bottom"
        style={{
          borderTopColor: "var(--border-subtle)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-all"
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
