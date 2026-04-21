// /components/ProductShowcase/ProductCard3D.tsx — Interactive 3D product card with hover lift and cursor light

"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface ProductCard3DProps {
  textureUrl: string;
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

export default function ProductCard3D({
  textureUrl,
  position,
  onClick,
  isSelected,
}: ProductCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(textureUrl);
  const { pointer, viewport } = useThree();

  const targetY = useRef(position[1]);
  const targetScale = useRef(1);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Lift on hover
    targetY.current = hovered ? position[1] + 0.18 : position[1];
    targetScale.current = isSelected ? 1.08 : hovered ? 1.04 : 1;

    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY.current,
      0.08
    );

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale.current, 0.08)
    );

    // Gentle idle float
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      hovered ? pointer.x * 0.12 : Math.sin(state.clock.elapsedTime * 0.4) * 0.04,
      0.06
    );

    // Cursor-following point light
    if (lightRef.current && hovered) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.1);
    }
  });

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        position={[0, 0, 2]}
        intensity={hovered ? 2 : 0}
        color="#DFC28E"
        distance={4}
      />

      <RoundedBox
        ref={meshRef}
        args={[1.4, 2.0, 0.12]}
        radius={0.04}
        smoothness={4}
        onClick={onClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.05}
          envMapIntensity={0.8}
        />
      </RoundedBox>
    </group>
  );
}
