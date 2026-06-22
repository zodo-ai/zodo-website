"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";
import { HospitalWebBanner } from "@/network/hospital-web/types";

interface HeroSectionProps {
  title?: string;
  description?: string;
  banners?: HospitalWebBanner[];
}

export function HeroSection({
  title = "",
  description = "",
  banners = [],
}: HeroSectionProps) {
  const images = banners.filter((b) => b.is_active).map((b) => b.image).filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={styles.hero}>
      {/* Background Carousel */}
      {images.length > 0 && (
        <div className={styles.backgroundContainer}>
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Hero Background ${index + 1}`}
              fill
              className={`${styles.backgroundImage} ${index === currentImageIndex ? styles.active : ""}`}
              priority={index === 0}
            />
          ))}
        </div>
      )}

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentImageIndex ? styles.indicatorActive : ""}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
