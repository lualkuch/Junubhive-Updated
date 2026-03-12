"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Settings,
  Edit3,
  BadgeCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
} from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { cn } from "@/lib/utils";

const mockCurrentUser = {
  name: "Yasmine Al-Nouri",
  age: 25,
  bio: "Curious soul, creative mind. I design experiences by day and collect vinyl records by night. Looking for someone who doesn't take themselves too seriously.",
  photos: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
  ],
  location: "Cairo, EG",
  occupation: "UX Designer",
  education: "GUC – Design",
  interests: ["Music", "Design", "Travel", "Books", "Coffee"],
  verified: false,
  stats: { likes: 47, matches: 12, superLikes: 3 },
};

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: Shield, label: "Privacy & Safety" },
      { icon: Bell, label: "Notifications" },
      { icon: BadgeCheck, label: "Get Verified", accent: true },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center" },
      { icon: LogOut, label: "Sign Out", destructive: true },
    ],
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)", paddingBottom: "calc(var(--nav-height) + 16px)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Profile
        </h1>
        <button
          onClick={() => setActiveTab(activeTab === "profile" ? "settings" : "profile")}
          className="w-10 h-10 rounded-2xl flex items-center justify-center press-effect"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          {activeTab === "profile" ? (
            <Settings className="w-4.5 h-4.5" style={{ color: "var(--text-primary)" }} />
          ) : (
            <Edit3 className="w-4.5 h-4.5" style={{ color: "var(--text-primary)" }} />
          )}
        </button>
      </header>

      {activeTab === "profile" ? (
        <div className="flex flex-col px-5 gap-4">
          {/* Photo & Name */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Cover / Photo */}
            <div className="relative h-52">
              <Image
                src={mockCurrentUser.photos[0]}
                alt={mockCurrentUser.name}
                fill
                className="object-cover"
                sizes="430px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              {/* Edit photo */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center glass"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-xl font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {mockCurrentUser.name}, {mockCurrentUser.age}
                    </h2>
                    {mockCurrentUser.verified && (
                      <BadgeCheck className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {mockCurrentUser.location}
                    </span>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 rounded-xl text-xs font-medium press-effect"
                  style={{
                    background: "var(--brand-light)",
                    color: "var(--brand)",
                  }}
                >
                  Edit
                </button>
              </div>

              {/* Bio */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {mockCurrentUser.bio}
              </p>

              {/* Details */}
              <div className="flex flex-wrap gap-2 mt-3">
                {mockCurrentUser.occupation && (
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                    style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    <Briefcase className="w-3 h-3" />
                    {mockCurrentUser.occupation}
                  </span>
                )}
                {mockCurrentUser.education && (
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                    style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    <GraduationCap className="w-3 h-3" />
                    {mockCurrentUser.education}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="rounded-3xl p-5 grid grid-cols-3 gap-2"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {[
              { label: "Likes", value: mockCurrentUser.stats.likes, color: "var(--brand)" },
              { label: "Matches", value: mockCurrentUser.stats.matches, color: "#22c55e" },
              { label: "Super Likes", value: mockCurrentUser.stats.superLikes, color: "#3b82f6" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-display)" }}>
                  {value}
                </span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Interests */}
          <div
            className="rounded-3xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Interests
              </span>
              <button className="press-effect">
                <Plus className="w-4 h-4" style={{ color: "var(--brand)" }} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockCurrentUser.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-sm px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "var(--brand-light)",
                    color: "var(--brand)",
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Verify CTA */}
          {!mockCurrentUser.verified && (
            <button
              className="rounded-3xl p-5 flex items-center gap-4 press-effect text-left w-full"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,130,246,0.12)" }}
              >
                <BadgeCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-blue-600">Get Verified</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Show others you&apos;re authentic
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </button>
          )}
        </div>
      ) : (
        /* Settings */
        <div className="flex flex-col px-5 gap-6">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                style={{ color: "var(--text-tertiary)" }}>
                {group.title}
              </p>
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                {group.items.map(({ icon: Icon, label, destructive, accent }, i) => (
                  <button
                    key={label}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 press-effect transition-all",
                      i > 0 && "border-t"
                    )}
                    style={{
                      borderColor: "var(--border)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: destructive
                          ? "rgba(239,68,68,0.1)"
                          : accent
                          ? "rgba(59,130,246,0.1)"
                          : "var(--bg)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: destructive
                            ? "#ef4444"
                            : accent
                            ? "#3b82f6"
                            : "var(--text-secondary)",
                        }}
                      />
                    </div>
                    <span
                      className="flex-1 text-sm font-medium text-left"
                      style={{
                        color: destructive
                          ? "#ef4444"
                          : "var(--text-primary)",
                      }}
                    >
                      {label}
                    </span>
                    {!destructive && (
                      <ChevronRight className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Version */}
          <p className="text-center text-xs pb-2" style={{ color: "var(--text-tertiary)" }}>
            JunubHive v1.0.0
          </p>
        </div>
      )}

      <BottomNav unreadCount={3} />
    </div>
  );
}
