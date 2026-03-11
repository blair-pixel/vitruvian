'use client';

import { useRef, useMemo, memo } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// WebGL / Three.js must not run on the server
const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

// ─── Replace with real celeb photos when available ────────────────────────────
const celebImages = [
  { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 1' },
  { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 2' },
  { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 3' },
  { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 4' },
  { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 5' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 6' },
  { src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 7' },
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 8' },
  { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 9' },
  { src: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 10' },
  { src: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 11' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', alt: 'Celebrity 12' },
];

const GOLD    = '#B8953F';
const LIGHT   = '#F7F2EA'; // warm cream for hero + CTA
const DARK    = '#06060A'; // deep near-black for space section

// ─── Star field — rendered behind the alpha canvas so stars peek through ──────
const StarField = memo(function StarField() {
  // Generate once — mix of tiny white and gold stars at random pixel positions
  const boxShadow = useMemo(() => {
    const rng = (n: number) => Math.floor(Math.random() * n);
    return Array.from({ length: 220 }, () => {
      const x       = rng(1920);
      const y       = rng(1080);
      const size    = Math.random() < 0.15 ? 1.5 : 0.8;
      const alpha   = (0.25 + Math.random() * 0.75).toFixed(2);
      const isGold  = Math.random() < 0.28;
      const color   = isGold
        ? `rgba(184,149,63,${alpha})`
        : `rgba(255,255,255,${alpha})`;
      return `${x}px ${y}px 0 ${size}px ${color}`;
    }).join(', ');
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 px anchor — box-shadow offsets fan out to cover the viewport */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, boxShadow }} />
    </div>
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CelebsPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.52], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.65], ['0%', '-12%']);

  return (
    <main className="w-full overflow-x-hidden">

      {/* ── Section 1: Hero — warm cream, dark text ── */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center justify-center px-6 text-center"
        style={{ background: LIGHT }}
      >
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4.5vw, 64px)',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              color: '#0D0D0B',
              maxWidth: '860px',
            }}
          >
            From Love Island to the red carpet —{' '}
            <span style={{ color: GOLD }}>
              the smiles you admire start at Vitruvian Dental Studio
            </span>
          </h1>
        </motion.div>
      </section>

      {/* ── Section 2: Space gallery — deep dark with gold star field ── */}
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ background: DARK }}
      >
        {/* Stars sit behind the alpha canvas — visible in the gaps between photos */}
        <StarField />

        {/* 3D gallery — canvas alpha:true lets stars show through */}
        <InfiniteGallery
          images={celebImages}
          speed={1.0}
          visibleCount={12}
          aspectRatio={0.8}
          autoPlayOnly={true}
          className="absolute inset-0 h-full w-full"
          fadeSettings={{
            fadeIn:  { start: 0.05, end: 0.25 },
            fadeOut: { start: 0.75, end: 0.92 },
          }}
        />
      </section>

      {/* ── Section 3: CTA — warm cream, dark text ── */}
      <section
        className="flex flex-col items-center justify-center px-6 py-32 text-center"
        style={{
          background: LIGHT,
          borderTop: `1px solid rgba(184,149,63,0.25)`,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 56px)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: '#0D0D0B',
            maxWidth: '640px',
            marginBottom: '40px',
          }}
        >
          Ready to start your{' '}
          <span style={{ color: GOLD }}>smile transformation?</span>
        </h2>

        <Link
          href="/contact"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#0D0D0B',
            background: GOLD,
            padding: '16px 40px',
            borderRadius: '10px',
            display: 'inline-block',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Let's Talk
        </Link>
      </section>

    </main>
  );
}
