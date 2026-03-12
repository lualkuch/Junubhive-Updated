import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-[var(--bg)]">
            {/* Logo */}
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                    background: "linear-gradient(135deg, #ff3621, #ff6b47)",
                    boxShadow: "0 8px 32px rgba(255, 54, 33, 0.35)",
                }}
            >
                <Heart className="w-8 h-8 text-white fill-white" />
            </div>

            <p
                className="text-6xl font-medium mb-3 gradient-text"
                style={{ fontFamily: "var(--font-display)" }}
            >
                404
            </p>
            <h1
                className="text-xl font-medium text-center mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
                Page not found
            </h1>
            <p
                className="text-sm text-center mb-8 max-w-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
            >
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <Link
                href="/discover"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-medium btn-haptic"
                style={{
                    background: "linear-gradient(135deg, #ff3621, #ff5c47)",
                    boxShadow: "0 6px 24px rgba(255, 54, 33, 0.3)",
                }}
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Discover
            </Link>
        </div>
    );
}
