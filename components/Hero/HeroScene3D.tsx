"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/lib/scrollStore";

/* ── shared mouse ─────────────────────────────────────────────────────── */
const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    invalidate();
  }, { passive: true });
}

/* ── transparent background ──────────────────────────────────────────── */
function ClearAlpha() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearAlpha(0);
    gl.setClearColor(new THREE.Color(0x000000), 0);
  }, [gl]);
  return null;
}

/* ── product image as a floating plane — no box needed ───────────────── */
function ProductPlane() {
  const groupRef = useRef<THREE.Group>(null);
  const mounted  = useRef(false);
  const spRef    = useRef(0);
  const scrollProgress = useScrollStore(s => s.scrollProgress);
  const { invalidate: inv } = useThree();

  /* image is 1024×571 → aspect = 1.792 */
  const ASPECT = 1024 / 571;
  const HEIGHT = 2.6;
  const WIDTH  = HEIGHT * ASPECT; // ~4.66

  const tex = useTexture("/douceur-front.png");
  const { gl } = useThree();
  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    /* eslint-enable react-hooks/immutability */
  }, [tex, gl]);

  /* entry animation */
  useEffect(() => {
    const grp = groupRef.current;
    if (!grp || mounted.current) return;
    mounted.current = true;
    grp.position.y = -5;
    grp.scale.setScalar(0.4);
    const start = performance.now();
    const g = grp;
    function tick(now: number) {
      const t = Math.min((now - start) / 1600, 1);
      const e = 1 - Math.pow(2, -10 * t);
      g.position.y = -5 + 5 * e;
      g.scale.setScalar(0.4 + 0.6 * e);
      inv();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inv]);

  /* idle invalidation for float bob — fires at 24fps via interval, not rAF */
  useEffect(() => {
    const id = setInterval(() => inv(), 42);
    return () => clearInterval(id);
  }, [inv]);

  useFrame((state) => {
    const grp = groupRef.current;
    if (!grp) return;

    spRef.current += (scrollProgress - spRef.current) * 0.055;
    const sp = spRef.current;

    /* idle float */
    const floatY = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;

    /* scroll: rotate Y full 360° + scale down + move back */
    const targetRotY = sp * Math.PI * 2;
    const targetScale = Math.max(0.6, 1 - sp * 0.4);
    const targetZ = -sp * 2;

    grp.rotation.y += (targetRotY - grp.rotation.y) * 0.06;
    grp.position.y  = floatY * (1 - sp);
    grp.position.z  += (targetZ - grp.position.z) * 0.06;
    grp.scale.x += (targetScale - grp.scale.x) * 0.06;
    grp.scale.y += (targetScale - grp.scale.y) * 0.06;
    grp.scale.z += (targetScale - grp.scale.z) * 0.06;

    /* mouse tilt — gentle parallax */
    const mi = Math.max(0, 1 - sp * 4);
    grp.rotation.x += (mouse.y * -0.12 * mi - grp.rotation.x) * 0.05;
    grp.rotation.y += mouse.x * 0.02 * mi;
  });

  return (
    <group ref={groupRef}>
      {/* main product image plane — double sided so it shows when rotating */}
      <mesh>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.3}
          metalness={0.05}
          side={THREE.FrontSide}
          transparent={true}
          alphaTest={0.01}
        />
      </mesh>

      {/* back face — mirrored */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.3}
          metalness={0.05}
          side={THREE.FrontSide}
          transparent={true}
          alphaTest={0.01}
        />
      </mesh>

      {/* thin colored glow ring behind the product */}
      <mesh position={[0, 0, -0.15]}>
        <ringGeometry args={[1.6, 1.65, 64]} />
        <meshBasicMaterial color="#3AAFE4" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[2.1, 2.14, 64]} />
        <meshBasicMaterial color="#E8436A" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── rounded petal flower shape ─────────────────────────────────────── */
function makeFlowerShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const petals = 6;
  const petalLen = 1.0;
  const petalWidth = 0.38;
  for (let p = 0; p < petals; p++) {
    const angle = (p / petals) * Math.PI * 2;
    const tip = new THREE.Vector2(Math.cos(angle) * petalLen, Math.sin(angle) * petalLen);
    const left = new THREE.Vector2(
      Math.cos(angle - Math.PI / petals) * petalWidth,
      Math.sin(angle - Math.PI / petals) * petalWidth,
    );
    const right = new THREE.Vector2(
      Math.cos(angle + Math.PI / petals) * petalWidth,
      Math.sin(angle + Math.PI / petals) * petalWidth,
    );
    if (p === 0) shape.moveTo(left.x, left.y);
    else shape.lineTo(left.x, left.y);
    shape.quadraticCurveTo(tip.x, tip.y, right.x, right.y);
  }
  shape.closePath();
  return shape;
}

/* ── orbiting flowers ────────────────────────────────────────────────── */
function Flowers() {
  const count = 10;
  /* colors sampled directly from the packaging artwork */
  const colors = ["#E8436A","#9B59B6","#3AAFE4","#4CAF7D","#F7C948","#E8436A","#3AAFE4","#9B59B6","#4CAF7D","#F7C948"];
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    radius:    2.4 + (i % 3) * 0.55,
    speed:     0.18 + (i % 5) * 0.06,
    phase:     (i / count) * Math.PI * 2,
    yOff:      [-0.9, 0.7, -0.3, 1.1, -1.1, 0.4, -0.6, 0.9, 0.1, -0.8][i],
    color:     colors[i],
    size:      0.10 + (i % 3) * 0.05,
    spinSpeed: (i % 2 === 0 ? 1 : -1) * 0.35,
  })), []);

  const flowerGeo = useMemo(() => new THREE.ShapeGeometry(makeFlowerShape(), 8), []);
  /* small circle for flower center */
  const centerGeo = useMemo(() => new THREE.CircleGeometry(0.28, 16), []);

  const flowerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const centerRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flowerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      const x = Math.cos(t * d.speed + d.phase) * d.radius;
      const y = d.yOff + Math.sin(t * d.speed * 0.55 + d.phase) * 0.3;
      const z = Math.sin(t * d.speed + d.phase) * 0.4;
      mesh.position.set(x, y, z);
      mesh.rotation.z = t * d.spinSpeed;
      mesh.scale.setScalar(d.size);
      const c = centerRefs.current[i];
      if (c) { c.position.set(x, y, z + 0.001); c.rotation.z = mesh.rotation.z; c.scale.setScalar(d.size); }
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <group key={i}>
          {/* petals */}
          <mesh ref={el => { flowerRefs.current[i] = el; }} geometry={flowerGeo}>
            <meshBasicMaterial color={d.color} side={THREE.DoubleSide} transparent opacity={0.92} />
          </mesh>
          {/* yellow center dot */}
          <mesh ref={el => { centerRefs.current[i] = el; }} geometry={centerGeo}>
            <meshBasicMaterial color="#F7C948" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── minimal lighting ─────────────────────────────────────────────────── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={2.0} color="#ffffff" />
      <directionalLight position={[4, 6, 8]}   intensity={3} color="#fff8f0" />
      <directionalLight position={[-4, 2, -4]}  intensity={1.5} color="#3AAFE4" />
      <pointLight       position={[0, -3, 4]}   intensity={25} color="#E8436A" distance={12} />
    </>
  );
}

/* ── exported canvas ──────────────────────────────────────────────────── */
export default function HeroScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, typeof window !== "undefined" && window.innerWidth < 768 ? 7.8 : 6], fov: 38 }}
      dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
      frameloop="demand"
      performance={{ min: 0.6 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ClearAlpha />
      <Lighting />
      <Flowers />
      <Suspense fallback={null}>
        <ProductPlane />
      </Suspense>
    </Canvas>
  );
}
