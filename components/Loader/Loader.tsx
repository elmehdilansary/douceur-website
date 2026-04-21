// /components/Loader/Loader.tsx — Navy brand loader with tropical progress bar

"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const { t } = useT();
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const root = rootRef.current;
    if (!bar || !root) return;

    let start: number | null = null;
    const duration = 1800;

    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      bar!.style.width = `${eased * 100}%`;
      if (p < 1) { requestAnimationFrame(step); }
      else {
        root!.style.transition = "opacity 0.7s ease";
        root!.style.opacity = "0";
        root!.style.pointerEvents = "none";
        setTimeout(onComplete, 750);
      }
    }
    requestAnimationFrame(step);
  }, [onComplete]);

  return (
    <div ref={rootRef} style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "linear-gradient(160deg, #0D2156 0%, #081640 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "40px",
    }}>
      <div style={{ textAlign: "center" }}>
        <img
          src="/LOGO.png"
          alt="Douceur Maroc"
          style={{
            width: "clamp(240px, 32vw, 380px)",
            height: "auto",
            display: "block",
            margin: "0 auto",
            animation: "loader-logo-in 0.9s cubic-bezier(0.22,1,0.36,1) both",
            filter: "drop-shadow(0 12px 40px rgba(58,175,228,0.35))",
          }}
        />
        <p style={{
          fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
          fontSize: "11px", letterSpacing: "0.32em",
          color: "#3AAFE4", textTransform: "uppercase",
          marginTop: "12px", fontWeight: 700,
        }}>{t("loader.sub")}</p>
      </div>
      <style>{`
        @keyframes loader-logo-in {
          0%   { opacity: 0; transform: scale(0.85) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div style={{ width: "180px", height: "3px", background: "rgba(255,255,255,0.12)", borderRadius: "2px", overflow: "hidden" }}>
        <div ref={barRef} style={{
          height: "100%", width: "0%", borderRadius: "2px",
          background: "linear-gradient(90deg, #3AAFE4, #E8436A, #4CAF7D)",
        }}/>
      </div>
    </div>
  );
}
