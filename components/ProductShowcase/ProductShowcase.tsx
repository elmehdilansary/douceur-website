// /components/ProductShowcase/ProductShowcase.tsx — Scroll-driven pack rotation showing all faces + brand colors

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n";

const PRODUCTS = [
  {
    id: "mouchoirs",
    nameKey: "products.p1.name",
    subtitleKey: "products.p1.subtitle",
    descKey: "products.p1.desc",
    tagKeys: ["products.p1.tag1", "products.p1.tag2", "products.p1.tag3"],
    badgeKey: "products.p1.badge",
    scrollAngle: { rotateY: 0, rotateX: -6, rotate: -4 },
    color: "#3AAFE4",
    bg: "linear-gradient(150deg, #071830 0%, #0D2156 50%, #0a2a5e 100%)",
    accent: "#3AAFE4",
    floatAnim: "float-slow",
    badgeColor: "#E8436A",
    image: undefined as string | undefined,
    images: ["/D1.png", "/D2.png", "/D3.png", "/D4.png"] as readonly string[] | undefined,
  },
  {
    id: "hygienique",
    image: "/PAPIER.png" as string | undefined,
    nameKey: "products.p2.name",
    subtitleKey: "products.p2.subtitle",
    descKey: "products.p2.desc",
    tagKeys: ["products.p2.tag1", "products.p2.tag2", "products.p2.tag3"],
    badgeKey: "products.p2.badge",
    scrollAngle: { rotateY: 32, rotateX: 8, rotate: 6 },
    color: "#4CAF7D",
    bg: "linear-gradient(150deg, #041a10 0%, #0a2e1a 50%, #0d3d22 100%)",
    accent: "#4CAF7D",
    floatAnim: "float-mid",
    badgeColor: "#4CAF7D",
    images: undefined as readonly string[] | undefined,
  },
  {
    id: "lingettes",
    nameKey: "products.p3.name",
    subtitleKey: "products.p3.subtitle",
    descKey: "products.p3.desc",
    tagKeys: ["products.p3.tag1", "products.p3.tag2", "products.p3.tag3"],
    badgeKey: "products.p3.badge",
    scrollAngle: { rotateY: -28, rotateX: -18, rotate: 3 },
    color: "#E8436A",
    bg: "linear-gradient(150deg, #1a0414 0%, #2D0D2E 50%, #3d0f40 100%)",
    accent: "#E8436A",
    floatAnim: "float-fast",
    badgeColor: "#8B5CF6",
    image: "/L.png" as string | undefined,
    images: undefined as readonly string[] | undefined,
  },
] as const;

