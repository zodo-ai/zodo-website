"use client";

import Image from "next/image";
import { BadgeCheck, Stethoscope, Users, HeartHandshake } from "lucide-react";
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
  const images = banners.filter((b) => b.is_active).map((b) => b.image);

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
          {/* Gradient Overlay */}
          <div className={styles.gradientOverlay}></div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.textContent}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>
              Trusted Care. Beautiful Smiles.
            </span>
          </div>

          <h1 className={styles.heading}>
            {title}
            {description && (
              <>
                <br />
                <span className={styles.description}>{description}</span>
              </>
            )}
          </h1>

          {/* Features */}
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BadgeCheck size={24} />
              </div>
              <span className={styles.featureText}>
                Advanced
                <br />
                Technology
              </span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Stethoscope size={24} />
              </div>
              <span className={styles.featureText}>
                Experienced
                <br />
                Doctors
              </span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <HeartHandshake size={24} />
              </div>
              <span className={styles.featureText}>
                Patient-Centered
                <br />
                Care
              </span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <span className={styles.featureText}>
                Affordable &<br />
                Transparent
              </span>
            </div>
          </div>
        </div>
      </div>

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
