"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import styles from "./TestimonialsSection.module.css";
import { TestimonialItem } from "@/network/hospital-web/types";

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection({
  testimonials = [],
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonials[currentIndex];
  const ratingCount = Math.round(parseFloat(current.rating || "5"));

  return (
    <section className={styles.section}>
      {/* Decorative leaf images on sides */}
      <div className={styles.decorationLeft}></div>
      <div className={styles.decorationRight}></div>

      <div className={styles.container}>
        <h2 className={styles.title}>What Our Patients Say</h2>

        <div className={styles.carousel}>
          {/* Carousel Buttons */}
          {testimonials.length > 1 && (
            <>
              <button className={styles.navButtonLeft} onClick={goToPrev}>
                <ChevronLeft size={20} />
              </button>
              <button className={styles.navButtonRight} onClick={goToNext}>
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className={styles.card}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={styles.starIcon}
                  style={{ opacity: i < ratingCount ? 1 : 0.3 }}
                />
              ))}
            </div>

            <p className={styles.quoteText}>
              <span className={styles.quoteMarkLeft}>&quot;</span>
              {current.message}
              <span className={styles.quoteMarkRight}>&quot;</span>
            </p>

            <p className={styles.author}>
              - {current.patient_name}
              {current.designation ? `, ${current.designation}` : ""}
            </p>
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className={styles.dots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={
                    index === currentIndex ? styles.dotActive : styles.dot
                  }
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
