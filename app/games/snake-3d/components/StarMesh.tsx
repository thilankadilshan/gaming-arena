'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface StarMeshProps {
  position: [number, number, number];
}

export default function StarMesh({ position }: StarMeshProps) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const t = state.clock.getElapsedTime();
      // Fast rotation
      coreRef.current.rotation.y = t * 4.5;
      coreRef.current.rotation.x = Math.sin(t * 3.5) * 0.2;
      coreRef.current.position.y = position[1] + 0.5 + Math.sin(t * 4.5) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.04;
    }
  });

  return (
    <group ref={coreRef} position={[position[0], position[1] + 0.5, position[2]]}>
      {/* Radioactive / Tech Energy Core */}
      <mesh castShadow>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.1}
          metalness={0.8}
          emissive="#d97706"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Outer Metallic Containment Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.72, 0.05, 12, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Amber Light Burst */}
      <pointLight color="#f59e0b" intensity={2.5} distance={4} />
    </group>
  );
}
