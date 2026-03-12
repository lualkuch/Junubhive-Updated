"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccess("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/discover";
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-[var(--bg)]">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
          transform: "translate(-50%, -30%)",
        }}
      />
      <div className="absolute top-[15%] right-[-60px] w-32 h-32 rounded-full opacity-[0.08] bg-brand-500 blur-3xl" />
      <div className="absolute top-[30%] left-[-40px] w-24 h-24 rounded-full opacity-[0.06] bg-brand-400 blur-2xl" />

      {/* Logo */}
      <div className="relative z-10 flex justify-center pt-16 pb-4">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ff3621, #ff6b47)",
              boxShadow: "0 8px 32px rgba(255, 54, 33, 0.35)",
            }}
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="text-center">
            <h1
              className="text-3xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              JunubHive
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Find your perfect match
            </p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-8 px-6">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Tab Switch */}
          <div
            className="flex rounded-2xl p-1 mb-6"
            style={{ background: "var(--bg)" }}
          >
            {(["signin", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  setError(null);
                  setSuccess(null);
                }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  mode === tab
                    ? "text-white shadow-sm"
                    : "hover:opacity-70"
                )}
                style={
                  mode === tab
                    ? {
                        background: "linear-gradient(135deg, #ff3621, #ff5c47)",
                        color: "white",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                {tab === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand)";
                  e.target.style.boxShadow = "0 0 0 3px var(--brand-light)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand)";
                  e.target.style.boxShadow = "0 0 0 3px var(--brand-light)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm bg-red-50 text-red-600 border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl px-4 py-3 text-sm bg-green-50 text-green-700 border border-green-100">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-medium transition-all btn-haptic disabled:opacity-60 mt-1"
              style={{
                background: "linear-gradient(135deg, #ff3621, #ff5c47)",
                boxShadow: "0 6px 24px rgba(255, 54, 33, 0.35)",
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "signin" ? "Continue" : "Create Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p
            className="text-center text-xs mt-5 leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            By continuing you agree to our{" "}
            <span
              className="underline underline-offset-2 cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
            >
              Terms
            </span>{" "}
            and{" "}
            <span
              className="underline underline-offset-2 cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
            >
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
