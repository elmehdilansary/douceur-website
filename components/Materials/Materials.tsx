"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";

/* ── Custom SVG icons — no emoji ───────────────────────────────────────── */
const IconLeaf = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="72" height="72">
    <path d="M40 8 C18 14 8 34 12 54 C16 72 34 76 48 68 C66 58 72 36 60 18 C54 10 40 8 40 8Z" fill={color} opacity="0.18"/>
    <path d="M40 8 C28 28 30 50 40 66" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M40 8 C52 28 50 50 40 66" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M16 40 C26 36 36 38 40 50" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M60 32 C52 34 44 38 40 50" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
    <circle cx="40" cy="8" r="3" fill={color}/>
  </svg>
);

const IconWave = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="72" height="72">
    <path d="M8 30 Q20 18 32 30 Q44 42 56 30 Q68 18 76 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M8 42 Q20 30 32 42 Q44 54 56 42 Q68 30 76 42" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M8 54 Q20 42 32 54 Q44 66 56 54 Q68 42 76 54" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
    <circle cx="40" cy="20" r="6" fill={color} opacity="0.2"/>
    <circle cx="40" cy="20" r="3" fill={color} opacity="0.6"/>
  </svg>
);

const IconFlower = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="72" height="72">
    <ellipse cx="40" cy="20" rx="7" ry="14" fill={color} opacity="0.75"/>
    <ellipse cx="60" cy="40" rx="14" ry="7" fill={color} opacity="0.75"/>
    <ellipse cx="40" cy="60" rx="7" ry="14" fill={color} opacity="0.75"/>
    <ellipse cx="20" cy="40" rx="14" ry="7" fill={color} opacity="0.75"/>
    <ellipse cx="54" cy="26" rx="7" ry="14" fill={color} opacity="0.55" transform="rotate(45 54 26)"/>
    <ellipse cx="54" cy="54" rx="7" ry="14" fill={color} opacity="0.55" transform="rotate(-45 54 54)"/>
    <ellipse cx="26" cy="54" rx="7" ry="14" fill={color} opacity="0.55" transform="rotate(45 26 54)"/>
    <ellipse cx="26" cy="26" rx="7" ry="14" fill={color} opacity="0.55" transform="rotate(-45 26 26)"/>
    <circle cx="40" cy="40" r="10" fill="#F7C948"/>
    <circle cx="40" cy="40" r="5" fill={color}/>
  </svg>
);

const IconStar = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="72" height="72">
    <path d="M40 10 L45 32 L68 32 L50 47 L57 70 L40 56 L23 70 L30 47 L12 32 L35 32 Z" fill={color} opacity="0.2"/>
    <path d="M40 10 L45 32 L68 32 L50 47 L57 70 L40 56 L23 70 L30 47 L12 32 L35 32 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <circle cx="40" cy="40" r="6" fill={color} opacity="0.8"/>
    <path d="M40 20 L40 60 M20 40 L60 40" stroke={color} strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
  </svg>
);

const FEATURES = [
  { Icon: IconLeaf,   color: "#4CAF7D", titleKey: "materials.f1.title", bodyKey: "materials.f1.body", detailKey: "materials.f1.detail", tag: "01" },
  { Icon: IconWave,   color: "#3AAFE4", titleKey: "materials.f2.title", bodyKey: "materials.f2.body", detailKey: "materials.f2.detail", tag: "02" },
  { Icon: IconFlower, color: "#E8436A", titleKey: "materials.f3.title", bodyKey: "materials.f3.body", detailKey: "materials.f3.detail", tag: "03" },
  { Icon: IconStar,   color: "#F7C948", titleKey: "materials.f4.title", bodyKey: "materials.f4.body", detailKey: "materials.f4.detail", tag: "04" },
] as const;

