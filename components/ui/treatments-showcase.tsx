"use client"

import Link from "next/link"
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/ui/animated-slideshow"

const SLIDES = [
  {
    id: "invisalign",
    title: "Invisalign",
    subtitle: "Discreet teeth straightening",
    href: "/treatments/teeth-straightening",
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-1ffbb8a22c73?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
  {
    id: "composite-bonding",
    title: "Composite Bonding",
    subtitle: "Natural edge, shape and symmetry refinement",
    href: "/treatments/composite-bonding",
    imageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
  {
    id: "implants",
    title: "Implants",
    subtitle: "Permanent replacement for missing teeth",
    href: "/treatments/implants",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
  {
    id: "dentures",
    title: "Dentures",
    subtitle: "Modern full and partial smile restoration",
    href: "/treatments/dentures",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
  {
    id: "tooth-whitening",
    title: "Tooth Whitening",
    subtitle: "Professional brightening with controlled results",
    href: "/treatments/whitening",
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
  {
    id: "veneers-crowns",
    title: "Veneers & Crowns",
    subtitle: "Premium ceramic smile enhancement",
    href: "/treatments/veneers-crowns",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&h=2000&fit=crop&auto=format&q=80",
  },
]

function TreatmentRows() {
  const { activeSlide, changeSlide } = useHoverSliderContext()

  return (
    <div className="order-2 flex flex-col gap-0.5 lg:order-1">
      {SLIDES.map((slide, index) => {
        const isActive = activeSlide === index

        return (
          <Link
            key={slide.id}
            href={slide.href}
            onMouseEnter={() => changeSlide(index)}
            onFocus={() => changeSlide(index)}
            onClick={() => changeSlide(index)}
            className="group block py-1.5 text-center md:py-2 lg:text-left"
          >
            <TextStaggerHover
              index={index}
              text={slide.title}
              className={
                isActive
                  ? "cursor-pointer text-[clamp(1.25rem,2.2vw,2.85rem)] font-semibold uppercase leading-[0.96] tracking-[-0.06em] text-[#b8953f] outline-none"
                  : "cursor-pointer text-[clamp(1.25rem,2.2vw,2.85rem)] font-semibold uppercase leading-[0.96] tracking-[-0.06em] text-[#d1cbc0] outline-none transition-colors group-hover:text-[#b8953f] group-focus-within:text-[#b8953f]"
              }
            />
            {isActive ? (
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#7a7163] opacity-100 transition-opacity lg:max-w-sm mx-auto lg:mx-0">
                {slide.subtitle}
              </p>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}

export function TreatmentsShowcase() {
  return (
    <HoverSlider className="relative overflow-hidden bg-[#f5f1e8] px-6 py-10 text-[#2f2a20] md:px-10 md:py-14">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 text-center md:mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#b8953f]">
            Our Treatments
          </p>
        </div>

        <div className="mx-auto grid max-w-[980px] items-center justify-center gap-8 text-center lg:grid-cols-[440px_340px] lg:gap-14 lg:text-left">
          <div className="max-w-[440px]">
            <TreatmentRows />
          </div>

          <div className="order-1 mx-auto w-full max-w-[340px] lg:order-2 lg:mx-0">
            <HoverSliderImageWrap className="aspect-[4/5.15] overflow-hidden rounded-[8px] bg-[#ece6db] shadow-[0_16px_30px_rgba(68,54,26,0.07)]">
              {SLIDES.map((slide, index) => (
                <div key={slide.id}>
                  <HoverSliderImage
                    index={index}
                    imageUrl={slide.imageUrl}
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="size-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ))}
            </HoverSliderImageWrap>
          </div>
        </div>
      </div>
    </HoverSlider>
  )
}
