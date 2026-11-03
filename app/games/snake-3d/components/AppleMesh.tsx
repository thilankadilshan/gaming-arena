'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AppleMeshProps {
  position: [number, number, number];
}

export default function AppleMesh({ position }: AppleMeshProps) {
  const appleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (appleRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle organic floating bob & gentle spin
      appleRef.current.position.y = position[1] + 0.42 + Math.sin(t * 3.5) * 0.08;
      appleRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Industrial Base Plate Under Apple (Like in reference photo) */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[0.95, 0.08, 0.95]} />
        <meshStandardMaterial color="#382218" roughness={0.7} metalness={0.6} />
      </mesh>
      {/* Corner Bolts on plate */}
      {[
        [-0.38, -0.38],
        [0.38, -0.38],
        [-0.38, 0.38],
        [0.38, 0.38],
      ].map(([bx, bz], i) => (
        <mesh key={`bolt-${i}`} position={[bx, 0.09, bz]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Glossy Red Apple (Like in reference photo) */}
      <group ref={appleRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial
            color="#dc2626" // Vivid deep red
            roughness={0.12} // Glossy sheen
            metalness={0.18}
          />
        </mesh>

        {/* Apple Stem */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.8} />
        </mesh>

        {/* Leaf */}
        <mesh position={[0.1, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.18, 0.02, 0.09]} />
          <meshStandardMaterial color="#16a34a" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
