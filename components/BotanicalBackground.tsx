"use client";

import { useEffect, useRef } from "react";

/* ── Inline SVG botanicals ── */
const Monstera = ({ color = "#3A86FF", size = 120 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10 C20 20 5 55 15 85 C25 110 55 115 70 100 C90 80 100 55 85 35 C75 20 60 10 60 10Z" fill={color} opacity="0.85" />
    <path d="M60 10 C40 40 45 70 60 90 C75 70 80 40 60 10Z" fill={color} opacity="0.5" />
    <path d="M15 85 C30 75 50 72 60 90" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M85 35 C75 50 68 72 60 90" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <ellipse cx="35" cy="65" rx="10" ry="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" transform="rotate(-20 35 65)" />
    <ellipse cx="72" cy="50" rx="8" ry="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" transform="rotate(15 72 50)" />
  </svg>
);

const Hibiscus = ({ color = "#E63946", size = 100 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="22" rx="12" ry="20" fill={color} opacity="0.8" />
    <ellipse cx="78" cy="50" rx="20" ry="12" fill={color} opacity="0.8" />
    <ellipse cx="50" cy="78" rx="12" ry="20" fill={color} opacity="0.8" />
    <ellipse cx="22" cy="50" rx="20" ry="12" fill={color} opacity="0.8" />
    <ellipse cx="72" cy="28" rx="12" ry="20" fill={color} opacity="0.65" transform="rotate(45 72 28)" />
    <ellipse cx="72" cy="72" rx="12" ry="20" fill={color} opacity="0.65" transform="rotate(-45 72 72)" />
    <circle cx="50" cy="50" r="12" fill="#F7C948" />
    <circle cx="50" cy="50" r="5" fill={color} />
  </svg>
);

const PalmFan = ({ color = "#7B2FBE", size = 140 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 120 C70 120 20 60 30 20 C40 -5 65 10 70 40" fill={color} opacity="0.7" />
    <path d="M70 120 C70 120 120 60 110 20 C100 -5 75 10 70 40" fill={color} opacity="0.7" />
    <path d="M70 120 C50 80 10 75 5 50 C0 30 30 25 55 55" fill={color} opacity="0.55" />
    <path d="M70 120 C90 80 130 75 135 50 C140 30 110 25 85 55" fill={color} opacity="0.55" />
    <path d="M70 120 C70 80 45 55 40 35 C35 15 60 15 70 45" fill={color} opacity="0.45" />
    <path d="M70 120 C70 80 95 55 100 35 C105 15 80 15 70 45" fill={color} opacity="0.45" />
    <rect x="67" y="100" width="6" height="28" rx="3" fill={color} opacity="0.9" />
  </svg>
);

const ConfettiDots = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="20" r="5" fill="#E63946" />
    <circle cx="45" cy="10" r="4" fill="#3A86FF" />
    <circle cx="70" cy="25" r="6" fill="#4CAF7D" />
    <circle cx="25" cy="50" r="4" fill="#F7C948" />
    <circle cx="60" cy="55" r="5" fill="#8B5CF6" />
    <circle cx="40" cy="70" r="4" fill="#F4893A" />
    <circle cx="10" cy="65" r="3" fill="#E63946" />
    <circle cx="72" cy="70" r="4" fill="#3A86FF" />
    <rect x="50" y="35" width="8" height="3" rx="1.5" fill="#4CAF7D" transform="rotate(30 50 35)" />
    <rect x="20" y="35" width="6" height="3" rx="1.5" fill="#F7C948" transform="rotate(-20 20 35)" />
  </svg>
);

export type BotanicalVariant = "monstera-blue" | "monstera-red" | "hibiscus" | "palm" | "confetti";

interface BotanicalProps {
  items: Array<{
    variant: BotanicalVariant;
    top?: string; bottom?: string; left?: string; right?: string;
    size?: number; opacity?: number; rotation?: number;
    animDuration?: number; animDelay?: number; animName?: string;
    parallaxClass?: string;
  }>;
  sectionClass?: string;
  triggerSelector?: string;
}

export default function BotanicalBackground({ items, sectionClass, triggerSelector }: BotanicalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = containerRef.current?.querySelectorAll<HTMLElement>(".botanical-bg-item");
    if (!els?.length) return;
    /* simple fade-in via IntersectionObserver — no GSAP, no ScrollTrigger */
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      els.forEach((el, i) => {
        el.style.transition = `opacity 0.8s ease ${i * 0.08}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`;
        el.style.opacity = String(items[i]?.opacity ?? 0.2);
        el.style.transform = `rotate(${items[i]?.rotation ?? 0}deg) scale(1)`;
      });
      obs.disconnect();
    }, { threshold: 0.1 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [items, triggerSelector]);

  const renderSvg = (variant: BotanicalVariant, size: number) => {
    switch (variant) {
      case "monstera-blue": return <Monstera color="#3A86FF" size={size} />;
      case "monstera-red":  return <Monstera color="#E63946" size={size} />;
      case "hibiscus":      return <Hibiscus color="#E63946" size={size} />;
      case "palm":          return <PalmFan color="#7B2FBE" size={size} />;
      case "confetti":      return <ConfettiDots size={size} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={sectionClass}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`botanical-bg-item${item.parallaxClass ? ` ${item.parallaxClass}` : ""}`}
          style={{
            position: "absolute",
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            opacity: 0,
            transform: `rotate(${item.rotation ?? 0}deg) scale(0.8)`,
          }}
        >
          {renderSvg(item.variant, item.size ?? 120)}
        </div>
      ))}
    </div>
  );
}
