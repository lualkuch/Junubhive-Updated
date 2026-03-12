"use client";

import { useState } from "react";
import { X, Heart, Star, SlidersHorizontal } from "lucide-react";
import SwipeCard from "@/components/cards/SwipeCard";
import BottomNav from "@/components/ui/BottomNav";
import { mockProfiles } from "@/lib/mock-data";
import { Profile } from "@/types";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [lastAction, setLastAction] = useState<"like" | "pass" | "super" | null>(null);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);

  function handleSwipeLeft() {
    setLastAction("pass");
    setProfiles((p) => p.slice(1));
  }

  function handleSwipeRight() {
    const current = profiles[0];
    setLastAction("like");
    setProfiles((p) => p.slice(1));
    // Simulate 30% match rate
    if (Math.random() > 0.7) {
      setTimeout(() => setShowMatch(current), 400);
    }
  }

  function handleSuperLike() {
    setLastAction("super");
    setProfiles((p) => p.slice(1));
  }

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: "var(--bg)", paddingBottom: "var(--nav-height)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Discover
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {profiles.length > 0
              ? `${profiles.length} people nearby`
              : "Check back soon"}
          </p>
        </div>
        <button
          className="w-10 h-10 rounded-2xl flex items-center justify-center press-effect"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <SlidersHorizontal className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* Card Stack */}
      <div className="flex-1 relative px-4 pb-4" style={{ minHeight: "460px" }}>
        {profiles.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <Heart
                className="w-9 h-9"
                style={{ color: "var(--brand)" }}
              />
            </div>
            <div className="text-center">
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                You&apos;ve seen everyone!
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Check back later for new profiles
              </p>
            </div>
          </div>
        ) : (
          profiles
            .slice(0, 3)
            .reverse()
            .map((profile, idx) => {
              const reverseIdx = Math.min(profiles.slice(0, 3).length - 1 - idx, 2);
              return (
                <div
                  key={profile.id}
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${1 - reverseIdx * 0.04}) translateY(${reverseIdx * 10}px)`,
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    zIndex: reverseIdx === 0 ? 10 : 10 - reverseIdx,
                  }}
                >
                  <SwipeCard
                    profile={profile}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSuperLike={handleSuperLike}
                    isTop={reverseIdx === 0}
                  />
                </div>
              );
            })
        )}
      </div>

      {/* Action Buttons */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-4 px-6">
          {/* Pass */}
          <button
            onClick={handleSwipeLeft}
            className="w-16 h-16 rounded-full flex items-center justify-center btn-haptic transition-all"
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <X className="w-7 h-7" style={{ color: "#ff4444" }} />
          </button>

          {/* Super Like */}
          <button
            onClick={handleSuperLike}
            className="w-14 h-14 rounded-full flex items-center justify-center btn-haptic transition-all"
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <Star className="w-6 h-6" style={{ color: "#3b82f6" }} />
          </button>

          {/* Like */}
          <button
            onClick={handleSwipeRight}
            className="w-16 h-16 rounded-full flex items-center justify-center btn-haptic transition-all"
            style={{
              background: "linear-gradient(135deg, #ff3621, #ff5c47)",
              boxShadow: "0 6px 24px rgba(255, 54, 33, 0.4)",
            }}
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </button>
        </div>
      )}

      {/* Match Modal */}
      {showMatch && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div className="text-center animate-scale-in">
            {/* Animated hearts */}
            <div className="flex justify-center mb-6">
              <Heart
                className="w-20 h-20 animate-pulse"
                style={{ color: "var(--brand)", fill: "var(--brand)" }}
              />
            </div>

            <h2
              className="text-4xl font-semibold text-white mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              It&apos;s a Match!
            </h2>
            <p className="text-white/70 mb-8">
              You and {showMatch.name} liked each other
            </p>

            {/* Profile preview */}
            <div className="flex justify-center gap-4 mb-10">
              {/* Current user placeholder */}
              <div
                className="w-24 h-24 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #ff3621, #ff8c6b)",
                  border: "3px solid white",
                }}
              />
              <div
                className="w-24 h-24 rounded-3xl overflow-hidden"
                style={{ border: "3px solid white" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={showMatch.photos[0]}
                  alt={showMatch.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <button
                onClick={() => setShowMatch(null)}
                className="py-4 rounded-2xl text-white font-medium"
                style={{
                  background: "linear-gradient(135deg, #ff3621, #ff5c47)",
                  boxShadow: "0 6px 24px rgba(255,54,33,0.4)",
                }}
              >
                Send a Message
              </button>
              <button
                onClick={() => setShowMatch(null)}
                className="py-4 rounded-2xl text-white/70 font-medium"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav unreadCount={3} />
    </div>
  );
}
