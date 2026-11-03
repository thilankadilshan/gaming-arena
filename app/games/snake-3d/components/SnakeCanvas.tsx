'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialArena } from './CelestialArena';
import {
  CyberSnakeHead,
  CyberSnakeSegment,
  CyberApple,
  CyberStar,
} from './CyberSnake';
import { soundEngine } from '@/lib/audio/soundEngine';
import { Play } from 'lucide-react';

export interface GameState {
  score: number;
  applesEaten: number;
  starsCollected: number;
  speedLevel: number;
  isPaused: boolean;
  isGameOver: boolean;
}

interface SnakeCanvasProps {
  onScoreUpdate: (state: GameState) => void;
  onGameOver: (state: GameState) => void;
  isPaused: boolean;
  virtualDirection?: { x: number; z: number } | null;
  resetSignal: number;
}

interface Point {
  x: number;
  z: number;
}

const GRID_SIZE = 16;
const HALF_GRID = 7; // Arena boundary range [-7, 7]

// Dynamic Responsive Camera that guarantees the entire celestial arena & pagodas are 100% visible
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const width = Math.max(size.width, 1);
    const height = Math.max(size.height, 1);
    const aspect = width / height;

    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov = 42;

    // Elevated 45-degree isometric angle matching the pagoda art [18, 22, 18]
    // On portrait mobile (aspect < 1.0), scale distance proportionally so all pagodas fit comfortably
    const scale = aspect < 1.0 ? Math.max(1.0, 1.15 / aspect) : 1.0;

    perspCam.position.set(18 * scale, 22 * scale, 18 * scale);
    perspCam.lookAt(0, 0, 0);
    perspCam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function SnakeCanvas({
  onScoreUpdate,
  onGameOver,
  isPaused,
  virtualDirection,
  resetSignal,
}: SnakeCanvasProps) {
  // Game running state
  const [hasStarted, setHasStarted] = useState(false);

  // Snake coordinates
  const [snake, setSnake] = useState<Point[]>([
    { x: 0, z: 0 },
    { x: 0, z: 1 },
    { x: 0, z: 2 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 0, z: -1 });
  const [apple, setApple] = useState<Point>({ x: 3, z: -2 });
  const [star, setStar] = useState<Point | null>(null);

  // Stable references for callbacks
  const scoreCallbackRef = useRef(onScoreUpdate);
  scoreCallbackRef.current = onScoreUpdate;

  const gameOverCallbackRef = useRef(onGameOver);
  gameOverCallbackRef.current = onGameOver;

  // Score & State tracking
  const scoreRef = useRef(0);
  const applesRef = useRef(0);
  const starsRef = useRef(0);
  const speedRef = useRef(140);
  const isGameOverRef = useRef(false);
  const hasStartedRef = useRef(false);
  hasStartedRef.current = hasStarted;

  // Direction queue
  const nextDirectionRef = useRef<Point>({ x: 0, z: -1 });
  const currentDirectionRef = useRef<Point>({ x: 0, z: -1 });

  const starTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomCoordinate = useCallback((currentSnake: Point[]): Point => {
    let attempts = 0;
    while (attempts < 80) {
      const x = Math.floor(Math.random() * (HALF_GRID * 2 + 1)) - HALF_GRID;
      const z = Math.floor(Math.random() * (HALF_GRID * 2 + 1)) - HALF_GRID;
      const collision = currentSnake.some((seg) => seg.x === x && seg.z === z);
      if (!collision) return { x, z };
      attempts++;
    }
    return { x: 2, z: 2 };
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake: Point[] = [
      { x: 0, z: 0 },
      { x: 0, z: 1 },
      { x: 0, z: 2 },
    ];
    setSnake(initialSnake);
    const initialDir = { x: 0, z: -1 };
    setDirection(initialDir);
    nextDirectionRef.current = initialDir;
    currentDirectionRef.current = initialDir;

    scoreRef.current = 0;
    applesRef.current = 0;
    starsRef.current = 0;
    speedRef.current = 140;
    isGameOverRef.current = false;
    setHasStarted(false);

    setApple(getRandomCoordinate(initialSnake));
    setStar(null);

    scoreCallbackRef.current({
      score: 0,
      applesEaten: 0,
      starsCollected: 0,
      speedLevel: 1,
      isPaused: false,
      isGameOver: false,
    });
  }, [getRandomCoordinate]);

  useEffect(() => {
    resetGame();
  }, [resetSignal, resetGame]);

  // Periodic Star Spawner
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (!isGameOverRef.current && hasStartedRef.current && !isPaused) {
        if (Math.random() > 0.45) {
          setSnake((currSnake) => {
            const starPos = getRandomCoordinate(currSnake);
            setStar(starPos);

            if (starTimerRef.current) clearTimeout(starTimerRef.current);
            starTimerRef.current = setTimeout(() => {
              setStar(null);
            }, 10000);

            return currSnake;
          });
        }
      }
    }, 18000);

    return () => {
      clearInterval(spawnInterval);
      if (starTimerRef.current) clearTimeout(starTimerRef.current);
    };
  }, [getRandomCoordinate, isPaused]);

  const changeDirection = useCallback((newDir: Point) => {
    if (!hasStartedRef.current) {
      setHasStarted(true);
    }
    const curr = currentDirectionRef.current;
    if (newDir.x !== 0 && curr.x !== 0) return;
    if (newDir.z !== 0 && curr.z !== 0) return;
    nextDirectionRef.current = newDir;
  }, []);

  useEffect(() => {
    if (virtualDirection) {
      changeDirection(virtualDirection);
    }
  }, [virtualDirection, changeDirection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        if (!hasStartedRef.current) {
          e.preventDefault();
          setHasStarted(true);
          return;
        }
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection({ x: 0, z: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection({ x: 0, z: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection({ x: -1, z: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection({ x: 1, z: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  // Mobile Touch Swipe Detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 20) {
      if (!hasStartedRef.current) {
        setHasStarted(true);
      }
      if (absDx > absDy) {
        if (dx > 0) changeDirection({ x: 1, z: 0 });
        else changeDirection({ x: -1, z: 0 });
      } else {
        if (dy > 0) changeDirection({ x: 0, z: 1 });
        else changeDirection({ x: 0, z: -1 });
      }
    }
    touchStartRef.current = null;
  };

  // Main Simulation Loop
  useEffect(() => {
    if (isPaused || isGameOverRef.current || !hasStarted) return;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        if (isGameOverRef.current) return prevSnake;

        const nextDir = nextDirectionRef.current;
        currentDirectionRef.current = nextDir;
        setDirection(nextDir);

        const head = prevSnake[0];
        const newHead: Point = {
          x: head.x + nextDir.x,
          z: head.z + nextDir.z,
        };

        // 1. Boundary Wall Collision
        if (
          newHead.x < -HALF_GRID ||
          newHead.x > HALF_GRID ||
          newHead.z < -HALF_GRID ||
          newHead.z > HALF_GRID
        ) {
          isGameOverRef.current = true;
          soundEngine.playGameOver();
          gameOverCallbackRef.current({
            score: scoreRef.current,
            applesEaten: applesRef.current,
            starsCollected: starsRef.current,
            speedLevel: Math.floor(applesRef.current / 5) + 1,
            isPaused: false,
            isGameOver: true,
          });
          return prevSnake;
        }

        // 2. Self Collision
        const selfCollision = prevSnake.some(
          (seg) => seg.x === newHead.x && seg.z === newHead.z
        );
        if (selfCollision) {
          isGameOverRef.current = true;
          soundEngine.playGameOver();
          gameOverCallbackRef.current({
            score: scoreRef.current,
            applesEaten: applesRef.current,
            starsCollected: starsRef.current,
            speedLevel: Math.floor(applesRef.current / 5) + 1,
            isPaused: false,
            isGameOver: true,
          });
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 3. Apple Eating
        let ateApple = false;
        if (newHead.x === apple.x && newHead.z === apple.z) {
          ateApple = true;
          applesRef.current += 1;
          scoreRef.current += 100;
          soundEngine.playPickupApple();
          setApple(getRandomCoordinate(newSnake));

          const newLevel = Math.floor(applesRef.current / 5) + 1;
          speedRef.current = Math.max(140 - (newLevel - 1) * 14, 65);

          scoreCallbackRef.current({
            score: scoreRef.current,
            applesEaten: applesRef.current,
            starsCollected: starsRef.current,
            speedLevel: newLevel,
            isPaused: false,
            isGameOver: false,
          });
        }

        // 4. Bonus Star Collection
        if (star && newHead.x === star.x && newHead.z === star.z) {
          starsRef.current += 1;
          scoreRef.current += 300;
          soundEngine.playPickupStar();
          setStar(null);
          if (starTimerRef.current) clearTimeout(starTimerRef.current);

          scoreCallbackRef.current({
            score: scoreRef.current,
            applesEaten: applesRef.current,
            starsCollected: starsRef.current,
            speedLevel: Math.floor(applesRef.current / 5) + 1,
            isPaused: false,
            isGameOver: false,
          });
        }

        if (!ateApple) {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speedRef.current);

    return () => clearInterval(timer);
  }, [apple, star, getRandomCoordinate, isPaused, hasStarted]);

  const head = snake[0] || { x: 0, z: 0 };
  const bodySegments = snake.slice(1).map((s) => ({ x: s.x, y: 0, z: s.z }));

  return (
    <div
      className="relative h-full w-full select-none bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-950"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [18, 22, 18], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          return () => {
            scene.traverse((object) => {
              if (object instanceof THREE.Mesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                  if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => mat.dispose());
                  } else {
                    object.material.dispose();
                  }
                }
              }
            });
            gl.dispose();
          };
        }}
      >
        {/* Dynamic Responsive Camera */}
        <ResponsiveCamera />

        {/* Warm Sunlight & Soft Ambient Sky Fill */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[20, 30, 15]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* Soft pink bottom fill for clouds */}
        <pointLight position={[0, -5, 0]} color="#f472b6" intensity={1.5} />

        {/* 1. Celestial Jade & Pagoda Arena */}
        <CelestialArena boardSize={GRID_SIZE} />

        {/* 2. Apple / Energized Collectible */}
        <CyberApple position={[apple.x, 0.25, apple.z]} />

        {/* 3. Bonus Star */}
        {star && <CyberStar position={[star.x, 0.45, star.z]} />}

        {/* High-visibility Target Reticle on Next Cell */}
        {hasStarted && !isGameOverRef.current && (
          <mesh
            position={[head.x + direction.x, 0.08, head.z + direction.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.26, 0.42, 24]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.75} />
          </mesh>
        )}

        {/* 4. Snake Head */}
        <CyberSnakeHead
          position={[head.x, 0.25, head.z]}
          rotation={[0, Math.atan2(direction.x, direction.z), 0]}
        />

        {/* 5. Snake Body Segments */}
        {bodySegments.map((seg, idx) => {
          const prev = idx === 0 ? head : snake[idx];
          const rotY = Math.atan2(prev.x - seg.x, prev.z - seg.z);
          return (
            <CyberSnakeSegment
              key={idx}
              position={[seg.x, 0.25, seg.z]}
              rotation={[0, rotY, 0]}
            />
          );
        })}
      </Canvas>

      {/* Celestial Start Screen Overlay */}
      {!hasStarted && !isGameOverRef.current && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-auto">
          <div className="max-w-md rounded-2xl border-2 border-amber-500/60 bg-[#161a22]/95 p-8 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-400 mb-3 uppercase tracking-widest">
              CELESTIAL VIPER ASCENSION
            </div>

            <h2 className="text-3xl font-black uppercase text-white tracking-wider mb-2">
              JADE TEMPLE ARENA
            </h2>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Steer the cybernetic viper across the floating jade platform with <strong className="text-amber-400">WASD</strong> or <strong className="text-amber-400">Arrow Keys</strong> (Swipe on mobile).
              Consume energized apples to grow and collect celestial stars.
            </p>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Play className="h-5 w-5 fill-current" />
              DEPLOY VIPER (PRESS SPACE)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
