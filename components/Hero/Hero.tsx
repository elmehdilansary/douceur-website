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
  const [isDesktop, setIsDesktop] = useState(false);
  const setScrollProgress = useScrollStore(s => s.setScrollProgress);
  const scrollProgress = useScrollStore(s => s.scrollProgress);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "300px" });
    obs.observe(sectionRef.current);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", checkSize);
    };
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
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100svh",
        overflow: "visible", // Ensure 3D doesn't clip
        background: "#060f2a",
        display: isDesktop ? "grid" : "flex",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
        flexDirection: isDesktop ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isDesktop ? "0 clamp(40px, 8vw, 140px)" : "60px 20px",
        textAlign: isDesktop ? "left" : "center",
      }}
    >
      {/* Dynamic Background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: isDesktop 
          ? "linear-gradient(135deg, #060f2a 0%, #0D2156 50%, #060f2a 100%)" 
          : "radial-gradient(circle at center, #0D2156 0%, #060f2a 100%)",
      }} />

      {/* ── CONTENT COLUMN ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: isDesktop ? "flex-start" : "center",
        width: "100%",
        maxWidth: isDesktop ? "650px" : "400px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(58,175,228,0.12)",
          border: "1px solid rgba(58,175,228,0.25)",
          borderRadius: "50px", padding: "8px 24px",
          marginBottom: "24px",
          animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 10px #3AAFE4" }} />
          <span style={{
            fontFamily: "var(--font-nunito, sans-serif)",
            fontSize: "11px", fontWeight: 800,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#3AAFE4",
          }}>{t("hero.eyebrow")}</span>
        </div>

        <div style={{
          marginBottom: "24px",
          animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both",
        }}>
          <img
            src="/LOGO.png"
            alt="Douceur"
            width={340} height={120}
            style={{
              width: isDesktop ? "clamp(260px, 25vw, 380px)" : "220px",
              height: "auto",
              filter: "drop-shadow(0 0 50px rgba(58,175,228,0.3))",
            }}
          />
        </div>

        <div style={{
          marginBottom: "32px",
          animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.3s both",
        }}>
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)",
            fontSize: isDesktop ? "19px" : "15px",
            fontWeight: 400, color: "rgba(255,255,255,0.85)", lineHeight: 1.6,
            marginBottom: "8px",
          }}>
            {t("hero.tagline")}
          </p>
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)",
            fontSize: isDesktop ? "15px" : "12px",
            fontWeight: 400, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em",
          }}>
             600 feuilles · 3 plis · Hypoallergénique
          </p>
        </div>

        {!isDesktop && (
          <div style={{ 
            width: "100%", height: "260px", 
            margin: "-30px 0 -10px",
            animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.4s both" 
          }}>
            {inView && <HeroScene3D />}
          </div>
        )}

        <div style={{
          display: "flex", gap: "14px",
          flexDirection: isDesktop ? "row" : "column",
          width: isDesktop ? "auto" : "100%",
          marginBottom: "40px",
          animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s both",
        }}>
          <a href="#manifesto" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "16px 42px",
            background: "linear-gradient(135deg, #E8436A, #F4893A)",
            color: "#fff", borderRadius: "50px",
            fontFamily: "var(--font-nunito, sans-serif)", fontWeight: 800,
            fontSize: "14px", letterSpacing: "0.05em", textDecoration: "none",
            boxShadow: "0 8px 30px rgba(232,67,106,0.3)",
          }}>
            {t("hero.cta.discover")}
          </a>
          {!isDesktop && (
            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "16px 42px",
              background: "rgba(255,255,255,0.06)",
              color: "#fff", border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "50px",
              fontFamily: "var(--font-nunito, sans-serif)", fontWeight: 700,
              fontSize: "14px", letterSpacing: "0.05em", textDecoration: "none",
              backdropFilter: "blur(12px)",
            }}>
              {t("hero.cta.contact")}
            </a>
          )}
        </div>

        <div style={{
          display: "flex", gap: "12px",
          animation: "hFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both",
        }}>
          {[
            { n: "600", label: t("hero.stat.sheets") },
            { n: "3",   label: t("hero.stat.plies") },
            { n: "100%",label: t("hero.stat.natural") },
          ].map(({ n, label }) => (
            <div key={label} style={{
              background: "rgba(58,175,228,0.08)",
              border: "1px solid rgba(58,175,228,0.22)",
              borderRadius: "14px",
              padding: "12px 18px",
              minWidth: "90px",
              textAlign: "center",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #E8436A, #F4893A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-nunito, sans-serif)",
              }}>{n}</div>
              <div style={{
                fontSize: "8px", fontWeight: 800, color: "#E8436A",
                letterSpacing: "0.15em", marginTop: "2px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP PRODUCT SHOWCASE ── */}
      {isDesktop && (
        <div className="hero-product-container" style={{ 
          position: "relative", 
          width: "100%", 
          height: "100%",
          maxHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "hFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both",
        }}>
          {inView && <HeroScene3D />}
        </div>
      )}

      {/* Seamless Transition Mask */}
      <div style={{
        position: "absolute", bottom: "-1px", left: 0, right: 0,
        height: "200px", zIndex: 20, pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent, #060f2a)",
      }} />

      <style>{`
        @keyframes hFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
