// /components/Contact/ContactForm.tsx — Navy contact form with tropical accent inputs

"use client";

import { useRef, useState } from "react";
import BotanicalBackground from "@/components/BotanicalBackground";
import type { BotanicalVariant } from "@/components/BotanicalBackground";
import AnimateHeading from "@/components/AnimateHeading";
import { useT } from "@/lib/i18n";

const CONTACT_BOTANICALS: Array<{
  variant: BotanicalVariant; top?: string; bottom?: string; left?: string; right?: string;
  size?: number; opacity?: number; rotation?: number;
}> = [
  { variant: "monstera-blue", top: "5%",    left: "2%",   size: 180, opacity: 0.10, rotation: -25 },
  { variant: "palm",          bottom: "5%", right: "2%",  size: 160, opacity: 0.10, rotation: -10 },
];

type FormStatus = "idle" | "loading" | "success" | "error";

function Field({ id, label, type = "text", required, value, onChange, as, options, color, optionalLabel }: {
  id: string; label: string; type?: string; required?: boolean;
  value: string; onChange: (v: string) => void;
  as?: "textarea" | "select"; options?: string[]; color: string; optionalLabel: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const base: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? color : "rgba(255,255,255,0.12)"}`,
    borderRadius: "12px", outline: "none",
    fontFamily: "var(--font-nunito, sans-serif)",
    fontSize: "15px", fontWeight: 400, color: "#fff",
    padding: "20px 16px 8px",
    transition: "border-color 0.3s ease, background 0.3s ease",
    resize: "none", appearance: "none", WebkitAppearance: "none",
    backdropFilter: "none",
  };

  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <label htmlFor={id} style={{
        position: "absolute", left: "16px",
        top: floated ? "6px" : "16px",
        fontSize: floated ? "10px" : "14px",
        letterSpacing: floated ? "0.15em" : "0",
        textTransform: floated ? "uppercase" : "none",
        color: focused ? color : "rgba(255,255,255,0.45)",
        transition: "all 0.3s ease", pointerEvents: "none", fontWeight: 700,
        fontFamily: "var(--font-nunito, sans-serif)",
      }}>
        {label}{!required && <span style={{ opacity: 0.5, marginLeft: "4px", fontSize: "10px" }}>{optionalLabel}</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={id} rows={4} value={value} required={required}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} />
      ) : as === "select" ? (
        <select id={id} value={value} required={required}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, cursor: "pointer" }}>
          <option value="" disabled />
          {options?.map(o => <option key={o} value={o} style={{ background: "#0D2156" }}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type={type} value={value} required={required}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} />
      )}
    </div>
  );
}

export default function ContactForm() {
  const { t } = useT();
  const ROLES = [t("contact.role.distributor"), t("contact.role.reseller"), t("contact.role.individual"), t("contact.role.other")];
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", role: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const COLORS = ["#3AAFE4", "#3AAFE4", "#E8436A", "#4CAF7D", "#8B5CF6", "#F7C948"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.honeypot) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur.");
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", role: "", message: "", honeypot: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Veuillez réessayer.");
    }
  }

  return (
    <section id="contact" className="contact-section" style={{
      background: "linear-gradient(180deg, #0D2156 0%, #081640 100%)",
      padding: "120px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <BotanicalBackground items={CONTACT_BOTANICALS} triggerSelector=".contact-section" />
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "12px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E8436A", marginBottom: "16px", fontWeight: 700 }}>
            {t("contact.eyebrow")}
          </p>
          <AnimateHeading text={t("contact.title")} tag="h2" style={{
            fontFamily: "var(--font-pacifico, cursive)", fontSize: "clamp(30px, 4vw, 52px)", color: "#fff", marginBottom: "16px",
          }} />
          <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            {t("contact.lead2")}
          </p>
        </div>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎉</div>
            <h3 style={{ fontFamily: "var(--font-pacifico, cursive)", fontSize: "28px", color: "#4CAF7D", marginBottom: "12px" }}>{t("contact.sent")}</h3>
            <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>{t("contact.sent.sub")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <input type="text" name="website" value={form.honeypot} onChange={e => set("honeypot")(e.target.value)}
              style={{ position: "absolute", left: "-9999px", opacity: 0 }} tabIndex={-1} autoComplete="off" />
            <Field id="name" label={t("contact.field.name")} required value={form.name} onChange={set("name")} color={COLORS[0]} optionalLabel={t("contact.field.optional")} />
            <Field id="company" label={t("contact.field.company")} value={form.company} onChange={set("company")} color={COLORS[1]} optionalLabel={t("contact.field.optional")} />
            <Field id="email" label={t("contact.field.email")} type="email" required value={form.email} onChange={set("email")} color={COLORS[2]} optionalLabel={t("contact.field.optional")} />
            <Field id="phone" label={t("contact.field.phone")} type="tel" value={form.phone} onChange={set("phone")} color={COLORS[3]} optionalLabel={t("contact.field.optional")} />
            <Field id="role" label={t("contact.field.role")} as="select" required value={form.role} onChange={set("role")} options={ROLES} color={COLORS[4]} optionalLabel={t("contact.field.optional")} />
            <Field id="message" label={t("contact.field.message")} as="textarea" required value={form.message} onChange={set("message")} color={COLORS[5]} optionalLabel={t("contact.field.optional")} />

            {status === "error" && (
              <p style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "13px", color: "#E8436A", marginBottom: "16px", fontWeight: 600 }}>{errorMsg}</p>
            )}

            <button ref={btnRef} type="submit" disabled={status === "loading"} style={{
              width: "100%", padding: "18px",
              background: "linear-gradient(135deg, #E8436A, #8B5CF6)",
              color: "#fff", border: "none", borderRadius: "50px",
              fontFamily: "var(--font-nunito, sans-serif)",
              fontSize: "16px", fontWeight: 800,
              letterSpacing: "0.06em", cursor: status === "loading" ? "wait" : "pointer",
              boxShadow: "0 8px 32px rgba(232,67,106,0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              {status === "loading" ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
