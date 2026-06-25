"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { HospitalWebBanner } from "@/network/hospital-web/types";

interface HeroSectionProps {
  title?: string;
  description?: string;
  banners?: HospitalWebBanner[];
}

const AUTO_PLAY_INTERVAL_MS = 5000;

export function HeroSection({ banners = [] }: HeroSectionProps) {
  const images = banners
    .filter((banner) => banner.is_active)
    .map((banner) => banner.image)
    .filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={styles.hero} aria-label="Hero banner">
      {images.length > 0 && (
        <div className={styles.bannerWrapper}>
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Hero banner ${index + 1}`}
              fill
              sizes="100vw"
              priority={index === 0}
              className={[
                styles.backgroundImage,
                index === currentImageIndex && styles.active,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}

          {images.length > 1 && (
            <div
              className={styles.indicators}
              role="tablist"
              aria-label="Banner slides"
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === currentImageIndex}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={[
                    styles.indicator,
                    index === currentImageIndex && styles.indicatorActive,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}