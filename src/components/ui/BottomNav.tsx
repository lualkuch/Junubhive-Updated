"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/discover", icon: Sparkles, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile", icon: User, label: "Profile" },
];

interface BottomNavProps {
  unreadCount?: number;
}

export default function BottomNav({ unreadCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 safe-bottom"
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-around px-2 h-[var(--nav-height)]">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          const hasUnread = href === "/messages" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200 press-effect relative",
                isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn("w-6 h-6 transition-all duration-200")}
                  style={{
                    color: isActive ? "var(--brand)" : "var(--text-primary)",
                    fill: isActive ? "var(--brand)" : "transparent",
                    strokeWidth: isActive ? 2 : 1.75,
                  }}
                />
                {hasUnread && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: "var(--brand)" }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ color: "var(--brand)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
