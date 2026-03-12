"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageCircle } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { mockMatches } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockMatches.filter(
    (m) =>
      m.last_message &&
      m.profile.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = mockMatches.reduce((acc, m) => acc + m.unread_count, 0);

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)", paddingBottom: "calc(var(--nav-height) + 16px)" }}
    >
      {/* Header */}
      <header className="px-5 pt-14 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Messages
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
            </p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 mb-5">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Search conversations..."
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

      {/* Conversations */}
      <div className="flex flex-col px-5 gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <MessageCircle
              className="w-12 h-12"
              style={{ color: "var(--text-tertiary)" }}
            />
            <div className="text-center">
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                No messages yet
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Match with someone to start chatting
              </p>
            </div>
            <Link
              href="/discover"
              className="mt-2 px-6 py-3 rounded-2xl text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #ff3621, #ff5c47)" }}
            >
              Start Discovering
            </Link>
          </div>
        ) : (
          filtered.map((match) => (
            <Link
              key={match.id}
              href={`/messages/${match.id}`}
              className="flex items-center gap-4 p-4 rounded-3xl press-effect transition-all"
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${match.unread_count > 0 ? "rgba(255,54,33,0.2)" : "var(--border)"}`,
              }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative">
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
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {match.profile.name.split(" ")[0]}
                  </span>
                  {match.last_message && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {new Date(match.last_message.created_at).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm truncate"
                  style={{
                    color:
                      match.unread_count > 0
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    fontWeight: match.unread_count > 0 ? "500" : "400",
                  }}
                >
                  {match.last_message?.sender_id === "current" && (
                    <span style={{ color: "var(--text-tertiary)" }}>You: </span>
                  )}
                  {match.last_message?.content}
                </p>
              </div>

              {/* Unread badge */}
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

      <BottomNav unreadCount={totalUnread} />
    </div>
  );
}
