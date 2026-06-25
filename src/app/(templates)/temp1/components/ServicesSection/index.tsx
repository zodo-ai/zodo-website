"use client";

import { useRef, useState, useEffect, useCallback } from "react";

import Link from "next/link";
import styles from "./ServicesSection.module.css";
import { HospitalServiceI } from "@/network/hospital-services/types";

interface ServicesSectionProps {
  services?: HospitalServiceI[];
  hospitalId?: string;
}

export function ServicesSection({
  services = [],
  hospitalId = "",
}: ServicesSectionProps) {
  const displayServices = services.slice(0, 4);

  const gridRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncArrows = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows]);

  const scrollGrid = (dir: "left" | "right") => {
    const el = gridRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "right" ? el.clientWidth * 0.75 : -(el.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  if (displayServices.length === 0) return null;

  return (
    <section id="services" className={styles.section} aria-labelledby="services-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="services-heading" className={styles.title}>
            Our Services
          </h2>
          <Link
            href={hospitalId ? `/temp1/${hospitalId}/our-services` : "our-services"}
            className={styles.viewAll}
          >
            View All Services
          </Link>
        </div>

        <div className={styles.gridWrapper}>
          {/* Left arrow */}
          <button
            aria-label="Scroll left"
            className={`${styles.arrow} ${styles.arrowLeft} ${!canScrollLeft ? styles.arrowHidden : ""}`}
            onClick={() => scrollGrid("left")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable grid — add ref here */}
          <ul ref={gridRef} className={styles.grid}>
            {displayServices.map((service) => (
              <li key={service.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <span className={styles.badge}>Service</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{service.name}</h3>
                  <p className={styles.description}>
                    {service.description || "Professional healthcare service."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <button
            aria-label="Scroll right"
            className={`${styles.arrow} ${styles.arrowRight} ${!canScrollRight ? styles.arrowHidden : ""}`}
            onClick={() => scrollGrid("right")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}