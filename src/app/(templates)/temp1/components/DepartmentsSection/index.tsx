"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, Stethoscope } from "lucide-react";
import Link from "next/link";
import styles from "./DepartmentsSection.module.css";
import { DepartmentI } from "@/network/departments/types";

interface DepartmentsSectionProps {
  departments?: DepartmentI[];
  hospitalId?: string;
}

export function DepartmentsSection({
  departments = [],
  hospitalId = "",
}: DepartmentsSectionProps) {

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

  if (departments.length === 0) return null;

  return (
    <section id="departments" className={styles.section} aria-labelledby="departments-heading">
      <div className={styles.container}>
        <h2 id="departments-heading" className={styles.title}>
          Our Departments
        </h2>

        <div className={styles.gridWrapper}>
          {/* Left arrow */}
          <button
            aria-label="Scroll left"
            className={`${styles.arrow} ${styles.arrowLeft} ${!canScrollLeft ? styles.arrowHidden : ""}`}
            onClick={() => scrollGrid("left")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <ul ref={gridRef} className={styles.grid} aria-label="Departments">
            {departments.map((dept) => (
              <li key={dept.id} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Stethoscope className={styles.icon} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className={styles.name}>{dept.name}</p>
              </li>
            ))}
          </ul>

          {/* Right arrow */}
          <button
            aria-label="Scroll right"
            className={`${styles.arrow} ${styles.arrowRight} ${!canScrollRight ? styles.arrowHidden : ""}`}
            onClick={() => scrollGrid("right")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className={styles.footer}>
          <Link
            href={hospitalId ? `/temp1/${hospitalId}/our-departments` : "our-departments"}
            className={styles.viewAll}
          >
            View All Departments
            <ArrowRight className={styles.arrowIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}