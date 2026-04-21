"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { useT } from "@/lib/i18n";

const scrollRef = { value: 0 };

const IMAGES = ["/D1.png", "/D2.png", "/D3.png", "/D4.png"];

const LABEL_KEYS = [
  { t: "scroll.s1.title", s: "scroll.s1.sub" },
  { t: "scroll.s2.title", s: "scroll.s2.sub" },
  { t: "scroll.s3.title", s: "scroll.s3.sub" },
  { t: "scroll.s4.title", s: "scroll.s4.sub" },
];

type Loaded = { tex: THREE.CanvasTexture; aspect: number };

function loadAndClean(url: string, stripWhite: boolean): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let tex: THREE.Texture;
      if (stripWhite) {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = data.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          if (r > 240 && g > 240 && b > 240) d[i + 3] = 0;
        }
        ctx.putImageData(data, 0, 0);
        tex = new THREE.CanvasTexture(canvas);
      } else {
        tex = new THREE.Texture(img);
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      resolve({ tex: tex as THREE.CanvasTexture, aspect: img.naturalWidth / img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

const FLOWER_COLORS = ["#E8436A", "#F4893A", "#3AAFE4", "#4CAF7D", "#8B5CF6", "#F7C948"];

function makeFlowerShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const petals = 6;
  const outer = 0.55;
  const inner = 0.18;
  for (let i = 0; i <= petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    const a2 = ((i + 0.5) / petals) * Math.PI * 2;
    const x1 = Math.cos(a) * inner;
    const y1 = Math.sin(a) * inner;
    const xc = Math.cos(a2) * outer;
    const yc = Math.sin(a2) * outer;
    const x2 = Math.cos(a + Math.PI * 2 / petals) * inner;
    const y2 = Math.sin(a + Math.PI * 2 / petals) * inner;
    if (i === 0) shape.moveTo(x1, y1);
    shape.quadraticCurveTo(xc, yc, x2, y2);
  }
  return shape;
}

function Flowers() {
  const groupRef = useRef<THREE.Group>(null);
  const shape = useMemo(() => makeFlowerShape(), []);
  const geom = useMemo(() => new THREE.ShapeGeometry(shape, 16), [shape]);
  const centerGeom = useMemo(() => new THREE.CircleGeometry(0.12, 24), []);

  const flowers = useMemo(() => {
    let seed = 1;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 12 : 22;
    const arr: { x: number; y: number; z: number; speed: number; phase: number; color: string; scale: number; spin: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.6;
      const radius = 4.5 + rand() * 3.5;
      arr.push({
        x: Math.cos(angle) * radius,
        y: (rand() - 0.5) * 6,
        z: -2 + rand() * 3,
        speed: 0.3 + rand() * 0.6,
        phase: rand() * Math.PI * 2,
        color: FLOWER_COLORS[i % FLOWER_COLORS.length],
        scale: 0.35 + rand() * 0.55,
        spin: (rand() - 0.5) * 0.8,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const sp = scrollRef.value;
    g.rotation.y = sp * Math.PI * 0.6 + t * 0.04;
    g.children.forEach((c, i) => {
      const f = flowers[i];
      if (!f) return;
      c.position.y = f.y + Math.sin(t * f.speed + f.phase) * 0.5;
      c.rotation.z = t * f.spin + f.phase;
      c.rotation.x = Math.sin(t * 0.4 + f.phase) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, f.y, f.z]} scale={f.scale}>
          <mesh geometry={geom}>
            <meshBasicMaterial color={f.color} transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh geometry={centerGeom} position={[0, 0, 0.01]}>
            <meshBasicMaterial color="#F7C948" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const n = isMobile ? 50 : 120;
    const positions = new Float32Array(n * 3);
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (rand() - 0.5) * 18;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = -3 + rand() * 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#3AAFE4" size={0.06} transparent opacity={0.55} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function Scene({ loaded }: { loaded: (Loaded | null)[] }) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const { invalidate: inv, gl } = useThree();
  const count = IMAGES.length;

  useEffect(() => {
    loaded.forEach(l => {
      if (l) l.tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    });
    inv();
  }, [loaded, gl, inv]);

  useEffect(() => {
    const id = setInterval(() => inv(), 40);
    return () => clearInterval(id);
  }, [inv]);

  useFrame((state) => {
    const sp = scrollRef.value;
    const t = state.clock.elapsedTime;
    const float = Math.sin(t * 0.8) * 0.08;
    const denom = Math.max(1, count - 1);

    for (let i = 0; i < count; i++) {
      const g = groupRefs.current[i];
      if (!g) continue;
      const centerAt = i / denom;
      const distance = (sp - centerAt) * denom;
      const abs = Math.abs(distance);
      const sign = Math.sign(distance) || 1;

      const slideX = -distance * 7;
      const yArc = -Math.pow(abs, 2) * 1.8 + Math.sin(t * 0.9 + i) * 0.12;
      const rotY = distance * Math.PI * 0.55;
      const rotX = -abs * 0.35 * sign * 0.4 + Math.sin(t * 0.7 + i * 1.3) * 0.05;
      const rotZ = distance * 0.22 + Math.sin(t * 0.6 + i * 0.8) * 0.04;
      const scale = abs > 1.15 ? 0.01 : THREE.MathUtils.clamp(1 - abs * 0.32, 0.3, 1);
      const posZ = -abs * 1.6 + Math.sin(t * 0.5 + i) * 0.05;
      const visible = abs < 1.1;

      g.position.x += (slideX - g.position.x) * 0.14;
      g.position.y += ((yArc + float) - g.position.y) * 0.1;
      g.position.z += (posZ - g.position.z) * 0.14;
      g.rotation.y += (rotY - g.rotation.y) * 0.12;
      g.rotation.x += (rotX - g.rotation.x) * 0.1;
      g.rotation.z += (rotZ - g.rotation.z) * 0.1;
      g.scale.x += (scale - g.scale.x) * 0.14;
      g.scale.y += (scale - g.scale.y) * 0.14;
      g.scale.z += (scale - g.scale.z) * 0.14;
      g.visible = visible;
    }
  });

  return (
    <>
      {IMAGES.map((url, i) => {
        const info = loaded[i];
        const aspect = info?.aspect ?? 1.6;
        const H = 6.2;
        const W = H * aspect;
        const initX = -(i / Math.max(1, count - 1)) * 7;
        return (
          <group key={url} ref={el => { groupRefs.current[i] = el; }} position={[initX, 0, 0]}>
            <mesh>
              <planeGeometry args={[W, H]} />
              <meshBasicMaterial
                map={info?.tex ?? null}
                color={info ? "#ffffff" : "#3AAFE4"}
                side={THREE.DoubleSide}
                toneMapped={false}
                transparent={url.endsWith(".png")}
                alphaTest={url.endsWith(".png") ? 0.5 : 0}
              />
            </mesh>
          </group>
        );
      })}
      {/* Depth rings behind */}
      {[4.3, 4.8, 5.4].map((r, ri) => (
        <mesh key={ri} position={[0, 0, -0.8 - ri * 0.3]} rotation={[0, 0, (ri * Math.PI) / 6]}>
          <ringGeometry args={[r, r + 0.04, 96]} />
          <meshBasicMaterial
            color={ri === 1 ? "#E8436A" : "#3AAFE4"}
            transparent
            opacity={0.22 - ri * 0.06}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      <Flowers />
      <Dust />
    </>
  );
}

export default function ScrollScene3D() {
  const { t } = useT();
  const LABELS = LABEL_KEYS.map(k => ({ title: t(k.t), sub: t(k.s) }));
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loaded, setLoaded] = useState<(Loaded | null)[]>(() => IMAGES.map(() => null));

  useEffect(() => {
    let cancelled = false;
    IMAGES.forEach((url, i) => {
      loadAndClean(url, false).then(info => {
        if (cancelled) return;
        setLoaded(prev => {
          const next = [...prev];
          next[i] = info;
          return next;
        });
        invalidate();
      }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = stickyRef.current;
        if (!el) { ticking = false; return; }
        const rect = el.parentElement!.getBoundingClientRect();
        const total = el.parentElement!.offsetHeight - window.innerHeight;
        const raw = Math.max(0, Math.min(-rect.top / total, 1));
        scrollRef.value = raw;
        invalidate();

        const count = IMAGES.length;
        const denom = Math.max(1, count - 1);
        const activeIdx = Math.round(raw * denom);

        IMAGES.forEach((_, i) => {
          const p = panelRefs.current[i];
          if (!p) return;
          const centerAt = i / denom;
          const dist = Math.abs(raw - centerAt) * denom;
          const opacity = Math.max(0, 1 - dist * 1.8);
          p.style.opacity = String(opacity);
          p.style.transform = `translateX(-50%) translateY(${(1 - opacity) * 20}px)`;
        });

        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          d.style.opacity = i === activeIdx ? "1" : "0.3";
          d.style.transform = i === activeIdx ? "scale(1.5)" : "scale(1)";
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="scroll-scene-section" style={{
      position: "relative", height: "500vh",
      background: "linear-gradient(180deg,#060f2a 0%,#0D2156 40%,#060f2a 100%)",
    }}>
      <div ref={stickyRef} style={{
        position: "sticky", top: 0,
        width: "100%", height: "100vh",
        overflow: "hidden", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, typeof window !== "undefined" && window.innerWidth < 768 ? 12.5 : 6.5], fov: 45 }}
            dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
            frameloop="demand"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ width: "100%", height: "100%" }}
          >
            <Scene loaded={loaded} />
          </Canvas>
        </div>

        {LABELS.map((p, i) => (
          <div
            key={i}
            ref={el => { panelRefs.current[i] = el; }}
            style={{
              position: "absolute",
              bottom: typeof window !== "undefined" && window.innerWidth < 768 ? "18%" : "12%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              opacity: i === 0 ? 1 : 0,
              pointerEvents: "none",
              width: "min(620px, 85vw)",
            }}
          >
            <h2 style={{
              fontFamily: "var(--font-pacifico, cursive)",
              fontSize: "clamp(24px, 8vw, 62px)",
              color: "#fff",
              textShadow: "0 0 60px rgba(58,175,228,0.4)",
              lineHeight: 1.1, marginBottom: "8px",
            }}>{p.title}</h2>
            <p style={{
              fontFamily: "var(--font-nunito, sans-serif)",
              fontSize: "clamp(13px, 1.4vw, 17px)",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
            }}>{p.sub}</p>
          </div>
        ))}

        <div style={{
          position: "absolute", right: "clamp(16px, 4vw, 48px)", top: "50%",
          transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: "14px",
        }}>
          {IMAGES.map((_, i) => (
            <div key={i} ref={el => { dotRefs.current[i] = el; }} style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#3AAFE4",
              opacity: i === 0 ? 1 : 0.3,
              transition: "opacity 0.35s ease, transform 0.35s ease",
              boxShadow: "0 0 10px #3AAFE4",
            }} />
          ))}
        </div>

        <div style={{
          position: "absolute", bottom: "3%", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          opacity: 0.35, pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--font-nunito,sans-serif)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#fff" }}>Scroll</span>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom,#3AAFE4,transparent)" }} />
        </div>
      </div>
    </section>
  );
}
