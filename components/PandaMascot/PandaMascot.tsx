"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";

type Zone = {
  at: number;
  msg: string;
  color: string;
  move: "bounce" | "spin" | "flip" | "dance" | "float" | "zoom" | "wave";
};

const ZONE_META: Array<{ at: number; key: string; color: string; move: Zone["move"] }> = [
  { at: 0.00, key: "panda.msg1", color: "#3AAFE4", move: "bounce" },
  { at: 0.12, key: "panda.msg2", color: "#E8436A", move: "wave"   },
  { at: 0.28, key: "panda.msg3", color: "#F4893A", move: "spin"   },
  { at: 0.45, key: "panda.msg4", color: "#8B5CF6", move: "flip"   },
  { at: 0.62, key: "panda.msg5", color: "#4CAF7D", move: "dance"  },
  { at: 0.78, key: "panda.msg6", color: "#F7C948", move: "float"  },
  { at: 0.92, key: "panda.msg7", color: "#3AAFE4", move: "zoom"   },
];

export default function PandaMascot() {
  const { t } = useT();
  const ZONES: Zone[] = ZONE_META.map((z) => ({ at: z.at, msg: t(z.key), color: z.color, move: z.move }));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [speech, setSpeech] = useState(ZONES[0].msg);
  const [accent, setAccent] = useState(ZONES[0].color);
  const [move, setMove] = useState<Zone["move"]>(ZONES[0].move);
  const [mobile, setMobile] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; c: string }[]>([]);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastZone = -1;
    let sparkleId = 0;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const wrap = wrapperRef.current;
        if (!wrap) { ticking = false; return; }

        const scroll = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? scroll / max : 0;

        // Active zone
        let idx = 0;
        for (let i = 0; i < ZONES.length; i++) if (p >= ZONES[i].at) idx = i;
        const zone = ZONES[idx];

        wrap.style.transform = "none";

        // Zone change: new speech + burst of sparkles
        if (idx !== lastZone) {
          lastZone = idx;
          setSpeech(zone.msg);
          setAccent(zone.color);
          setMove(zone.move);

          const burst = Array.from({ length: 10 }, () => ({
            id: ++sparkleId,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            c: zone.color,
          }));
          setSparkles((s) => [...s, ...burst]);
          setTimeout(() => {
            setSparkles((s) => s.filter((sp) => !burst.find((b) => b.id === sp.id)));
          }, 1400);
        }

        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // keep mascot on mobile (scaled down via CSS)

  return (
    <div
      className="panda-wrapper"
      style={{
        position: "fixed",
        right: mobile ? "12px" : "32px",
        bottom: mobile ? "80px" : "32px",
        zIndex: 50,
        pointerEvents: "none",
        width: mobile ? "80px" : "200px",
        height: mobile ? "80px" : "200px",
      }}
    >
      {/* Magical aura rings */}
      <div style={{
        position: "absolute", inset: "-40px",
        borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${accent}, transparent, ${accent}, transparent, ${accent})`,
        animation: "panda-aura 4s linear infinite",
        opacity: 0.35, filter: "blur(18px)",
      }}/>
      <div style={{
        position: "absolute", inset: "-10px",
        borderRadius: "50%",
        border: `2px dashed ${accent}`,
        animation: "panda-ring 8s linear infinite",
        opacity: 0.55,
      }}/>
      <div style={{
        position: "absolute", inset: "-24px",
        borderRadius: "50%",
        border: `1px solid ${accent}`,
        animation: "panda-ring-rev 12s linear infinite",
        opacity: 0.35,
      }}/>

      {/* Sparkle burst */}
      {sparkles.map((s) => (
        <div key={s.id} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: "10px", height: "10px",
          borderRadius: "50%",
          background: s.c,
          boxShadow: `0 0 12px ${s.c}`,
          transform: `translate(${s.x}px, ${s.y}px)`,
          animation: "panda-sparkle 1.4s ease-out forwards",
          pointerEvents: "none",
        }}/>
      ))}

      {/* Speech bubble */}
      <div
        key={speech}
        style={{
          position: "absolute",
          bottom: mobile ? "85px" : "210px",
          right: mobile ? "-8px" : "10px",
          background: `linear-gradient(135deg, #fff, ${accent}22)`,
          color: "#0D2156",
          padding: "12px 20px",
          borderRadius: "22px 22px 4px 22px",
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "14px",
          fontWeight: 800,
          whiteSpace: "nowrap",
          boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 2px ${accent}`,
          animation: "panda-bubble 0.55s cubic-bezier(0.34,1.56,0.64,1)",
          letterSpacing: "0.02em",
        }}
      >
        {speech}
        <div style={{
          position: "absolute",
          right: "22px", bottom: "-10px",
          width: 0, height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "12px solid #fff",
        }}/>
      </div>

      {/* Pulse glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)`,
        animation: "panda-pulse 2.4s ease-in-out infinite",
      }}/>

      {/* Panda wrapper — JS transforms */}
      <div
        ref={wrapperRef}
        className={`panda-move panda-${move}`}
        style={{
          width: mobile ? "80px" : "200px",
          height: mobile ? "80px" : "200px",
          position: "relative",
          transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
          transformOrigin: "center",
          filter: `drop-shadow(0 16px 40px ${accent}aa) drop-shadow(0 0 20px ${accent}77)`,
        }}
      >
        <img
          src="/PANDA.gif"
          alt="Douceur Panda"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes panda-bubble {
          0%   { opacity: 0; transform: translateY(10px) scale(0.75) rotate(-4deg); }
          60%  { transform: translateY(-2px) scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes panda-pulse {
          0%, 100% { transform: scale(0.8);  opacity: 0.6; }
          50%      { transform: scale(1.25); opacity: 0.15; }
        }
        @keyframes panda-aura {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes panda-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes panda-ring-rev {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes panda-sparkle {
          0%   { opacity: 1; transform: translate(0, 0) scale(0); }
          30%  { opacity: 1; transform: translate(var(--dx, 0), var(--dy, 0)) scale(1.4); }
          100% { opacity: 0; transform: translate(calc(var(--dx, 0) * 1.5), calc(var(--dy, 0) * 1.5)) scale(0); }
        }
      `}</style>
    </div>
  );
}
