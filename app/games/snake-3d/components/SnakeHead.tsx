'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface SnakeHeadProps {
  position: [number, number, number];
  direction: { x: number; z: number };
}

function SnakeHeadMesh({ position, direction }: SnakeHeadProps) {
  const headGroupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/snake.glb');

  // Clone scene so multiple instances don't share transforms
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Compute rotation angle to face movement direction
  const targetRotationY = Math.atan2(direction.x, direction.z);

  useFrame((_, delta) => {
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(
        headGroupRef.current.rotation.y,
        targetRotationY,
        22,
        delta
      );
    }
  });

  return (
    <group ref={headGroupRef} position={position}>
      {/* 3D GLB Model Mesh */}
      <primitive
        object={clonedScene}
        position={[0, 0.45, 0]}
        scale={[0.85, 0.85, 0.85]}
      />

      {/* Menacing Amber Eye Beams for the Mech Snake */}
      <pointLight position={[0, 0.6, 0.6]} color="#f97316" intensity={2.2} distance={4} />

      {/* Optical Ground Aura under head to make it instantly trackable */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// Fallback in case GLB takes a frame to load
function FallbackHead({ position, direction }: SnakeHeadProps) {
  const targetRotationY = Math.atan2(direction.x, direction.z);
  return (
    <group position={position} rotation={[0, targetRotationY, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 1.1]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function SnakeHead(props: SnakeHeadProps) {
  return (
    <React.Suspense fallback={<FallbackHead {...props} />}>
      <SnakeHeadMesh {...props} />
    </React.Suspense>
  );
}

// Preload the GLB model asset
useGLTF.preload('/snake.glb');
