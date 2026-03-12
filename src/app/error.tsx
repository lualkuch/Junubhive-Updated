"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-[var(--bg)]">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "rgba(255, 54, 33, 0.1)",
          border: "1px solid rgba(255, 54, 33, 0.2)",
        }}
      >
        <AlertTriangle className="w-8 h-8" style={{ color: "var(--brand)" }} />
      </div>

      <h1
        className="text-2xl font-medium text-center mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Something went wrong
      </h1>
      <p
        className="text-sm text-center mb-8 max-w-xs leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        We hit an unexpected error. Please try again or contact support if this keeps happening.
      </p>

      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-medium btn-haptic"
        style={{
          background: "linear-gradient(135deg, #ff3621, #ff5c47)",
          boxShadow: "0 6px 24px rgba(255, 54, 33, 0.3)",
        }}
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
