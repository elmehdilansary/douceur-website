// /components/Hero/HeroCanvas.tsx — React Three Fiber 3D scene with tissue box model and studio lighting

"use client";

import { Component, Suspense, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

// Error boundary catches useGLTF 404 and renders the placeholder box instead
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function TissueBoxModel() {
  const { scene } = useGLTF("/models/tissue-box.glb");

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 0.6;
      }
    }
  });

  return <primitive object={scene} scale={1.8} position={[0, -0.2, 0]} />;
}

function FallbackBox() {
  return (
    <group>
      {/* Box body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.0, 1.8]} />
        <meshStandardMaterial color="#F0E8E0" roughness={0.3} metalness={0.04} />
      </mesh>
      {/* Gold accent band */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.42, 0.06, 1.82]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.25} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.42, 0.06, 1.82]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.25} metalness={0.3} />
      </mesh>
    </group>
  );
}

function SceneFallback() {
  return (
    <Html center>
      <div
        style={{
          color: "#C9A96E",
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Loading…
      </div>
    </Html>
  );
}

export default function HeroCanvas() {
  const controlsRef = useRef(null);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 38 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: "transparent" }}
    >
      {/* 3-point studio lighting */}
      <rectAreaLight
        position={[3, 3, 3]}
        width={4}
        height={4}
        intensity={6}
        color="#FFF5E0"
        lookAt={[0, 0, 0] as unknown as THREE.Vector3}
      />
      <rectAreaLight
        position={[-3, 2, 1]}
        width={3}
        height={3}
        intensity={3}
        color="#F0E8E0"
        lookAt={[0, 0, 0] as unknown as THREE.Vector3}
      />
      <rectAreaLight
        position={[0, -2, -3]}
        width={2}
        height={2}
        intensity={1.5}
        color="#C9A96E"
        lookAt={[0, 0, 0] as unknown as THREE.Vector3}
      />
      <ambientLight intensity={0.3} color="#FAF7F2" />

      <Environment preset="studio" />

      <ModelErrorBoundary fallback={<FallbackBox />}>
        <Suspense fallback={<SceneFallback />}>
          <TissueBoxModel />
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
