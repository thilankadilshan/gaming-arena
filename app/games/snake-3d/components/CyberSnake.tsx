'use client';

import React from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. SHARED CYBERNETIC MATERIALS
// ---------------------------------------------------------------------------
const metalDark = new THREE.MeshStandardMaterial({
  color: '#2b2d30',
  roughness: 0.45,
  metalness: 0.85,
});

const metalArmor = new THREE.MeshStandardMaterial({
  color: '#474b52',
  roughness: 0.35,
  metalness: 0.9,
});

const metalGold = new THREE.MeshStandardMaterial({
  color: '#cda851',
  roughness: 0.3,
  metalness: 0.8,
});

const eyeGlowMaterial = new THREE.MeshBasicMaterial({
  color: '#ff9900', // Intense amber core
});

// ---------------------------------------------------------------------------
// 2. MECH HEAD COMPONENT (Angular skull, glowing eyes, fangs & collar)
// ---------------------------------------------------------------------------
export function CyberSnakeHead({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Upper Cranium / Hexagonal Armor Shell */}
      <mesh position={[0, 0.12, 0.1]} rotation={[0.1, 0, 0]} material={metalArmor} castShadow>
        <boxGeometry args={[0.74, 0.35, 0.9]} />
      </mesh>

      {/* Tapered Snout Plate */}
      <mesh position={[0, 0.04, 0.55]} rotation={[0.25, 0, 0]} material={metalDark} castShadow>
        <coneGeometry args={[0.38, 0.55, 4]} />
      </mesh>

      {/* Lower Mechanical Jaw */}
      <mesh position={[0, -0.16, 0.2]} rotation={[-0.2, 0, 0]} material={metalDark} castShadow>
        <boxGeometry args={[0.62, 0.2, 0.75]} />
      </mesh>

      {/* Cyber Fangs (Upper left & right) */}
      <mesh position={[0.22, -0.12, 0.5]} rotation={[Math.PI, 0, 0]} material={metalArmor}>
        <coneGeometry args={[0.045, 0.22, 6]} />
      </mesh>
      <mesh position={[-0.22, -0.12, 0.5]} rotation={[Math.PI, 0, 0]} material={metalArmor}>
        <coneGeometry args={[0.045, 0.22, 6]} />
      </mesh>

      {/* Lower Fangs */}
      <mesh position={[0.16, -0.06, 0.45]} material={metalArmor}>
        <coneGeometry args={[0.035, 0.18, 6]} />
      </mesh>
      <mesh position={[-0.16, -0.06, 0.45]} material={metalArmor}>
        <coneGeometry args={[0.035, 0.18, 6]} />
      </mesh>

      {/* Left Glowing Eye Slit & Socket */}
      <group position={[0.38, 0.14, 0.15]} rotation={[0, 0.35, 0]}>
        <mesh material={eyeGlowMaterial}>
          <boxGeometry args={[0.04, 0.08, 0.22]} />
        </mesh>
        <pointLight color="#ff8800" intensity={2.5} distance={1.8} decay={2} />
      </group>

      {/* Right Glowing Eye Slit & Socket */}
      <group position={[-0.38, 0.14, 0.15]} rotation={[0, -0.35, 0]}>
        <mesh material={eyeGlowMaterial}>
          <boxGeometry args={[0.04, 0.08, 0.22]} />
        </mesh>
        <pointLight color="#ff8800" intensity={2.5} distance={1.8} decay={2} />
      </group>

      {/* Neck Collar Gear Ring (Hinged Joint) */}
      <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]} material={metalArmor}>
        <cylinderGeometry args={[0.42, 0.45, 0.22, 16]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. MECH BODY SEGMENT (Chiseled segmented cylinder + side cogs/gears)
// ---------------------------------------------------------------------------
export function CyberSnakeSegment({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Central Armored Segment Tube */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={metalDark} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.75, 12]} />
      </mesh>

      {/* Protective Outer Armor Plate */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={metalArmor}>
        <cylinderGeometry args={[0.41, 0.41, 0.4, 8, 1, false, 0, Math.PI]} />
      </mesh>

      {/* Left Mechanical Cog / Joint Gear */}
      <mesh position={[0.39, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={metalGold}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
      </mesh>

      {/* Right Mechanical Cog / Joint Gear */}
      <mesh position={[-0.39, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={metalGold}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
      </mesh>

      {/* Internal Hydraulic Conduit / Pipe */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={metalArmor}>
        <cylinderGeometry args={[0.08, 0.08, 0.72, 8]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. COLLECTIBLE: 3D ENERGIZED APPLE & GOLD STAR
// ---------------------------------------------------------------------------
export function CyberApple({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glowing Energy Core */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ff1133"
          emissive="#aa0022"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
      {/* Cyber Leaf / Antenna */}
      <mesh position={[0.08, 0.32, 0]} rotation={[0, 0, -0.4]} material={metalGold}>
        <boxGeometry args={[0.04, 0.18, 0.08]} />
      </mesh>
      <pointLight color="#ff2244" intensity={2} distance={2} decay={2} />
    </group>
  );
}

export function CyberStar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight color="#f59e0b" intensity={2.5} distance={3} decay={2} />
    </group>
  );
}
