'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

type NavChild = { label: string; href: string }
type NavItem  = { label: string; href: string; children?: NavChild[] }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Treatments',
    href: '/treatments',
    children: [
      { label: 'Teeth Straightening', href: '/treatments/teeth-straightening' },
      { label: 'Composite Bonding', href: '/treatments/composite-bonding' },
      { label: 'Implants', href: '/treatments/implants' },
      { label: 'Dentures', href: '/treatments/dentures' },
      { label: 'Whitening', href: '/treatments/whitening' },
      { label: 'Veneers & Crowns', href: '/treatments/veneers-crowns' },
      { label: 'More…', href: '/treatments' },
    ],
  },
  { label: 'Celebs', href: '/celebs' },
  { label: 'Smile Transformations', href: '/smile-transformations' },
  { label: 'Fees & Finance', href: '/fees-finance' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Founders', href: '/about/founders' },
      { label: 'Locations — Barnsley & Leeds', href: '/about/locations' },
      { label: 'Meet the Team', href: '/about/team' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

const GOLD = '#B8953F'

export function Navbar() {
  const pathname = usePathname()

  // Derive active item from current URL
  const activeItem = (() => {
    const match = NAV_ITEMS.find((item) => {
      if (item.href === '/') return pathname === '/'
      return pathname.startsWith(item.href)
    })
    return match?.label ?? 'Home'
  })()

  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()

  /* ── close mobile on wide resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const openDrop  = (label: string) => { clearTimeout(closeTimer.current); setOpenDropdown(label) }
  const closeDrop = ()              => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 130) }
  const keepDrop  = ()              => clearTimeout(closeTimer.current)

  return (
    <>
      {/* ══════════════════════  FLOATING PILL NAV  ══════════════════════ */}
      <div className='fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-[1160px]'>
        <nav
          style={{
            background: 'rgba(10,10,8,0.82)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(184,149,63,0.18)',
            borderRadius: '14px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className='flex items-center h-[54px] px-4 gap-1'>

            {/* ── Logo ── */}
            <Link
              href='/'
              className='flex items-center gap-3 select-none shrink-0 mr-2'
            >
              <Image
                src='/vitruvian-logo.webp'
                alt='Vitruvian Dental Studio'
                width={36}
                height={36}
                className='shrink-0'
                style={{ objectFit: 'contain' }}
              />
              <div className='flex flex-col leading-none'>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '1.8px',
                }}>
                  VITRUVIAN
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '7px',
                  fontWeight: 300,
                  color: GOLD,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}>
                  Dental Studio
                </span>
              </div>
            </Link>

            {/* ── Divider ── */}
            <div className='hidden lg:block shrink-0 w-px h-5 mx-2' style={{ background: 'rgba(184,149,63,0.22)' }} />

            {/* ── Desktop nav items ── */}
            <div className='hidden lg:flex items-center flex-1'>
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className='relative'
                  onMouseEnter={() => item.children && openDrop(item.label)}
                  onMouseLeave={() => item.children && closeDrop()}
                >
                  <Link
                    href={item.href}
                    className='relative flex items-center gap-[3px] px-[10px] py-[6px] rounded-lg focus:outline-none group'
                  >
                    {/* Active bg */}
                    {activeItem === item.label && (
                      <motion.span
                        layoutId='pill-active'
                        className='absolute inset-0 rounded-lg -z-10'
                        style={{ background: 'rgba(184,149,63,0.1)' }}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}

                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: activeItem === item.label ? 500 : 400,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      color: activeItem === item.label ? GOLD : 'rgba(255,255,255,0.65)',
                      transition: 'color 0.15s',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.label}
                    </span>

                    {item.children && (
                      <ChevronDown size={10} style={{
                        color: activeItem === item.label ? GOLD : 'rgba(255,255,255,0.3)',
                        transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.18s, color 0.15s',
                        marginTop: '1px',
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>

                  {/* ── Dropdown panel ── */}
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y:  4, scale: 1    }}
                          exit   ={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.13, ease: 'easeOut' }}
                          className='absolute top-full left-0 rounded-xl overflow-hidden'
                          style={{
                            minWidth: '228px',
                            background: 'rgba(11,10,8,0.97)',
                            border: '1px solid rgba(184,149,63,0.2)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(12px)',
                          }}
                          onMouseEnter={keepDrop}
                          onMouseLeave={closeDrop}
                        >
                          <div style={{ height: '2px', background: `linear-gradient(90deg, ${GOLD} 0%, rgba(184,149,63,0.25) 100%)` }} />
                          <div className='py-2'>
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className='flex items-center px-5 py-[9px] transition-all duration-150'
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: '13px',
                                  fontWeight: 300,
                                  color: 'rgba(255,255,255,0.6)',
                                  letterSpacing: '0.2px',
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement
                                  el.style.color = GOLD
                                  el.style.background = 'rgba(184,149,63,0.07)'
                                  el.style.paddingLeft = '22px'
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement
                                  el.style.color = 'rgba(255,255,255,0.6)'
                                  el.style.background = 'transparent'
                                  el.style.paddingLeft = '20px'
                                }}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* ── Right: Book Now + hamburger ── */}
            <div className='flex items-center gap-3 ml-auto shrink-0'>
              <Link
                href='/contact'
                className='hidden lg:block transition-opacity duration-150 hover:opacity-85'
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                  color: '#0D0D0B',
                  background: GOLD,
                  padding: '8px 18px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                }}
                >
                  Book Now
              </Link>

              <button
                className='lg:hidden flex items-center justify-center w-9 h-9 rounded-lg'
                style={{ background: 'rgba(184,149,63,0.1)' }}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label='Toggle menu'
              >
                <AnimatePresence mode='wait' initial={false}>
                  {mobileOpen ? (
                    <motion.span key='x'  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}>
                      <X size={18} color='#fff' />
                    </motion.span>
                  ) : (
                    <motion.span key='hb' initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:-90, opacity: 0 }} transition={{ duration: 0.14 }}>
                      <Menu size={18} color='rgba(255,255,255,0.85)' />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </nav>
      </div>

      {/* ═══════════════════════  MOBILE OVERLAY  ═══════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit  ={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-40 flex flex-col'
            style={{ background: 'rgba(9,9,7,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className='h-[84px] shrink-0' /> {/* spacer under pill */}

            <div className='flex-1 overflow-y-auto px-7 py-4'>
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x: 0   }}
                  exit  ={{ opacity: 0,  x: -16  }}
                  transition={{ duration: 0.16, delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid rgba(184,149,63,0.1)' }}
                >
                  <div
                    className='flex items-center justify-between py-4 cursor-pointer select-none'
                    onClick={() => {
                      if (item.children) {
                        setMobileExpanded((v) => v === item.label ? null : item.label)
                      } else {
                        setMobileOpen(false)
                      }
                    }}
                  >
                    {item.children ? (
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '26px',
                        fontWeight: 500,
                        letterSpacing: '-0.5px',
                        color: activeItem === item.label ? GOLD : '#fff',
                      }}>
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '26px',
                          fontWeight: 500,
                          letterSpacing: '-0.5px',
                          color: activeItem === item.label ? GOLD : '#fff',
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.children && (
                      <ChevronDown size={16} style={{
                        color: GOLD,
                        transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }} />
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {item.children && mobileExpanded === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit  ={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className='pb-4 pl-2'>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className='block py-2'
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '14px',
                                fontWeight: 300,
                                color: 'rgba(255,255,255,0.5)',
                              }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1,  y: 0  }}
                exit  ={{ opacity: 0         }}
                transition={{ duration: 0.18, delay: NAV_ITEMS.length * 0.04 + 0.06 }}
                className='mt-8 pb-8'
              >
                <Link
                  href='/contact'
                  className='block text-center py-4 rounded-xl'
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#0D0D0B',
                    background: GOLD,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Book a Consultation
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
