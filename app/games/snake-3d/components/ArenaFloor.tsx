'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ArenaFloorProps {
  gridSize?: number; // e.g. 16
}

export default function ArenaFloor({ gridSize = 16 }: ArenaFloorProps) {
  const halfSize = gridSize / 2;

  // Grid lines on the industrial metal floor
  const gridHelper = useMemo(() => {
    return new THREE.GridHelper(gridSize, gridSize, 0x475569, 0x1e293b);
  }, [gridSize]);

  // Canvas texture for the diagonal yellow/black hazard stripes
  const hazardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#eab308'; // Industrial Warning Yellow
      ctx.fillRect(0, 0, 128, 128);

      ctx.fillStyle = '#18181b'; // Dark Hazard Stripe
      ctx.beginPath();
      // Draw 45 degree diagonal stripes
      for (let i = -128; i < 256; i += 32) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 16, 0);
        ctx.lineTo(i + 16 + 128, 128);
        ctx.lineTo(i + 128, 128);
        ctx.closePath();
      }
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 1);
    return texture;
  }, []);

  return (
    <group>
      {/* Dark Industrial Concrete / Steel Subfloor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[gridSize + 8, gridSize + 8]} />
        <meshStandardMaterial color="#0f1115" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Heavy Steel Grate Arena Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial
          color="#1b2028" // Dark industrial steel
          roughness={0.45}
          metalness={0.75}
        />
      </mesh>

      {/* Metal Grid Guide Lines */}
      <primitive object={gridHelper} position={[0, 0.005, 0]} />

      {/* Industrial Boundary Walls with Yellow/Black Hazard Stripes */}
      {/* North Wall */}
      <mesh position={[0, 0.45, -halfSize]} castShadow receiveShadow>
        <boxGeometry args={[gridSize + 0.4, 0.9, 0.45]} />
        {hazardTexture ? (
          <meshStandardMaterial
            map={hazardTexture}
            roughness={0.4}
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        )}
      </mesh>
      <mesh position={[0, 0.91, -halfSize]}>
        <boxGeometry args={[gridSize + 0.4, 0.04, 0.15]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* South Wall */}
      <mesh position={[0, 0.45, halfSize]} castShadow receiveShadow>
        <boxGeometry args={[gridSize + 0.4, 0.9, 0.45]} />
        {hazardTexture ? (
          <meshStandardMaterial
            map={hazardTexture}
            roughness={0.4}
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        )}
      </mesh>
      <mesh position={[0, 0.91, halfSize]}>
        <boxGeometry args={[gridSize + 0.4, 0.04, 0.15]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* West Wall */}
      <mesh position={[-halfSize, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.9, gridSize + 0.4]} />
        {hazardTexture ? (
          <meshStandardMaterial
            map={hazardTexture}
            roughness={0.4}
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        )}
      </mesh>
      <mesh position={[-halfSize, 0.91, 0]}>
        <boxGeometry args={[0.15, 0.04, gridSize + 0.4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* East Wall */}
      <mesh position={[halfSize, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.9, gridSize + 0.4]} />
        {hazardTexture ? (
          <meshStandardMaterial
            map={hazardTexture}
            roughness={0.4}
            metalness={0.6}
          />
        ) : (
          <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.6} />
        )}
      </mesh>
      <mesh position={[halfSize, 0.91, 0]}>
        <boxGeometry args={[0.15, 0.04, gridSize + 0.4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Heavy Steel Corner Bolted Pillars */}
      {[
        [-halfSize, -halfSize],
        [halfSize, -halfSize],
        [-halfSize, halfSize],
        [halfSize, halfSize],
      ].map(([px, pz], i) => (
        <group key={`corner-${i}`} position={[px, 0.65, pz]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 1.3, 0.65]} />
            <meshStandardMaterial color="#2d333b" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Warning Beacon on Top */}
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          <pointLight color="#f97316" intensity={0.6} distance={2.5} />
        </group>
      ))}

      {/* Outer Industrial Steel Mesh Fencing / Railings */}
      <mesh position={[0, 1.1, -halfSize - 0.4]}>
        <boxGeometry args={[gridSize + 1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.1, halfSize + 0.4]}>
        <boxGeometry args={[gridSize + 1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[-halfSize - 0.4, 1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, gridSize + 1.2]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[halfSize + 0.4, 1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, gridSize + 1.2]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
}
