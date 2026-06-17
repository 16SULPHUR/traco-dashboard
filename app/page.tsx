"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { BarChart3, ArrowRight, Eye, Shield, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Invalid or expired code");
      }

      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #09090b 0%, #1a1a2e 50%, #16213e 100%)" }}>
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #22c55e, transparent)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Traco
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Privacy-first analytics
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            Know your audience.
            <br />
            <span style={{ color: "var(--accent)" }}>Respect their privacy.</span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: Eye, label: "Real-time visitor tracking" },
              { icon: Shield, label: "No cookies, no invasive tracking" },
              { icon: Sparkles, label: "AI-powered insights" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--accent-muted)" }}>
                  <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "var(--text-muted)" }}>
          Free forever. No credit card required.
        </p>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#09090b" }}>
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">Traco</span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {step === "email" ? "Sign in or register" : "Verify your email"}
          </h1>
          <p className="text-sm mb-8 flex flex-wrap items-center gap-1" style={{ color: "var(--text-muted)" }}>
            {step === "email" ? (
              "Enter your email to receive a secure, passwordless verification code."
            ) : (
              <>
                Sent to <strong>{email}</strong>
                <button
                  onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                  className="font-semibold cursor-pointer underline text-xs ml-1"
                  style={{ color: "var(--accent)" }}
                >
                  Change email
                </button>
              </>
            )}
          </p>

          <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            {step === "email" ? (
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
            ) : (
              <div>
                <label htmlFor="otp" className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  6-Digit Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  pattern="\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  className="w-full h-11 px-4 rounded-xl text-center text-lg font-bold outline-none transition-all focus:ring-2 font-mono"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--accent)",
                    letterSpacing: "8px",
                  } as React.CSSProperties}
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: "var(--danger-muted)", color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === "email" ? "Send Verification Code" : "Verify & Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
