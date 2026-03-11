'use client';

import type React from 'react';
import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn:  { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  /** Force a fixed aspect ratio for every photo (e.g. 0.8 for 4:5 Instagram portrait) */
  aspectRatio?: number;
  /** When true, disables wheel/keyboard interaction — gallery auto-plays only */
  autoPlayOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPTH   = 50;
const MAX_X   = 6;
const MAX_Y   = 4;

function spatialOffset(i: number, count: number) {
  const ha = (i * 2.618) % (Math.PI * 2);
  const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
  const hr = (i % 3) * 1.2;
  const vr = ((i + 1) % 4) * 0.8;
  return {
    x: (Math.sin(ha) * hr * MAX_X) / 3,
    y: (Math.cos(va) * vr * MAX_Y) / 4,
  };
}

// ─── Inner scene ──────────────────────────────────────────────────────────────

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 12,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.75, end: 0.92 } },
  aspectRatio,
  autoPlayOnly = false,
}: {
  images: { src: string }[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  aspectRatio?: number;
  autoPlayOnly?: boolean;
}) {
  const totalImages = images.length;

  // ── textures loaded into state so JSX re-renders when ready ───────────────
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() =>
    new Array(totalImages).fill(null),
  );

  useEffect(() => {
    if (!totalImages) return;
    const loader = new THREE.TextureLoader();
    const arr: (THREE.Texture | null)[] = new Array(totalImages).fill(null);

    images.forEach(({ src }, idx) => {
      loader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          arr[idx] = tex;
          setTextures([...arr]);   // triggers re-render — only fires once per image
        },
        undefined,
        () => console.warn('Texture failed:', src),
      );
    });

    return () => {
      arr.forEach(t => t?.dispose());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // ── plane logical state in refs (never triggers re-renders) ───────────────
  const planesRef = useRef(
    Array.from({ length: visibleCount }, (_, i) => ({
      z:          ((DEPTH / visibleCount) * i) % DEPTH,
      imageIndex: i % Math.max(totalImages, 1),
      ...spatialOffset(i, visibleCount),
    })),
  );

  // ── mesh refs so useFrame can move them without React reconciler ──────────
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // ── animation control ─────────────────────────────────────────────────────
  const vel             = useRef(0);
  const autoPlay        = useRef(true);
  const lastInteraction = useRef(Date.now());

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    vel.current            += e.deltaY * 0.01 * speed;
    autoPlay.current        = false;
    lastInteraction.current = Date.now();
  }, [speed]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  vel.current -= 2 * speed;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') vel.current += 2 * speed;
    if (e.key.startsWith('Arrow')) { autoPlay.current = false; lastInteraction.current = Date.now(); }
  }, [speed]);

  useEffect(() => {
    if (autoPlayOnly) return; // page scroll is free — no interaction handlers needed
    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKey);
    const t = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) autoPlay.current = true;
    }, 1000);
    return () => {
      canvas?.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
      clearInterval(t);
    };
  }, [onWheel, onKey, autoPlayOnly]);

  // ── animation loop — updates mesh transforms directly via refs ────────────
  useFrame((_state, delta) => {
    if (autoPlay.current) vel.current += 0.25 * delta;
    vel.current *= 0.95;

    const v         = vel.current;
    const planes    = planesRef.current;
    const imageStep = visibleCount % Math.max(totalImages, 1) || totalImages;

    planes.forEach((plane, i) => {
      let newZ = plane.z + v * delta * 10;

      // Wrap
      let wf = 0, wb = 0;
      if (newZ >= DEPTH)  { wf = Math.floor(newZ / DEPTH);  newZ -= DEPTH * wf; }
      if (newZ < 0)       { wb = Math.ceil(-newZ / DEPTH);  newZ += DEPTH * wb; }
      if (wf > 0 && totalImages > 0) plane.imageIndex = (plane.imageIndex + wf * imageStep) % totalImages;
      if (wb > 0 && totalImages > 0) { const s = plane.imageIndex - wb * imageStep; plane.imageIndex = ((s % totalImages) + totalImages) % totalImages; }
      plane.z = ((newZ % DEPTH) + DEPTH) % DEPTH;

      const norm    = plane.z / DEPTH;
      const worldZ  = plane.z - DEPTH / 2;
      const { fadeIn, fadeOut } = fadeSettings;

      let opacity = 1;
      if      (norm < fadeIn.start)  opacity = 0;
      else if (norm < fadeIn.end)    opacity = (norm - fadeIn.start) / (fadeIn.end  - fadeIn.start);
      else if (norm > fadeOut.end)   opacity = 0;
      else if (norm > fadeOut.start) opacity = 1 - (norm - fadeOut.start) / (fadeOut.end - fadeOut.start);
      opacity = Math.max(0, Math.min(1, opacity));

      const mesh = meshRefs.current[i];
      if (!mesh) return;

      mesh.position.set(plane.x, plane.y, worldZ);
      (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });

  // ── JSX: meshes declared statically, textures + scale applied per plane ──
  const halfD = DEPTH / 2;

  return (
    <>
      {Array.from({ length: visibleCount }, (_, i) => {
        const plane   = planesRef.current[i];
        const tex     = textures[plane.imageIndex] ?? null;
        const worldZ  = plane.z - halfD;

        // Use forced aspect ratio if provided, otherwise derive from loaded image
        const aspect = aspectRatio
          ?? (() => {
               const imgEl = tex?.image as HTMLImageElement | undefined;
               return imgEl
                 ? (imgEl.naturalWidth || imgEl.width || 1) / (imgEl.naturalHeight || imgEl.height || 1)
                 : 1;
             })();

        const sx = aspect > 1 ? 2 * aspect : 2;
        const sy = aspect > 1 ? 2           : 2 / aspect;

        return (
          <mesh
            key={i}
            ref={el => { meshRefs.current[i] = el; }}
            position={[plane.x, plane.y, worldZ]}
            scale={[sx, sy, 1]}
          >
            <planeGeometry args={[1, 1, 1, 1]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              map={tex ?? undefined}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function InfiniteGallery({
  images,
  className = 'h-screen w-full',
  style,
  speed = 1,
  visibleCount = 12,
  aspectRatio,
  autoPlayOnly = false,
  fadeSettings = {
    fadeIn:  { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.75, end: 0.92 },
  },
}: InfiniteGalleryProps) {
  const normalizedImages = useMemo(
    () => images.map(img => typeof img === 'string' ? { src: img } : img),
    [images],
  );

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene
          images={normalizedImages}
          speed={speed}
          visibleCount={visibleCount}
          fadeSettings={fadeSettings}
          aspectRatio={aspectRatio}
          autoPlayOnly={autoPlayOnly}
        />
      </Canvas>
    </div>
  );
}
