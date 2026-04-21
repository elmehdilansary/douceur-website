"use client";

import { useEffect, useRef, useState } from "react";
import BotanicalBackground from "@/components/BotanicalBackground";
import type { BotanicalVariant } from "@/components/BotanicalBackground";
import AnimateHeading from "@/components/AnimateHeading";
import { useT } from "@/lib/i18n";

const BOTANICAL_ITEMS: Array<{
  variant: BotanicalVariant; top?: string; bottom?: string; left?: string; right?: string;
  size?: number; opacity?: number; rotation?: number; animDuration?: number; animDelay?: number; animName?: string;
}> = [
  { variant: "monstera-blue", top: "5%",  left: "-40px",  size: 180, opacity: 0.14, rotation: -20 },
  { variant: "hibiscus",      top: "10%", right: "-30px", size: 130, opacity: 0.16, rotation: 15  },
  { variant: "palm",          bottom: "8%",  left: "5%",  size: 160, opacity: 0.12, rotation: 10  },
  { variant: "monstera-red",  bottom: "5%",  right: "3%", size: 150, opacity: 0.12, rotation: -15 },
];

const STATS = [
  { value: 600, secondary: 300, suffixKey: "", labelKey: "manifesto.stat1", color: "#3AAFE4" },
  { value: 3,   suffixKey: "manifesto.stat2.suffix", labelKey: "manifesto.stat2", color: "#E8436A" },
  { value: 100, suffixKey: "", labelKey: "manifesto.stat3", color: "#4CAF7D" },
  { value: 1,   suffixKey: "manifesto.stat4.suffix", labelKey: "manifesto.stat4", color: "#F7C948" },
] as const;

/* custom SVG panel icons */
const PanelIconHeart = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
    <path d="M24 40 C24 40 6 28 6 16 C6 10 10.5 6 16 6 C19.5 6 22.5 8 24 11 C25.5 8 28.5 6 32 6 C37.5 6 42 10 42 16 C42 28 24 40 24 40Z" fill={color} opacity="0.25"/>
    <path d="M24 40 C24 40 6 28 6 16 C6 10 10.5 6 16 6 C19.5 6 22.5 8 24 11 C25.5 8 28.5 6 32 6 C37.5 6 42 10 42 16 C42 28 24 40 24 40Z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);
const PanelIconShield = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
    <path d="M24 4 L40 10 L40 24 C40 33 32 40 24 44 C16 40 8 33 8 24 L8 10 Z" fill={color} opacity="0.18"/>
    <path d="M24 4 L40 10 L40 24 C40 33 32 40 24 44 C16 40 8 33 8 24 L8 10 Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M17 24 L22 29 L31 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PanelIconMaroc = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2" opacity="0.3"/>
    <path d="M24 8 C24 8 16 16 16 24 C16 32 24 40 24 40 C24 40 32 32 32 24 C32 16 24 8 24 8Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 20 L40 20 M8 28 L40 28" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="24" cy="24" r="4" fill={color} opacity="0.7"/>
  </svg>
);

const PANELS = [
  { PanelIcon: PanelIconHeart, titleKey: "manifesto.panel1.title", bodyKey: "manifesto.panel1.body", color: "#E8436A", gradient: "linear-gradient(135deg, rgba(232,67,106,0.12) 0%, rgba(244,137,58,0.06) 100%)" },
  { PanelIcon: PanelIconShield, titleKey: "manifesto.panel2.title", bodyKey: "manifesto.panel2.body", color: "#3AAFE4", gradient: "linear-gradient(135deg, rgba(58,175,228,0.12) 0%, rgba(139,92,246,0.06) 100%)" },
  { PanelIcon: PanelIconMaroc, titleKey: "manifesto.panel3.title", bodyKey: "manifesto.panel3.body", color: "#4CAF7D", gradient: "linear-gradient(135deg, rgba(76,175,125,0.12) 0%, rgba(247,201,72,0.06) 100%)" },
] as const;

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);
  return count;
}

