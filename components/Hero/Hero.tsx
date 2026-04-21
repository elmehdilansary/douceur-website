"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScrollStore } from "@/lib/scrollStore";
import { useT } from "@/lib/i18n";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "transparent" }} />
  ),
});

export default function Hero() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const setScrollProgress = useScrollStore(s => s.setScrollProgress);
  const scrollProgress = useScrollStore(s => s.scrollProgress);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const twoVH = window.innerHeight * 2;
        setScrollProgress(Math.min(window.scrollY / twoVH, 1));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setScrollProgress]);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      dir="ltr"
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "auto" : "100svh",
        minHeight: isMobile ? "auto" : "680px",
        overflow: "hidden",
        background: "linear-gradient(160deg, #060f2a 0%, #0D2156 55%, #091a45 100%)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        direction: "ltr",
        transform: isMobile ? `translateY(${Math.min(scrollProgress * 60, 100)}px)` : "none",
        opacity: isMobile ? Math.max(1 - scrollProgress * 1.5, 0.4) : 1,
      }}
    >
      {/* ── LEFT: text column ── */}
      <div className="hero-text-col" style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(28px, 7vw, 110px)",
      }}>
        {/* grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(58,175,228,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,175,228,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 30% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, black 0%, transparent 70%)",
        }} />
        {/* left edge darkening */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to right, rgba(6,15,42,0.7) 0%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* eyebrow pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(58,175,228,0.1)",
            border: "1px solid rgba(58,175,228,0.28)",
            borderRadius: "50px", padding: "6px 18px",
            marginBottom: "28px", width: "fit-content",
            animation: "hFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 8px #3AAFE4", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-nunito, sans-serif)",
              fontSize: "11px", fontWeight: 800,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "#3AAFE4",
            }}>{t("hero.eyebrow")}</span>
          </div>

          {/* wordmark — logo */}
          <h1 className="hero-logo" style={{
            margin: "0 0 26px",
            animation: "hFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
            lineHeight: 1,
            fontSize: 0,
          }}>
            <img
              src="/LOGO.png"
              alt="Douceur"
              width={340}
              height={120}
              style={{
                width: "clamp(160px, 22vw, 340px)",
                height: "auto",
                display: "inline-block",
                maxWidth: "100%",
                filter: "drop-shadow(0 0 60px rgba(58,175,228,0.35)) drop-shadow(0 4px 20px rgba(0,0,0,0.6))",
              }}
            />
          </h1>

          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)",
            fontSize: "clamp(14px, 1.3vw, 17px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.85,
            maxWidth: "360px",
            marginBottom: "44px",
            animation: "hFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both",
          }}>
            {t("hero.tagline")}
            <br />{t("hero.features")}
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{
            display: "flex", gap: "14px", flexWrap: "wrap",
            animation: "hFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both",
          }}>
            <a href="#manifesto" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 40px",
              background: "linear-gradient(135deg, #E8436A, #F4893A)",
              color: "#fff", borderRadius: "50px",
              fontFamily: "var(--font-nunito, sans-serif)", fontWeight: 800,
              fontSize: "14px", letterSpacing: "0.07em", textDecoration: "none",
              boxShadow: "0 8px 40px rgba(232,67,106,0.45)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 56px rgba(232,67,106,0.6)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "none";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(232,67,106,0.45)";
            }}
            >
              {t("hero.cta.discover")}
            </a>
            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 40px",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.18)",
              borderRadius: "50px",
              fontFamily: "var(--font-nunito, sans-serif)", fontWeight: 700,
              fontSize: "14px", letterSpacing: "0.07em", textDecoration: "none",
              backdropFilter: "blur(12px)",
              transition: "background 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.13)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.transform = "none";
            }}
            >
              {t("hero.cta.contact")}
            </a>
          </div>

          {/* stats */}
          <div className="hero-stats" style={{
            display: "flex", gap: "16px", marginTop: "52px", flexWrap: "wrap",
            animation: "hFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s both",
          }}>
            {[
              { n: "600", label: t("hero.stat.sheets"),  color: "#3AAFE4" },
              { n: "3",   label: t("hero.stat.plies"),   color: "#E8436A" },
              { n: "100%",label: t("hero.stat.natural"), color: "#4CAF7D" },
            ].map(({ n, label, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${color}30`,
                borderRadius: "14px", padding: "12px 20px", textAlign: "center",
                backdropFilter: "blur(8px)",
              }}>
                <p style={{
                  fontFamily: "var(--font-pacifico, cursive)",
                  fontSize: "22px", color, lineHeight: 1,
                  textShadow: `0 0 20px ${color}60`,
                }}>{n}</p>
                <p style={{
                  fontFamily: "var(--font-nunito, sans-serif)",
                  fontSize: "10px", color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontWeight: 700, marginTop: "5px",
                }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: 3D canvas ── */}
      <div className="hero-3d-col" style={{ position: "relative", zIndex: 2, minHeight: isMobile ? "320px" : "auto" }}>
        {inView && <HeroScene3D />}
      </div>

      {/* ── bottom gradient fade ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "140px", zIndex: 5, pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent, #060f2a)",
        gridColumn: "1 / -1",
      }} />

      {/* ── scroll hint — hidden on mobile to avoid collision with ContactFloat ── */}
      <div className="hero-scroll-hint" style={{
        position: "absolute", bottom: "28px", left: "50%",
        transform: "translateX(-50%)", zIndex: 6,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
      }}>
        <span style={{
          fontFamily: "var(--font-nunito, sans-serif)", fontSize: "9px",
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)", fontWeight: 700,
        }}>{t("hero.scroll")}</span>
        <div style={{
          width: "1px", height: "40px",
          background: "linear-gradient(to bottom, #3AAFE4, transparent)",
          animation: "scrollPulse 1.8s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes hFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.2; transform: scaleY(0.5); transform-origin: top; }
          50%      { opacity: 1;  transform: scaleY(1);   transform-origin: top; }
        }
      `}</style>
    </section>
  );
}
