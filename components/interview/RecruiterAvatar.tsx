"use client";

import Image from "next/image";
import type { RecruiterProfile } from "@/data/recruiters";

export type RecruiterAvatarState = "idle" | "listening" | "speaking";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  recruiter: RecruiterProfile;
  state?: RecruiterAvatarState;
  size?: AvatarSize;
  className?: string;
  priority?: boolean;
  showStatusDot?: boolean;
  showWaveform?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-12 w-12",
  sm: "h-14 w-14",
  md: "h-16 w-16 sm:h-20 sm:w-20",
  lg: "h-20 w-20 sm:h-28 sm:w-28",
  xl: "h-24 w-24 sm:h-32 sm:w-32",
};

const waveformHeights = [34, 62, 46, 82, 54, 92, 48, 76, 40, 68, 36];

export default function RecruiterAvatar({
  recruiter,
  state = "idle",
  size = "md",
  className = "",
  priority = false,
  showStatusDot = false,
  showWaveform = false,
}: Props) {
  const speaking = state === "speaking";
  const alt = `${recruiter.name}, ${recruiter.title}`;

  return (
    <div className="inline-flex shrink-0 flex-col items-center" aria-label={`${recruiter.name} ${state}`}>
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border-4 border-white/80 bg-slate-200 shadow-2xl ${sizeClasses[size]} ${
          speaking ? "ring-4 ring-blue-400/20" : state === "listening" ? "ring-4 ring-emerald-400/15" : ""
        } ${className}`}
      >
        {/*
          Fix 40.2: the recruiter portrait is intentionally pixel-stable.
          Speaking/listening state never swaps the bitmap. Motion is shown
          only by the status indicator and the audio waveform below.
        */}
        <Image
          src={recruiter.portraits.idle}
          alt={alt}
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className="object-cover object-center"
          priority={priority}
          unoptimized
        />

        {showStatusDot && (
          <span
            className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
              speaking ? "bg-blue-500" : state === "listening" ? "bg-emerald-500" : "bg-slate-400"
            }`}
            aria-hidden="true"
          />
        )}
      </div>

      {showWaveform && (
        <div
          className="mt-2 flex h-5 items-center justify-center gap-0.5 sm:h-6 sm:gap-1"
          aria-hidden="true"
        >
          {waveformHeights.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className={`w-0.5 origin-center rounded-full sm:w-1 ${
                speaking
                  ? "animate-[recruiterVoiceWave_780ms_ease-in-out_infinite] bg-blue-400"
                  : "bg-slate-300/80"
              }`}
              style={{
                height: speaking ? `${Math.max(28, height * 0.72)}%` : "18%",
                animationDelay: `${index * 58}ms`,
                animationDuration: `${720 + (index % 4) * 95}ms`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes recruiterVoiceWave {
          0%, 100% {
            transform: scaleY(0.45);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          span {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