function StatCard({ value, secondary, suffix, label, color, active }: {
  value: number; secondary?: number; suffix: string; label: string; color: string; active: boolean;
}) {
  const count = useCountUp(value, active);
  const count2 = useCountUp(secondary ?? 0, active && secondary !== undefined);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-8px) scale(1.02)";
        el.style.boxShadow = `0 24px 64px ${color}28, 0 0 0 1px ${color}40`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = `0 4px 24px ${color}10, 0 0 0 1px ${color}20`;
      }}
      style={{
        position: "relative",
        background: `linear-gradient(145deg, ${color}12 0%, ${color}04 100%)`,
        borderRadius: "24px",
        padding: "36px 28px",
        textAlign: "center",
        flex: "1 1 160px",
        border: `1px solid ${color}25`,
        boxShadow: `0 4px 24px ${color}10, 0 0 0 1px ${color}20`,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
        overflow: "hidden",
      }}
    >
      {/* Glow dot top */}
      <div style={{
        position: "absolute", top: "12px", right: "14px",
        width: "6px", height: "6px", borderRadius: "50%",
        background: color, boxShadow: `0 0 10px ${color}`,
        opacity: 0.6,
      }}/>
      {/* Number */}
      <p dir="ltr" style={{
        fontFamily: "var(--font-pacifico, cursive)",
        fontSize: "clamp(28px, 4.2vw, 52px)",
        color, lineHeight: 1, marginBottom: "10px",
        textShadow: `0 0 40px ${color}60`,
        whiteSpace: "nowrap",
        direction: "ltr",
        textAlign: "center",
      }}>
        {count}{secondary !== undefined ? ` / ${count2}` : (value === 100 ? "%" : suffix)}
      </p>
      {/* Divider */}
      <div style={{
        width: "32px", height: "2px", borderRadius: "1px",
        background: `linear-gradient(90deg, ${color}, transparent)`,
        margin: "0 auto 12px",
      }}/>
      {/* Label */}
      <p style={{
        fontFamily: "var(--font-nunito, sans-serif)",
        fontSize: "11px", color: "rgba(255,255,255,0.55)",
        fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        {label}
      </p>
    </div>
  );
}

export default function Manifesto() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="manifesto" ref={sectionRef} className="manifesto-section" style={{
      background: "linear-gradient(180deg, #060f2a 0%, #0A1A45 40%, #0D2156 100%)",
      padding: "140px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <BotanicalBackground items={BOTANICAL_ITEMS} triggerSelector=".manifesto-section" />
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-24px) rotate(8deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-16px) rotate(-6deg); }
          66%      { transform: translateY(8px)  rotate(4deg); }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "96px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(58,175,228,0.08)",
            border: "1px solid rgba(58,175,228,0.2)",
            borderRadius: "50px", padding: "7px 22px",
            marginBottom: "28px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 10px #3AAFE4", display: "inline-block" }}/>
            <span style={{
              fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "#3AAFE4", fontWeight: 800,
            }}>{t("manifesto.eyebrow")}</span>
          </div>

          <AnimateHeading text={t("manifesto.title")} tag="h2" style={{
            fontFamily: "var(--font-pacifico, cursive)",
            fontSize: "clamp(36px, 5.5vw, 68px)",
            color: "#fff", lineHeight: 1.1, marginBottom: "24px",
            textShadow: "0 0 80px rgba(58,175,228,0.25)",
          }} />

          {/* Decorative divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(to right, transparent, rgba(58,175,228,0.5))" }}/>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 10px #3AAFE4" }}/>
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(to left, transparent, rgba(58,175,228,0.5))" }}/>
          </div>

          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "clamp(15px, 1.5vw, 18px)",
            color: "rgba(255,255,255,0.55)", maxWidth: "520px", margin: "0 auto",
            lineHeight: 1.85, fontWeight: 400,
          }}>
            {t("manifesto.lead")}
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="manifesto-stats" style={{
          display: "flex", gap: "16px", flexWrap: "wrap",
          justifyContent: "center", marginBottom: "96px",
        }}>
          {STATS.map(s => (
            <StatCard
              key={s.labelKey}
              value={s.value}
              secondary={"secondary" in s ? s.secondary : undefined}
              suffix={s.suffixKey ? t(s.suffixKey) : ""}
              label={t(s.labelKey)}
              color={s.color}
              active={visible}
            />
          ))}
        </div>

        {/* ── Feature panels ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {PANELS.map((p, i) => (
            <div
              key={i}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = `0 24px 60px ${p.color}20`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "none";
              }}
              style={{
                background: p.gradient,
                border: `1px solid ${p.color}30`,
                borderRadius: "28px",
                padding: "44px 36px",
                transform: visible ? "translateY(0)" : "translateY(48px)",
                opacity: visible ? 1 : 0,
                transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1 + 0.1}s,
                             opacity 0.8s ease ${i * 0.1 + 0.1}s,
                             box-shadow 0.3s ease`,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Background glow */}
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: `radial-gradient(circle, ${p.color}18 0%, transparent 70%)`,
                pointerEvents: "none",
              }}/>

              {/* Icon */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "56px", height: "56px", borderRadius: "16px",
                background: `${p.color}15`, border: `1px solid ${p.color}30`,
                marginBottom: "24px",
              }}>
                <p.PanelIcon color={p.color} />
              </div>

              <h3 style={{
                fontFamily: "var(--font-pacifico, cursive)",
                fontSize: "clamp(20px, 2.2vw, 26px)",
                color: "#fff", marginBottom: "16px", lineHeight: 1.2,
              }}>{t(p.titleKey)}</h3>

              <div style={{
                width: "36px", height: "2px", borderRadius: "1px",
                background: `linear-gradient(90deg, ${p.color}, transparent)`,
                marginBottom: "16px",
              }}/>

              <p style={{
                fontFamily: "var(--font-nunito, sans-serif)",
                fontSize: "15px", color: "rgba(255,255,255,0.6)",
                lineHeight: 1.75, fontWeight: 400,
              }}>{t(p.bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