function FeatureRow({ Icon, color, titleKey, bodyKey, detailKey, tag, index }: typeof FEATURES[number] & { index: number }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="materials-row" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "clamp(40px, 6vw, 100px)",
      alignItems: "center",
      padding: "80px clamp(24px, 8vw, 120px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      direction: isEven ? "ltr" : "rtl",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translateX(${isEven ? "-50px" : "50px"})`,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s,
                   transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
    }}>

      {/* Visual card */}
      <div style={{ direction: "ltr", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        {/* Glass orb */}
        <div style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "clamp(160px, 22vw, 240px)", height: "clamp(160px, 22vw, 240px)",
          borderRadius: "32px",
          background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}18, inset 0 1px 0 rgba(255,255,255,0.08)`,
          overflow: "hidden",
        }}>
          {/* Tag number */}
          <div style={{
            position: "absolute", top: "16px", right: "16px",
            fontFamily: "var(--font-pacifico, cursive)",
            fontSize: "11px", color: `${color}66`,
            letterSpacing: "0.1em",
          }}>{tag}</div>
          {/* Icon */}
          <Icon color={color} />
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: `${color}15`,
          color: color,
          borderRadius: "50px",
          padding: "8px 20px",
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "11px", fontWeight: 800,
          letterSpacing: "0.14em", textTransform: "uppercase",
          border: `1px solid ${color}30`,
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: color, display: "inline-block",
            boxShadow: `0 0 8px ${color}`,
          }}/>
          {t(detailKey)}
        </div>
      </div>

      {/* Text */}
      <div style={{ direction: "ltr" }}>
        {/* Section number accent */}
        <div style={{
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "11px", fontWeight: 800,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: `${color}80`, marginBottom: "16px",
        }}>— {tag}</div>

        <h3 style={{
          fontFamily: "var(--font-pacifico, cursive)",
          fontSize: "clamp(26px, 3.2vw, 42px)",
          color: "#fff", marginBottom: "20px", lineHeight: 1.15,
        }}>{t(titleKey)}</h3>

        {/* Accent line */}
        <div style={{
          width: "48px", height: "3px", borderRadius: "2px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
          marginBottom: "20px",
        }}/>

        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "clamp(14px, 1.3vw, 17px)",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.85, fontWeight: 400,
        }}>{t(bodyKey)}</p>
      </div>
    </div>
  );
}

export default function Materials() {
  const { t } = useT();
  return (
    <section id="materials" style={{
      background: "linear-gradient(180deg, #091640 0%, #0D2156 40%, #091640 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(58,175,228,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(58,175,228,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}/>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "rgba(76,175,125,0.1)",
          border: "1px solid rgba(76,175,125,0.25)",
          borderRadius: "50px", padding: "7px 22px",
          marginBottom: "24px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF7D", boxShadow: "0 0 8px #4CAF7D", display: "inline-block" }}/>
          <span style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#4CAF7D", fontWeight: 800,
          }}>{t("materials.eyebrow")}</span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-pacifico, cursive)",
          fontSize: "clamp(36px, 5.5vw, 68px)",
          color: "#fff", lineHeight: 1.1,
          textShadow: "0 0 80px rgba(58,175,228,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "0 auto",
          maxWidth: "900px",
        }}>
          {t("materials.title").split("{LOGO}").map((part, i, arr) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "18px" }}>
              {part}
              {i < arr.length - 1 && (
                <img
                  src="/LOGO.png"
                  alt="Douceur"
                  style={{
                    height: "clamp(48px, 7vw, 88px)",
                    width: "auto",
                    display: "inline-block",
                    verticalAlign: "middle",
                    filter: "drop-shadow(0 0 40px rgba(58,175,228,0.35))",
                  }}
                />
              )}
            </span>
          ))}
        </h2>

        {/* Decorative line */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "16px", marginTop: "24px",
        }}>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, rgba(58,175,228,0.4))" }}/>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 12px #3AAFE4" }}/>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(to left, transparent, rgba(58,175,228,0.4))" }}/>
        </div>
      </div>

      {FEATURES.map((f, i) => <FeatureRow key={i} {...f} index={i} />)}
      <div style={{ height: "80px" }} />
    </section>
  );
}
