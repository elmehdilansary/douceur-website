"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap.config";
import { registerGSAP } from "@/lib/gsap.config";

/* 8 large botanical SVGs fixed-positioned, parallax on scroll */
const MonsteraL = ({ color = "#3A86FF" }: { color?: string }) => (
  <svg width="220" height="220" viewBox="0 0 120 120" fill="none">
    <path d="M60 10 C20 20 5 55 15 85 C25 110 55 115 70 100 C90 80 100 55 85 35 C75 20 60 10 60 10Z" fill={color} opacity="0.85" />
    <path d="M60 10 C40 40 45 70 60 90 C75 70 80 40 60 10Z" fill={color} opacity="0.5" />
    <path d="M15 85 C30 75 50 72 60 90" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M85 35 C75 50 68 72 60 90" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <ellipse cx="35" cy="65" rx="10" ry="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" transform="rotate(-20 35 65)" />
  </svg>
);

const HibiscusL = ({ color = "#E63946" }: { color?: string }) => (
  <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="22" rx="12" ry="20" fill={color} opacity="0.8" />
    <ellipse cx="78" cy="50" rx="20" ry="12" fill={color} opacity="0.8" />
    <ellipse cx="50" cy="78" rx="12" ry="20" fill={color} opacity="0.8" />
    <ellipse cx="22" cy="50" rx="20" ry="12" fill={color} opacity="0.8" />
    <ellipse cx="72" cy="28" rx="12" ry="20" fill={color} opacity="0.65" transform="rotate(45 72 28)" />
    <circle cx="50" cy="50" r="12" fill="#F7C948" />
    <circle cx="50" cy="50" r="5" fill={color} />
  </svg>
);

const PalmL = ({ color = "#7B2FBE" }: { color?: string }) => (
  <svg width="180" height="180" viewBox="0 0 140 140" fill="none">
    <path d="M70 120 C70 120 20 60 30 20 C40 -5 65 10 70 40" fill={color} opacity="0.7" />
    <path d="M70 120 C70 120 120 60 110 20 C100 -5 75 10 70 40" fill={color} opacity="0.7" />
    <path d="M70 120 C50 80 10 75 5 50 C0 30 30 25 55 55" fill={color} opacity="0.55" />
    <path d="M70 120 C90 80 130 75 135 50 C140 30 110 25 85 55" fill={color} opacity="0.55" />
    <rect x="67" y="100" width="6" height="28" rx="3" fill={color} opacity="0.9" />
  </svg>
);

/* Reduced to 4 items to minimize ScrollTrigger overhead */
const PARALLAX_ITEMS = [
  { id: "pl1", el: <MonsteraL color="#3A86FF" />, top: "8vh",  left: "-60px", yTarget: -100 },
  { id: "pl2", el: <MonsteraL color="#E63946" />, top: "45vh", right: "-50px", yTarget: -130 },
  { id: "pl4", el: <HibiscusL color="#E63946" />, top: "20vh", right: "5vw",  yTarget: -160 },
  { id: "pl7", el: <PalmL color="#3AAFE4" />,     top: "55vh", right: "10vw", yTarget: -80  },
];

export default function ParallaxBotanicals() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGSAP();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = refs.current.filter(Boolean) as HTMLDivElement[];
    let raf: number | null = null;
    let dirty = false;
    let progress = 0;

    const st = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        if (!dirty) {
          dirty = true;
          raf = requestAnimationFrame(() => {
            targets.forEach((el, i) => {
              el.style.transform = `translateY(${progress * PARALLAX_ITEMS[i].yTarget}px)`;
            });
            dirty = false;
            raf = null;
          });
        }
      },
    });

    return () => {
      st.kill();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {PARALLAX_ITEMS.map((item, i) => (
        <div
          key={item.id}
          ref={el => { refs.current[i] = el; }}
          style={{
            position: "fixed",
            top: item.top,
            left: (item as { left?: string }).left,
            right: (item as { right?: string }).right,
            opacity: 0.12,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {item.el}
        </div>
      ))}
    </>
  );
}
