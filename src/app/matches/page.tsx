"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { mockMatches } from "@/lib/mock-data";
import { mockProfiles } from "@/lib/mock-data";
import { formatLastSeen, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MatchesPage() {
  const [search, setSearch] = useState("");

  const newMatches = mockProfiles.slice(0, 3);
  const filteredMatches = mockMatches.filter((m) =>
    m.profile.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)", paddingBottom: "calc(var(--nav-height) + 16px)" }}
    >
      {/* Header */}
      <header className="px-5 pt-14 pb-5">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Matches
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          People who liked you back
        </p>
      </header>

      {/* New Matches horizontal scroll */}
      <section className="pb-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            New
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--brand-light)", color: "var(--brand)" }}
          >
            {newMatches.length}
          </span>
        </div>
        <div className="flex gap-4 px-5 overflow-x-auto pb-1 scrollbar-hide">
          {newMatches.map((profile) => (
            <button
              key={profile.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 press-effect"
            >
              <div className="relative w-20 h-20">
                <div className="w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src={profile.photos[0]}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                {/* Match glow */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    boxShadow: "0 0 0 2.5px var(--brand)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  className={cn("status-dot absolute bottom-1 right-1", profile.online_status)}
                />
              </div>
              <span
                className="text-xs font-medium max-w-[72px] truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-5 mb-4" style={{ height: "1px", background: "var(--border)" }} />

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      {/* Matches list */}
      <div className="flex flex-col px-5 gap-2">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <Heart
              className="w-12 h-12"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No matches yet. Keep swiping!
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <Link
              key={match.id}
              href={`/messages/${match.id}`}
              className="flex items-center gap-4 p-4 rounded-3xl press-effect transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden">
                  {match.profile.photos[0] ? (
                    <Image
                      src={match.profile.photos[0]}
                      alt={match.profile.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-semibold"
                      style={{ background: "linear-gradient(135deg, #ff3621, #ff8c6b)" }}
                    >
                      {getInitials(match.profile.name)}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "status-dot absolute -bottom-0.5 -right-0.5",
                    match.profile.online_status
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {match.profile.name}
                  </span>
                  {match.last_message && (
                    <span className="text-xs ml-2 flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                      {formatLastSeen(match.last_message.created_at).replace("Active ", "")}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm mt-0.5 truncate"
                  style={{
                    color: match.unread_count > 0
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    fontWeight: match.unread_count > 0 ? "500" : "400",
                  }}
                >
                  {match.last_message?.content || "Say hello! 👋"}
                </p>
              </div>

              {/* Unread */}
              {match.unread_count > 0 && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--brand)" }}
                >
                  {match.unread_count}
                </div>
              )}
            </Link>
          ))
        )}
      </div>

      <BottomNav unreadCount={3} />
    </div>
  );
}
