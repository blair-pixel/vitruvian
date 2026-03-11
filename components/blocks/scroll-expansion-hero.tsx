'use client';
import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  bgGradient?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  bgGradient,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 160 : 140);
  const textOpacity = Math.max(0, 1 - scrollProgress * 2.2);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>

          {/* Full-screen background — fades out as media expands */}
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            {bgGradient ? (
              <div className='w-full h-full' style={{ background: bgGradient }} />
            ) : bgImageSrc ? (
              <Image
                src={bgImageSrc}
                alt='Background'
                width={1920}
                height={1080}
                className='w-screen h-screen'
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            ) : null}
          </motion.div>

          {/* Title — centred together at rest, spreads apart on scroll */}
          <div
            className='absolute left-0 right-0 z-20 flex items-center justify-center pointer-events-none'
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <span
              style={{
                transform: `translateX(-${textTranslateX * 0.38}vw)`,
                opacity: textOpacity,
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 9.5vw, 120px)',
                color: '#ffffff',
                fontWeight: 700,
                letterSpacing: '-2px',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                mixBlendMode: 'overlay',
                display: 'inline-block',
              }}
            >
              {firstWord}{'\u00A0'}
            </span>
            <span
              style={{
                transform: `translateX(${textTranslateX * 0.38}vw)`,
                opacity: textOpacity,
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 9.5vw, 120px)',
                color: '#E0BC6A',
                fontWeight: 700,
                letterSpacing: '-2px',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                mixBlendMode: 'overlay',
                display: 'inline-block',
              }}
            >
              {restOfTitle}
            </span>
          </div>

          {/* Video + date above it */}
          <div className='w-full flex flex-col items-center justify-center relative z-10 h-[100dvh]'>

            {/* Date — above the expanding video */}
            {date && (
              <p
                className='absolute text-center transition-none'
                style={{
                  top: `calc(50% - ${mediaHeight / 2 + 36}px)`,
                  color: '#B8953F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  opacity: Math.max(0, 1 - scrollProgress * 2),
                  zIndex: 10,
                }}
              >
                {date}
              </p>
            )}

            {/* Gold glow behind video — scales with video */}
            <div
              className='absolute pointer-events-none'
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${mediaWidth + 120}px`,
                height: `${mediaHeight + 120}px`,
                maxWidth: '100vw',
                maxHeight: '100vh',
                background: 'radial-gradient(ellipse at center, rgba(184,149,63,0.32) 0%, rgba(184,149,63,0.10) 45%, transparent 70%)',
                filter: 'blur(35px)',
                borderRadius: '40px',
                zIndex: 0,
              }}
            />

            {/* Expanding media */}
            <div
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl overflow-hidden'
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
                zIndex: 1,
                boxShadow: '0 0 50px 8px rgba(184,149,63,0.18), 0 0 120px 30px rgba(184,149,63,0.07)',
              }}
            >
              {mediaType === 'video' ? (
                <div className='relative w-full h-full pointer-events-none'>
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='auto'
                    className='w-full h-full object-cover'
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                  <motion.div
                    className='absolute inset-0 bg-black/40'
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              ) : (
                <div className='relative w-full h-full'>
                  <Image
                    src={mediaSrc}
                    alt={title || 'Vitruvian Dental Studio'}
                    width={1280}
                    height={720}
                    className='w-full h-full object-cover'
                  />
                  <motion.div
                    className='absolute inset-0 bg-black/40'
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0.6 - scrollProgress * 0.4 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Children — revealed after full expansion */}
          <div className='w-full'>
            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
