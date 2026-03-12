"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Profile } from "@/types";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isTop: boolean;
}

export default function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  isTop,
}: SwipeCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState<"left" | "right" | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isTop) return;
      startX.current = e.clientX;
      startY.current = e.clientY;
      setIsDragging(true);
      cardRef.current?.setPointerCapture(e.pointerId);
    },
    [isTop]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setDragX(e.clientX - startX.current);
      setDragY(e.clientY - startY.current);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragX > threshold) {
      setIsLeaving("right");
      setTimeout(() => onSwipeRight(), 300);
    } else if (dragX < -threshold) {
      setIsLeaving("left");
      setTimeout(() => onSwipeLeft(), 300);
    } else {
      setDragX(0);
      setDragY(0);
    }
  }, [isDragging, dragX, onSwipeRight, onSwipeLeft]);

  const rotation = isDragging ? dragX * 0.08 : 0;
  const likeOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 80, 0), 1);

  const transform = isLeaving
    ? isLeaving === "right"
      ? "translateX(150%) rotate(20deg)"
      : "translateX(-150%) rotate(-20deg)"
    : isDragging
    ? `translateX(${dragX}px) translateY(${dragY * 0.3}px) rotate(${rotation}deg)`
    : "translateX(0) rotate(0deg)";

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        "absolute inset-0 rounded-3xl overflow-hidden swipe-card",
        !isTop && "pointer-events-none"
      )}
      style={{
        transform,
        transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
        boxShadow: isTop
          ? "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)"
          : "0 8px 32px rgba(0,0,0,0.08)",
        zIndex: isTop ? 10 : 5,
      }}
    >
      {/* Photos */}
      <div className="absolute inset-0">
        <Image
          src={profile.photos[currentPhoto]}
          alt={profile.name}
          fill
          className="object-cover"
          priority={isTop}
          sizes="430px"
        />
      </div>

      {/* Photo indicator */}
      {profile.photos.length > 1 && (
        <div className="absolute top-3 inset-x-3 flex gap-1.5 z-20">
          {profile.photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhoto(i);
              }}
              className="flex-1 h-1 rounded-full transition-all duration-200"
              style={{
                background:
                  i === currentPhoto
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}

      {/* Photo tap zones */}
      <div className="absolute inset-0 z-10 flex">
        <div
          className="flex-1"
          onClick={() =>
            setCurrentPhoto((p) =>
              p > 0 ? p - 1 : profile.photos.length - 1
            )
          }
        />
        <div
          className="flex-1"
          onClick={() =>
            setCurrentPhoto((p) => (p + 1) % profile.photos.length)
          }
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Like / Nope labels */}
      {isDragging && (
        <>
          <div
            className="absolute top-16 left-6 z-30 px-4 py-2 rounded-2xl font-bold text-lg tracking-widest"
            style={{
              border: "3px solid #22c55e",
              color: "#22c55e",
              opacity: likeOpacity,
              transform: `rotate(-12deg)`,
              fontFamily: "var(--font-display)",
            }}
          >
            LIKE
          </div>
          <div
            className="absolute top-16 right-6 z-30 px-4 py-2 rounded-2xl font-bold text-lg tracking-widest"
            style={{
              border: "3px solid var(--brand)",
              color: "var(--brand)",
              opacity: nopeOpacity,
              transform: `rotate(12deg)`,
              fontFamily: "var(--font-display)",
            }}
          >
            NOPE
          </div>
        </>
      )}

      {/* Info */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-5">
        {/* Name & Age */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-white text-2xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {profile.name}, {profile.age}
              </h2>
              {profile.verified && (
                <BadgeCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/70 text-sm">
                {profile.distance
                  ? `${profile.distance} km away`
                  : profile.location}
              </span>
            </div>
          </div>

          {/* Online status */}
          <div
            className={cn(
              "status-dot flex-shrink-0",
              profile.online_status
            )}
          />
        </div>

        {/* Expandable details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="w-full flex items-center justify-between text-white/70 text-sm mt-1"
          style={{ zIndex: 30, position: "relative" }}
        >
          <span className="truncate max-w-[250px] text-white/80 text-sm">
            {showDetails ? "" : profile.bio.slice(0, 60) + "..."}
          </span>
          {showDetails ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
          ) : (
            <ChevronUp className="w-4 h-4 flex-shrink-0 ml-2" />
          )}
        </button>

        {showDetails && (
          <div
            className="mt-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/85 text-sm leading-relaxed mb-3">
              {profile.bio}
            </p>

            {/* Details row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.occupation && (
                <span className="flex items-center gap-1 text-xs text-white/80 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Briefcase className="w-3 h-3" />
                  {profile.occupation}
                </span>
              )}
              {profile.education && (
                <span className="flex items-center gap-1 text-xs text-white/80 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <GraduationCap className="w-3 h-3" />
                  {profile.education}
                </span>
              )}
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs text-white/90 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
