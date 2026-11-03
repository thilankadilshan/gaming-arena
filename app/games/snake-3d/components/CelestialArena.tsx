'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. STYLED MATERIALS (Jade, Gold, Teal Tile, Sakura Pink, Stone)
// ---------------------------------------------------------------------------
const jadeFloorMaterial = new THREE.MeshStandardMaterial({
  color: '#a7f3d0',       // Mint jade green
  roughness: 0.15,
  metalness: 0.1,
  emissive: '#059669',
  emissiveIntensity: 0.12,
});

const borderGoldMaterial = new THREE.MeshStandardMaterial({
  color: '#eab308',       // Imperial gold trim
  roughness: 0.3,
  metalness: 0.8,
});

const stoneBaseMaterial = new THREE.MeshStandardMaterial({
  color: '#94a3b8',       // Light slate marble
  roughness: 0.6,
});

const roofTealMaterial = new THREE.MeshStandardMaterial({
  color: '#0d9488',       // Deep teal/cyan pagoda ceramic tiles
  roughness: 0.35,
});

const sakuraPinkMaterial = new THREE.MeshStandardMaterial({
  color: '#f472b6',       // Cherry blossom foliage
  roughness: 0.8,
  flatShading: true,
});

const cloudMaterial = new THREE.MeshStandardMaterial({
  color: '#fdf2f8',
  roughness: 0.9,
  transparent: true,
  opacity: 0.75,
});

// ---------------------------------------------------------------------------
// 2. CORNER PAGODA COMPONENT (Tiered Temple Towers)
// ---------------------------------------------------------------------------
function PagodaTower({
  position,
  scale = 1,
  roofColor = roofTealMaterial,
}: {
  position: [number, number, number];
  scale?: number;
  roofColor?: THREE.Material;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stone Base Plinth */}
      <mesh position={[0, 0.4, 0]} material={stoneBaseMaterial} castShadow>
        <boxGeometry args={[2.2, 0.8, 2.2]} />
      </mesh>

      {/* Tier 1 Body */}
      <mesh position={[0, 1.2, 0]} material={borderGoldMaterial}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
      </mesh>
      {/* Tier 1 Flared Eaves / Roof */}
      <mesh position={[0, 1.7, 0]} material={roofColor} castShadow>
        <coneGeometry args={[1.6, 0.5, 4]} />
      </mesh>

      {/* Tier 2 Body */}
      <mesh position={[0, 2.2, 0]} material={borderGoldMaterial}>
        <boxGeometry args={[1.1, 0.7, 1.1]} />
      </mesh>
      {/* Tier 2 Roof */}
      <mesh position={[0, 2.65, 0]} material={roofColor} castShadow>
        <coneGeometry args={[1.3, 0.45, 4]} />
      </mesh>

      {/* Tier 3 Body */}
      <mesh position={[0, 3.05, 0]} material={borderGoldMaterial}>
        <boxGeometry args={[0.75, 0.6, 0.75]} />
      </mesh>
      {/* Tier 3 Roof / Spire */}
      <mesh position={[0, 3.45, 0]} material={roofColor} castShadow>
        <coneGeometry args={[0.95, 0.4, 4]} />
      </mesh>
      <mesh position={[0, 3.8, 0]} material={borderGoldMaterial}>
        <coneGeometry args={[0.1, 0.5, 8]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. SAKURA CHERRY BLOSSOM CLUSTER
// ---------------------------------------------------------------------------
function SakuraCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Organic low-poly puffy pink canopy */}
      <mesh position={[0, 0.4, 0]} material={sakuraPinkMaterial}>
        <dodecahedronGeometry args={[0.65, 1]} />
      </mesh>
      <mesh position={[0.3, 0.55, 0.2]} material={sakuraPinkMaterial}>
        <dodecahedronGeometry args={[0.45, 1]} />
      </mesh>
      <mesh position={[-0.25, 0.35, -0.2]} material={sakuraPinkMaterial}>
        <dodecahedronGeometry args={[0.5, 1]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. MAIN CELESTIAL ARENA BOARD
// ---------------------------------------------------------------------------
export function CelestialArena({ boardSize = 16 }: { boardSize?: number }) {
  const half = boardSize / 2;
  const outerHalf = half + 1.2;

  // Generate boundary positions for Sakura foliage
  const borderTrees = useMemo(() => {
    const coords: [number, number, number][] = [];
    const step = 1.6;
    for (let i = -half + 2; i <= half - 2; i += step) {
      coords.push([i, 0.2, -outerHalf]);
      coords.push([i, 0.2, outerHalf]);
      coords.push([-outerHalf, 0.2, i]);
      coords.push([outerHalf, 0.2, i]);
    }
    return coords;
  }, [half, outerHalf]);

  return (
    <group>
      {/* Central Jade Slithering Floor */}
      <mesh position={[0, -0.05, 0]} material={jadeFloorMaterial} receiveShadow>
        <boxGeometry args={[boardSize, 0.2, boardSize]} />
      </mesh>

      {/* Decorative Internal Inset Line (Floating Jade Center Motif) */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[half * 0.4, half * 0.45, 4]} />
        <meshBasicMaterial color="#6ee7b7" wireframe />
      </mesh>

      {/* Outer Raised Stone Platform / Courtyard Walkway */}
      <mesh position={[0, -0.4, 0]} material={stoneBaseMaterial} receiveShadow>
        <boxGeometry args={[boardSize + 4.5, 0.5, boardSize + 4.5]} />
      </mesh>

      {/* Golden Balustrade / Collision Walls */}
      {/* North / South Wall */}
      <mesh position={[0, 0.25, -half - 0.2]} material={borderGoldMaterial} castShadow>
        <boxGeometry args={[boardSize + 0.6, 0.45, 0.3]} />
      </mesh>
      <mesh position={[0, 0.25, half + 0.2]} material={borderGoldMaterial} castShadow>
        <boxGeometry args={[boardSize + 0.6, 0.45, 0.3]} />
      </mesh>
      {/* East / West Wall */}
      <mesh position={[-half - 0.2, 0.25, 0]} material={borderGoldMaterial} castShadow>
        <boxGeometry args={[0.3, 0.45, boardSize + 0.6]} />
      </mesh>
      <mesh position={[half + 0.2, 0.25, 0]} material={borderGoldMaterial} castShadow>
        <boxGeometry args={[0.3, 0.45, boardSize + 0.6]} />
      </mesh>

      {/* 4 Corner Pagodas (Teal Roofs and Grand Gold Pagoda) */}
      <PagodaTower position={[-half - 1.8, 0, -half - 1.8]} scale={1.2} />
      <PagodaTower position={[half + 1.8, 0, -half - 1.8]} scale={1.3} roofColor={borderGoldMaterial} />
      <PagodaTower position={[-half - 1.8, 0, half + 1.8]} scale={1.0} />
      <PagodaTower position={[half + 1.8, 0, half + 1.8]} scale={1.1} />

      {/* Sakura Trees Along Outer Border */}
      {borderTrees.map((pos, idx) => (
        <SakuraCluster key={idx} position={pos} />
      ))}

      {/* Dreamy Cloud Layer Under the Island */}
      <group position={[0, -1.8, 0]}>
        {[-8, 0, 8].map((x) =>
          [-8, 0, 8].map((z) => (
            <mesh key={`${x}-${z}`} position={[x + Math.sin(z) * 2, -0.5, z]} material={cloudMaterial}>
              <sphereGeometry args={[4.2, 12, 12]} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}
