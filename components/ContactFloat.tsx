"use client";

import { useT } from "@/lib/i18n";

export default function ContactFloat() {
  const { t } = useT();
  return (
    <a
      href="#contact"
      aria-label={t("hero.cta.contact")}
      className="contact-float-pill"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "24px",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 22px",
        background: "linear-gradient(135deg, #E8436A, #F4893A)",
        color: "#fff",
        borderRadius: "50px",
        fontFamily: "var(--font-nunito, sans-serif)",
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textDecoration: "none",
        textTransform: "uppercase",
        boxShadow: "0 10px 32px rgba(232,67,106,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateX(-50%) translateY(-3px) scale(1.04)";
        el.style.boxShadow = "0 16px 44px rgba(232,67,106,0.6), 0 0 0 1px rgba(255,255,255,0.12)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateX(-50%)";
        el.style.boxShadow = "0 10px 32px rgba(232,67,106,0.45), 0 0 0 1px rgba(255,255,255,0.08)";
      }}
    >
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: "#fff", boxShadow: "0 0 10px #fff",
        animation: "panda-pulse 2s ease-in-out infinite",
      }} />
      {t("hero.cta.contact")}
    </a>
  );
}
