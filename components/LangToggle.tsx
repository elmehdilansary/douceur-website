"use client";

import { useT } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang, t } = useT();
  return (
    <button
      onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
      aria-label="Switch language"
      className="lang-toggle-pill"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        padding: "10px 18px",
        borderRadius: "50px",
        background: "rgba(13,33,86,0.85)",
        border: "1px solid rgba(58,175,228,0.4)",
        color: "#fff",
        fontFamily: "var(--font-nunito, sans-serif)",
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "0.08em",
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(58,175,228,0.15)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(58,175,228,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(58,175,228,0.15)";
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3AAFE4", boxShadow: "0 0 8px #3AAFE4" }}/>
      {t("lang.switch")}
    </button>
  );
}
