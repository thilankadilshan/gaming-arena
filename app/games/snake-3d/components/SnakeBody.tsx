'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

interface SnakeBodyProps {
  head: { x: number; z: number };
  segments: Array<{ x: number; y: number; z: number }>;
}

function SnakeBodyMesh({ head, segments }: SnakeBodyProps) {
  const { scene } = useGLTF('/snake.glb');

  // Extract the high-res PBR material from the GLB model
  const modelMaterial = useMemo(() => {
    let mat: THREE.Material | null = null;
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material && !mat) {
        mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      }
    });
    return mat;
  }, [scene]);

  // Build seamless 3D Catmull-Rom spline curve through snake coordinates
  const { tubeGeometry, tailPos } = useMemo(() => {
    const rawPoints = [
      new THREE.Vector3(head.x, 0.42, head.z),
      ...segments.map((s) => new THREE.Vector3(s.x, 0.42, s.z)),
    ];

    // Filter consecutive identical points
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < rawPoints.length; i++) {
      if (i === 0 || !rawPoints[i].equals(rawPoints[i - 1])) {
        points.push(rawPoints[i]);
      }
    }

    if (points.length < 2) {
      return { tubeGeometry: null, tailPos: null };
    }

    // Smooth Catmull-Rom spline
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);
    const tubularSegments = Math.max(points.length * 8, 36);
    const radius = 0.44; // Thick continuous body
    const radialSegments = 16;

    const geom = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
    const lastPoint = points[points.length - 1];

    return { tubeGeometry: geom, tailPos: lastPoint };
  }, [head, segments]);

  const defaultMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#475569',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const activeMaterial = modelMaterial || defaultMaterial;

  return (
    <group>
      {/* Continuous 3D Tube Snake Body mapped with the GLB PBR material */}
      {tubeGeometry && (
        <mesh
          geometry={tubeGeometry}
          material={activeMaterial}
          castShadow
          receiveShadow
        />
      )}

      {/* Rounded Tail Cap with the same matching material */}
      {tailPos && (
        <mesh
          position={[tailPos.x, tailPos.y, tailPos.z]}
          material={activeMaterial}
          castShadow
          scale={[1, 0.85, 1]}
        >
          <sphereGeometry args={[0.43, 20, 20]} />
        </mesh>
      )}
    </group>
  );
}

function FallbackBody({ head, segments }: SnakeBodyProps) {
  const points = [
    new THREE.Vector3(head.x, 0.42, head.z),
    ...segments.map((s) => new THREE.Vector3(s.x, 0.42, s.z)),
  ];
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
  const geom = new THREE.TubeGeometry(curve, 32, 0.42, 12, false);

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
    </mesh>
  );
}

export default function SnakeBody(props: SnakeBodyProps) {
  return (
    <React.Suspense fallback={<FallbackBody {...props} />}>
      <SnakeBodyMesh {...props} />
    </React.Suspense>
  );
}
