"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./DoctorsSection.module.css";
import { DoctorI } from "@/network/doctors/types";

interface DoctorsSectionProps {
  doctors?: DoctorI[];
  hospitalId?: string;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

function getExperience(workStartDate: string): string {
  if (!workStartDate) return "";
  const start = new Date(workStartDate);
  const years = Math.floor((Date.now() - start.getTime()) / MS_PER_YEAR);
  if (years < 1) return "< 1 Year Experience";
  return `${years}+ Years Experience`;
}

export function DoctorsSection({
  doctors = [],
  hospitalId = "",
}: DoctorsSectionProps) {
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
  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className={styles.section} aria-labelledby="doctors-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="doctors-heading" className={styles.title}>
            Our Available Doctors
          </h2>
          <Link
            href={hospitalId ? `/temp1/${hospitalId}/our-doctors` : "our-doctors"}
            className={styles.viewAll}
          >
            View All Doctors
          </Link>
        </div>
        <div className={styles.gridWrapper}>
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

          <ul ref={gridRef} className={styles.grid}>
            {doctors.map((doctor) => (
              <li key={doctor.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  {doctor.profile_pic && (
                    <Image
                      src={doctor.profile_pic}
                      alt={doctor.name}
                      fill
                      sizes="(min-width: 992px) 25vw, 50vw"
                      className={styles.doctorImage}
                    />
                  )}
                  <span className={styles.badge}>
                    {doctor.specialisations?.[0]?.name ?? "Doctor"}
                  </span>
                </div>

                <div className={styles.content}>
                  <h3 className={styles.name}>{doctor.name}</h3>
                  <p className={styles.role}>
                    {doctor.specialisations?.map((s) => s.name).join(", ") ?? ""}
                  </p>
                  <p className={styles.experience}>
                    {getExperience(doctor.work_start_date ?? "")}
                  </p>
                  <Link
                    href={
                      hospitalId
                        ? `/temp1/${hospitalId}/our-doctors/${doctor.id}`
                        : `/our-doctors/${doctor.id}`
                    }
                    className={styles.profileButton}
                  >
                    View Profile
                  </Link>
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