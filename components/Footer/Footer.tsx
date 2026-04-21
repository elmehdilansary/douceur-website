"use client";

import { useT } from "@/lib/i18n";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.57a8.16 8.16 0 0 0 4.77 1.52V6.69a4.85 4.85 0 0 1-1.84 0z"/>
  </svg>
);

export default function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  /* Marquee words — no emoji, SVG dots instead */
  const words = ["Douceur", "·", "Extra Doux", "·", "Maroc", "·"];

  return (
    <footer style={{ background: "#040E2E", overflow: "hidden" }}>

      {/* ── Marquee ── */}
      <div style={{ paddingBlock: "48px", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...words, ...words, ...words, ...words].map((w, i) => (
            <span key={i} style={{
              fontFamily: w === "·" ? "sans-serif" : "var(--font-pacifico, cursive)",
              fontSize: w === "·" ? "24px" : "clamp(28px, 4vw, 48px)",
              color: ["#3AAFE4", "#E8436A", "#4CAF7D", "#F7C948", "#8B5CF6"][i % 5],
              opacity: w === "·" ? 0.15 : 0.22,
              whiteSpace: "nowrap",
              paddingInline: w === "·" ? "clamp(12px, 2vw, 24px)" : "clamp(16px, 3vw, 40px)",
              letterSpacing: "0.02em",
            }}>{w}</span>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="footer-grid" style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "72px clamp(24px, 6vw, 80px) 48px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "start",
        gap: "48px",
      }}>

        {/* Left — Social */}
        <div>
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "10px",
            letterSpacing: "0.26em", textTransform: "uppercase",
            color: "#3AAFE4", marginBottom: "16px", fontWeight: 800,
          }}>{t("footer.follow")}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { href: "https://www.instagram.com/douceur.maroc", label: "@douceur.maroc", color: "#E8436A", icon: <InstagramIcon /> },
              { href: "https://www.facebook.com/665515589976766", label: "Facebook", color: "#3AAFE4", icon: <FacebookIcon /> },
              { href: "https://www.tiktok.com/@douceur.maroc", label: "@douceur.maroc", color: "#8B5CF6", icon: <TikTokIcon /> },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = s.color;
                  el.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "rgba(255,255,255,0.5)";
                  el.style.transform = "none";
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  textDecoration: "none", color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-nunito, sans-serif)", fontSize: "14px",
                  fontWeight: 600,
                  transition: "color 0.25s ease, transform 0.25s ease",
                }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: `${s.color}1a`,
                  border: `1px solid ${s.color}33`,
                  color: s.color,
                }}>
                  {s.icon}
                </span>
                {s.label}
              </a>
            ))}
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "13px",
            color: "rgba(255,255,255,0.25)", marginTop: "32px", lineHeight: 1.6,
            maxWidth: "220px",
          }}>
            {t("footer.tagline")}
          </p>
        </div>

        {/* Center — Wordmark */}
        <div style={{ textAlign: "center" }}>
          <img
            src="/LOGO.png"
            alt="Douceur Maroc"
            style={{
              width: "clamp(200px, 22vw, 280px)",
              height: "auto",
              display: "block",
              margin: "0 auto",
              filter: "drop-shadow(0 8px 30px rgba(58,175,228,0.25))",
            }}
          />
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "9px",
            letterSpacing: "0.36em", textTransform: "uppercase",
            color: "#3AAFE4", marginTop: "8px", fontWeight: 800,
          }}>{t("loader.sub")}</p>

          {/* Quality badges */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
            {[t("footer.badge1"), t("footer.badge2"), t("footer.badge3")].map((b, i) => (
              <span key={b} style={{
                fontFamily: "var(--font-nunito, sans-serif)", fontSize: "9px",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: ["#3AAFE4", "#E8436A", "#4CAF7D"][i],
                background: [`rgba(58,175,228,0.08)`, `rgba(232,67,106,0.08)`, `rgba(76,175,125,0.08)`][i],
                border: [`1px solid rgba(58,175,228,0.2)`, `1px solid rgba(232,67,106,0.2)`, `1px solid rgba(76,175,125,0.2)`][i],
                borderRadius: "50px", padding: "4px 10px",
              }}>{b}</span>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "12px",
            color: "rgba(255,255,255,0.25)", marginTop: "20px", lineHeight: 1.6,
          }}>
            {t("footer.subtitle").split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
        </div>

        {/* Right — Contact */}
        <div className="footer-right" style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "var(--font-nunito, sans-serif)", fontSize: "10px",
            letterSpacing: "0.26em", textTransform: "uppercase",
            color: "#4CAF7D", marginBottom: "16px", fontWeight: 800,
          }}>{t("footer.contact")}</p>

          <a
            href="#contact"
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#4CAF7D";
              el.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "rgba(255,255,255,0.5)";
              el.style.transform = "none";
            }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              textDecoration: "none", color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-nunito, sans-serif)", fontSize: "14px",
              fontWeight: 600, flexDirection: "row-reverse",
              transition: "color 0.25s ease, transform 0.25s ease",
            }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(76,175,125,0.1)",
              border: "1px solid rgba(76,175,125,0.2)",
              fontSize: "16px",
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            {t("footer.write")}
          </a>

          {/* Location */}
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
              {t("footer.madein")}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4CAF7D", boxShadow: "0 0 8px #4CAF7D" }}/>
              <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                {t("footer.withlove")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "20px clamp(24px, 6vw, 80px)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px",
          color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em",
        }}>
          © {year} Douceur Maroc. {t("footer.rights")}
        </p>
        {/* Three dots decoration */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["#3AAFE4", "#E8436A", "#4CAF7D"].map(c => (
            <div key={c} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: c, opacity: 0.4,
            }}/>
          ))}
        </div>
        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)", fontSize: "11px",
          color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em",
        }}>
          {t("footer.bottom")}
        </p>
      </div>
    </footer>
  );
}
