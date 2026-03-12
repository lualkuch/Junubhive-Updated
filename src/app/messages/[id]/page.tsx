"use client";

import { useState, useRef, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, MoreVertical, BadgeCheck } from "lucide-react";
import { mockMatches, mockMessages } from "@/lib/mock-data";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const match = mockMatches.find((m) => m.id === id) || mockMatches[0];
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      match_id: match.id,
      sender_id: "current",
      content: input.trim(),
      type: "text",
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, newMsg]);
    setInput("");
  }

  // Group messages by sender sequences
  const groupedMessages = messages.reduce<{ msg: Message; showAvatar: boolean }[]>(
    (acc, msg, i) => {
      const next = messages[i + 1];
      const showAvatar = msg.sender_id !== "current" && (!next || next.sender_id !== msg.sender_id);
      return [...acc, { msg, showAvatar }];
    },
    []
  );

  return (
    <div className="flex flex-col h-dvh" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 pt-14 pb-4"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/messages" className="press-effect">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </Link>

        <div className="relative">
          <div className="w-10 h-10 rounded-2xl overflow-hidden relative">
            <Image
              src={match.profile.photos[0]}
              alt={match.profile.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div
            className={cn(
              "status-dot absolute -bottom-0.5 -right-0.5",
              match.profile.online_status
            )}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {match.profile.name.split(" ")[0]}
            </span>
            {match.profile.verified && (
              <BadgeCheck className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {match.profile.online_status === "online"
              ? "Active now"
              : "Active recently"}
          </p>
        </div>

        <button className="press-effect p-2">
          <MoreVertical className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {/* Match banner */}
        <div className="flex flex-col items-center gap-3 py-6 mb-2">
          <div className="flex -space-x-4">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden z-10 ring-2 ring-[var(--bg)]"
            >
              <Image
                src={match.profile.photos[0]}
                alt={match.profile.name}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          </div>
          <div className="text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              You matched with{" "}
              <span style={{ color: "var(--text-primary)" }}>
                {match.profile.name.split(" ")[0]}
              </span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {new Date(match.matched_at).toLocaleDateString("en", {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Message bubbles */}
        {groupedMessages.map(({ msg, showAvatar }) => {
          const isMe = msg.sender_id === "current";
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2 animate-fade-in",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              {!isMe && (
                <div
                  className="w-7 h-7 rounded-xl overflow-hidden flex-shrink-0 mb-0.5"
                  style={{ opacity: showAvatar ? 1 : 0 }}
                >
                  <Image
                    src={match.profile.photos[0]}
                    alt=""
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className="max-w-[72%] px-4 py-2.5 rounded-3xl text-sm leading-relaxed"
                style={
                  isMe
                    ? {
                      background: "linear-gradient(135deg, #ff3621, #ff5c47)",
                      color: "white",
                      borderBottomRightRadius: "8px",
                    }
                    : {
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                      borderBottomLeftRadius: "8px",
                    }
                }
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 safe-bottom"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={`Message ${match.profile.name.split(" ")[0]}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 btn-haptic transition-all disabled:opacity-40"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #ff3621, #ff5c47)"
                : "var(--bg)",
              border: input.trim() ? "none" : "1px solid var(--border)",
            }}
          >
            <Send
              className="w-4 h-4"
              style={{ color: input.trim() ? "white" : "var(--text-tertiary)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
