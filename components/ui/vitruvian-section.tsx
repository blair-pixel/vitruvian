'use client'

import { useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VitruvianCanvas = dynamic(
  () => import('./vitruvian-canvas').then(m => m.VitruvianCanvas),
  { ssr: false }
)

export function VitruvianSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef  = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width  / 2)))
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
    frameRef.current.style.transform = `perspective(900px) rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!frameRef.current) return
    frameRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <section ref={sectionRef} className="vitruvian-section">

      {/* Ambient gold spotlights */}
      <div className="vitruvian-spotlight" />
      <div className="vitruvian-spotlight-2" />

      <div className="vitruvian-inner">

        {/* LEFT: Brand copy */}
        <div className="vitruvian-text">
          <div className="vitruvian-label">Our Philosophy</div>

          <h2>
            Named After <em>Perfection</em>
          </h2>

          <p>
            In 1490, Leonardo da Vinci drew the Vitruvian Man — a precise study of the{' '}
            <strong>ideal proportions of the human body</strong>. Based on the work of the
            ancient Roman architect Vitruvius, it demonstrated that beauty is not accidental.
            It is mathematical. It is measurable.
          </p>

          <p>
            Da Vinci showed that the face, the body — every feature we instinctively perceive
            as beautiful — follows the same underlying{' '}
            <strong>ratios of harmony and symmetry</strong>. Nature&apos;s blueprint for what
            looks right.
          </p>

          <div className="vitruvian-rule" />

          <p>
            At Vitruvian Dental Studio, we apply this same philosophy to every smile we
            create. Before we touch a single tooth, we study{' '}
            <strong>your unique facial proportions</strong> — the golden ratio of your lip
            line, the symmetry of your dental midline, the balance of your arch and bite.
          </p>

          <p>
            We don&apos;t just fix teeth. We{' '}
            <strong>restore the geometry of your smile</strong>.
          </p>

          <blockquote className="vitruvian-quote">
            &ldquo;Beauty is the summation of the parts working together in such a way that
            nothing needs to be added, taken away or altered.&rdquo;
            <br /><br />
            — Leonardo da Vinci
          </blockquote>
        </div>

        {/* RIGHT: Da Vinci figure with gold geometric overlay */}
        <div className="vitruvian-visual">
          <div className="fig-glow" />

          <div ref={frameRef} className="vitruvian-frame">
            <VitruvianCanvas />

            {/* Golden geometric overlay — circle + square from the original drawing */}
            <svg
              className="vitruvian-geometry"
              viewBox="0 0 448 448"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="224" cy="224" r="214" stroke="#B8953F" strokeWidth="0.75" opacity="0.45" />
              <rect x="24" y="54" width="400" height="340" stroke="#B8953F" strokeWidth="0.75" opacity="0.28" />
              <line x1="224" y1="4"   x2="224" y2="444" stroke="#B8953F" strokeWidth="0.5" opacity="0.15" />
              <line x1="4"   y1="224" x2="444" y2="224" stroke="#B8953F" strokeWidth="0.5" opacity="0.15" />
              <circle cx="224" cy="10"  r="2.5" fill="#B8953F" opacity="0.5" />
              <circle cx="224" cy="438" r="2.5" fill="#B8953F" opacity="0.5" />
              <circle cx="10"  cy="224" r="2.5" fill="#B8953F" opacity="0.5" />
              <circle cx="438" cy="224" r="2.5" fill="#B8953F" opacity="0.5" />
              <line x1="60"  y1="60"  x2="75"  y2="75"  stroke="#B8953F" strokeWidth="0.5" opacity="0.25" />
              <line x1="388" y1="60"  x2="373" y2="75"  stroke="#B8953F" strokeWidth="0.5" opacity="0.25" />
              <line x1="60"  y1="388" x2="75"  y2="373" stroke="#B8953F" strokeWidth="0.5" opacity="0.25" />
              <line x1="388" y1="388" x2="373" y2="373" stroke="#B8953F" strokeWidth="0.5" opacity="0.25" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  )
}