function ProductCard({ product, index }: { product: typeof PRODUCTS[number]; index: number }) {
  const { t } = useT();
  const ref       = useRef<HTMLDivElement>(null);
  const imgWrap   = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!product.images || product.images.length < 2) return;
    const id = setInterval(() => {
      setSlideIdx(i => (i + 1) % product.images!.length);
    }, 3000);
    return () => clearInterval(id);
  }, [product.images]);
  const { rotateY, rotateX, rotate } = product.scrollAngle;

  // Intersection reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Scroll-driven angle — throttled with rAF, zero re-renders
  useEffect(() => {
    const el = ref.current;
    const img = imgWrap.current;
    if (!el || !img) return;
    let mouseX = 0, mouseY = 0, isHovered = false;
    let ticking = false;

    const applyTransform = (rY: number, rX: number, rZ: number, scale = 1) => {
      img.style.transform = `perspective(700px) rotateY(${rY}deg) rotateX(${rX}deg) rotate(${rZ}deg) scale(${scale})`;
    };

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      const raw  = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      const p    = Math.min(raw * 2.2, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const rY = rotateY * eased + (isHovered ? mouseX : 0);
      const rX = rotateX * eased + (isHovered ? mouseY : 0);
      applyTransform(rY, rX, rotate * eased, isHovered ? 1.06 : 1);
      if (progressBarRef.current) progressBarRef.current.style.width = `${eased * 100}%`;
      if (progressLabelRef.current) progressLabelRef.current.textContent = `${Math.round(eased * 100)}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      isHovered = true;
      onScroll();
    };
    const onLeave = () => { mouseX = 0; mouseY = 0; isHovered = false; onScroll(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [rotateY, rotateX, rotate]);

  return (
    <div
      ref={ref}
      className="product-card"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        direction: isEven ? "ltr" : "rtl",
        gap: "clamp(40px, 6vw, 100px)",
        alignItems: "center",
        padding: "clamp(80px, 10vw, 130px) clamp(24px, 8vw, 130px)",
        background: product.bg,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(80px)",
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
        minHeight: "560px",
      }}
    >
      {/* Large watermark index — animated gradient */}
      <div className="pc-decor" style={{
        position: "absolute",
        top: "50%", [isEven ? "right" : "left"]: "2%",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-pacifico, cursive)",
        fontSize: "clamp(90px, 22vw, 280px)",
        background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}02, ${product.accent}22)`,
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradient-shift 8s ease infinite",
        pointerEvents: "none", userSelect: "none", lineHeight: 1,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Ambient glow — pulsing */}
      <div className="pc-decor" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "800px", height: "800px", borderRadius: "50%",
        background: `radial-gradient(circle, ${product.accent}14 0%, transparent 60%)`,
        animation: "float-slow 7s ease-in-out infinite",
        pointerEvents: "none",
      }}/>

      {/* Orbiting particles — subtle, layered */}
      {[
        { size: 8, radius: 180, dur: 18, delay: 0 },
        { size: 5, radius: 240, dur: 24, delay: -6 },
        { size: 10, radius: 210, dur: 20, delay: -12 },
        { size: 4, radius: 260, dur: 28, delay: -3 },
      ].map((p, pi) => (
        <div key={pi} className="pc-decor" style={{
          position: "absolute", top: "50%", left: "50%",
          width: 0, height: 0,
          animation: `product-orbit ${p.dur}s linear infinite`,
          animationDelay: `${p.delay}s`,
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute",
            left: `${p.radius}px`, top: "-4px",
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: "50%",
            background: product.accent,
            boxShadow: `0 0 12px ${product.accent}, 0 0 24px ${product.accent}80`,
            opacity: 0.7,
          }}/>
        </div>
      ))}

      {/* Shimmer sweep on reveal */}
      <div className="pc-decor" style={{
        position: "absolute", top: 0, bottom: 0,
        left: "-100%", width: "60%",
        background: `linear-gradient(90deg, transparent 0%, ${product.accent}18 50%, transparent 100%)`,
        transform: "skewX(-20deg)",
        animation: visible ? `card-shimmer 2.2s ${index * 0.15 + 0.4}s ease-out forwards` : "none",
        pointerEvents: "none",
      }}/>

      {/* ── IMAGE SIDE ── */}
      <div style={{ direction: "ltr", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", position: "relative", zIndex: 1 }}>

        {/* Static halo rings — no animation */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[1.15, 1.55, 1.9].map((scale, ri) => (
            <div key={ri} className="pc-decor" style={{
              position: "absolute",
              width: `min(${scale * 340}px, ${scale * 75}vw)`,
              height: `min(${scale * 340}px, ${scale * 75}vw)`,
              borderRadius: "50%",
              border: `1px ${ri === 1 ? "dashed" : "solid"} ${product.accent}${["28","14","0a"][ri]}`,
              animation: `spin-slow ${30 + ri * 14}s linear infinite ${ri % 2 === 0 ? "" : "reverse"}`,
            }}/>
          ))}
          {/* Arc highlight — rotating gradient ring */}
          <div className="pc-decor" style={{
            position: "absolute",
            width: "min(400px, 88vw)", height: "min(400px, 88vw)", borderRadius: "50%",
            background: `conic-gradient(from 0deg, transparent 0%, ${product.accent}55 12%, transparent 25%)`,
            mask: "radial-gradient(circle, transparent 48%, black 49%, black 50%, transparent 51%)",
            WebkitMask: "radial-gradient(circle, transparent 48%, black 49%, black 50%, transparent 51%)",
            animation: "spin-slow 12s linear infinite",
            pointerEvents: "none",
          }}/>

          {/* THE PACK */}
          <div
            ref={imgWrap}
            style={{
              filter: `drop-shadow(0 30px 50px rgba(0,0,0,0.6))`,
              position: "relative", zIndex: 2,
            }}
          >
            <div className={product.floatAnim} style={{ display: "block" }}>
              {product.images && product.images.length > 0 ? (
                <div className="pc-carousel" style={{
                  position: "relative",
                  width: "min(680px, 88vw)",
                  aspectRatio: "680 / 780",
                  perspective: "1600px",
                  overflow: "hidden",
                }}>
                  {/* Pulsing color burst behind active slide */}
                  <div
                    key={`burst-${slideIdx}`}
                    style={{
                      position: "absolute", inset: "10%",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${product.accent}55 0%, transparent 65%)`,
                      animation: "slide-burst 1.4s ease-out",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                  {product.images.map((src, i) => {
                    const total = product.images!.length;
                    const diff = (i - slideIdx + total) % total;
                    const isActive = diff === 0;
                    const isNext = diff === 1;
                    const isPrev = diff === total - 1;

                    let transform = "translate3d(0,0,-400px) rotateY(90deg) scale(0.7)";
                    let opacity = 0;
                    let zIndex = 0;
                    if (isActive) {
                      transform = "translate3d(0,0,0) rotateY(0deg) scale(1)";
                      opacity = 1;
                      zIndex = 3;
                    } else if (isNext) {
                      transform = "translate3d(40%,0,-200px) rotateY(-40deg) scale(0.8)";
                      opacity = 0.25;
                      zIndex = 2;
                    } else if (isPrev) {
                      transform = "translate3d(-40%,0,-200px) rotateY(40deg) scale(0.8)";
                      opacity = 0.25;
                      zIndex = 2;
                    }

                    return (
                      <Image
                        key={src}
                        src={src}
                        alt={t(product.nameKey)}
                        width={680}
                        height={780}
                        priority={index === 0 && i === 0}
                        className={isActive ? "pc-slide pc-slide-active" : "pc-slide"}
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "contain",
                          display: "block",
                          opacity,
                          zIndex,
                          transform,
                          transformStyle: "preserve-3d",
                          transformOrigin: "center center",
                          transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease",
                          filter: isActive
                            ? `drop-shadow(0 20px 40px ${product.accent}88)`
                            : "blur(2px) grayscale(0.2)",
                        }}
                      />
                    );
                  })}

                  {/* Slide dots */}
                  <div style={{
                    position: "absolute", bottom: "-28px", left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex", gap: "8px", zIndex: 5,
                  }}>
                    {product.images.map((_, i) => (
                      <div key={i} style={{
                        width: slideIdx === i ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        background: slideIdx === i ? product.accent : "rgba(255,255,255,0.25)",
                        boxShadow: slideIdx === i ? `0 0 12px ${product.accent}` : "none",
                        transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                      }}/>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  position: "relative",
                  width: "min(680px, 88vw)",
                  aspectRatio: "680 / 780",
                  perspective: "1400px",
                }}>
                  {/* Rotating conic spotlight */}
                  <div style={{
                    position: "absolute", inset: "-8%",
                    borderRadius: "50%",
                    background: `conic-gradient(from 0deg, transparent 0%, ${product.accent}55 20%, transparent 40%, ${product.accent}33 60%, transparent 80%)`,
                    animation: "spin-slow 14s linear infinite",
                    filter: "blur(28px)",
                    opacity: 0.7,
                    zIndex: 0,
                  }}/>

                  {/* Breathing inner glow */}
                  <div style={{
                    position: "absolute", inset: "15%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${product.accent}66 0%, transparent 70%)`,
                    animation: "panda-pulse 3.2s ease-in-out infinite",
                    zIndex: 0,
                  }}/>

                  {/* Orbiting sparkles */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      width: 0, height: 0,
                      animation: `product-orbit ${10 + i * 3}s linear infinite`,
                      animationDelay: `${-i * 1.6}s`,
                      zIndex: 1,
                    }}>
                      <div style={{
                        position: "absolute",
                        left: `${150 + i * 18}px`,
                        top: "-4px",
                        width: `${6 + (i % 2) * 4}px`,
                        height: `${6 + (i % 2) * 4}px`,
                        borderRadius: "50%",
                        background: product.accent,
                        boxShadow: `0 0 14px ${product.accent}, 0 0 28px ${product.accent}aa`,
                      }}/>
                    </div>
                  ))}

                  {/* The pack — slow spin + breathing */}
                  <div style={{
                    position: "relative",
                    width: "100%", height: "100%",
                    transformStyle: "preserve-3d",
                    animation: "pack-showcase 9s ease-in-out infinite",
                    zIndex: 2,
                  }}>
                    <Image
                      src={product.image ?? "/product.png"}
                      alt={t(product.nameKey)}
                      width={680}
                      height={780}
                      priority={index === 0}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        filter: `drop-shadow(0 30px 50px ${product.accent}77) drop-shadow(0 0 30px ${product.accent}55)`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll hint on first card — desktop only */}
        {index === 0 && (
          <p className="pc-scroll-hint" style={{
            fontFamily: "var(--font-nunito, sans-serif)",
            fontSize: "11px", color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.15em", textTransform: "uppercase",
            fontWeight: 600, marginTop: "8px",
          }}>
            Scroll pour découvrir toutes les faces ↓
          </p>
        )}
      </div>

      {/* ── TEXT SIDE ── */}
      <div style={{ direction: "ltr", position: "relative", zIndex: 1 }}>
        <span style={{
          display: "inline-block",
          background: `${product.badgeColor}22`,
          color: product.badgeColor,
          border: `1px solid ${product.badgeColor}55`,
          borderRadius: "50px", padding: "6px 18px",
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "12px", fontWeight: 800,
          letterSpacing: "0.08em", marginBottom: "24px",
        }}>
          {t(product.badgeKey)}
        </span>

        <h3 style={{
          fontFamily: "var(--font-pacifico, cursive)",
          fontSize: "clamp(36px, 5vw, 64px)",
          color: "#fff", lineHeight: 1.1, marginBottom: "10px",
        }}>
          {t(product.nameKey)}
        </h3>

        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "clamp(12px, 1vw, 14px)", fontWeight: 800,
          color: product.accent, letterSpacing: "0.14em",
          textTransform: "uppercase", marginBottom: "20px",
        }}>
          {t(product.subtitleKey)}
        </p>

        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "clamp(14px, 1.2vw, 17px)", fontWeight: 400,
          color: "rgba(255,255,255,0.6)", lineHeight: 1.85,
          marginBottom: "32px", maxWidth: "400px",
        }}>
          {t(product.descKey)}
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          {product.tagKeys.map((tagKey, ti) => (
            <span
              key={tagKey}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${product.accent}38`;
                el.style.transform = "translateY(-3px) scale(1.05)";
                el.style.boxShadow = `0 10px 24px ${product.accent}55`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${product.accent}18`;
                el.style.transform = "none";
                el.style.boxShadow = "none";
              }}
              style={{
                background: `${product.accent}18`,
                color: product.accent,
                border: `1.5px solid ${product.accent}44`,
                borderRadius: "50px", padding: "8px 20px",
                fontFamily: "var(--font-nunito, sans-serif)",
                fontSize: "13px", fontWeight: 700,
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(14px)",
                transition: `opacity 0.6s ease ${0.5 + ti * 0.12}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + ti * 0.12}s, background 0.3s ease, box-shadow 0.3s ease`,
                cursor: "default",
                display: "inline-block",
              }}
            >{t(tagKey)}</span>
          ))}
        </div>

        {/* Animated progress bar showing scroll-driven reveal */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
            <span ref={progressLabelRef} style={{ fontFamily: "var(--font-nunito, sans-serif)", fontSize: "10px", color: product.accent, fontWeight: 700 }}>0%</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
            <div ref={progressBarRef} style={{
              height: "100%", width: "0%",
              background: `linear-gradient(90deg, ${product.accent}, ${product.badgeColor})`,
              borderRadius: "2px",
            }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const { t } = useT();
  return (
    <section id="products" style={{ background: "#081640" }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "100px 24px 56px",
        background: "linear-gradient(180deg, #081640 0%, #0a1f4e 100%)",
      }}>
        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)", fontSize: "12px",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "#E8436A", marginBottom: "16px", fontWeight: 800,
        }}>{t("products.eyebrow")}</p>
        <h2 style={{
          fontFamily: "var(--font-pacifico, cursive)",
          fontSize: "clamp(32px, 5vw, 64px)", color: "#fff", marginBottom: "20px",
        }}>
          {t("products.title")}
        </h2>
        <p style={{
          fontFamily: "var(--font-nunito, sans-serif)",
          fontSize: "clamp(14px, 1.3vw, 17px)", fontWeight: 400,
          color: "rgba(255,255,255,0.5)", maxWidth: "500px",
          margin: "0 auto", lineHeight: 1.8,
        }}>
          {t("products.lead")}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "36px" }}>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, transparent, #3AAFE4)" }}/>
          <span style={{ fontSize: "18px" }}>🌺</span>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, #3AAFE4, transparent)" }}/>
        </div>
      </div>

      {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </section>
  );
}
