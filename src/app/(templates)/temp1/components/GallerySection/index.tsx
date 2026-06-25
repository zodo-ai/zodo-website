"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  ImageIcon,
  ArrowRight,
} from "lucide-react";
import styles from "./GallerySection.module.css";
import { GalleryItem } from "@/network/hospital-web/types";

interface GallerySectionProps {
  gallery?: GalleryItem[];
  hospitalName?: string;
}

/** Maximum images shown in the main grid before showing a "+N more" overlay */
const MAX_GRID_ITEMS = 9;

export function GallerySection({
  gallery = [],
  hospitalName = "Our Hospital",
}: GallerySectionProps) {
  const images = gallery.filter((g) => g.image && g.image.trim() !== "");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openLightbox = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goToPrev = useCallback(() => {
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [modalOpen, goToPrev, goToNext]);

  if (gallery.length === 0) return null;

  const gridImages = images.slice(0, MAX_GRID_ITEMS);
  const remaining = images.length - MAX_GRID_ITEMS;

  const getGridClass = () => {
    if (images.length === 1) return styles.singleGrid;
    if (images.length === 2) return styles.twoGrid;
    return styles.grid;
  };

  const current = images[modalIndex];

  return (
    <section id="gallery" className={styles.section} aria-labelledby="gallery-heading">
      <div className={styles.container}>
        {/* ---- Header ---- */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id="gallery-heading" className={styles.headerTitle}>
              Our Hospital Gallery
            </h2>
            <p className={styles.headerSubtitle}>
              Take a look inside {hospitalName}
            </p>
          </div>

          {images.length > 0 && (
            <div className={styles.headerRight}>
              <span className={styles.photoCount}>
                <Camera className={styles.photoIcon} aria-hidden="true" />
                {images.length} Photo{images.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                className={styles.viewAllBtn}
                onClick={() => openLightbox(0)}
              >
                View All Photos
                <ArrowRight className={styles.arrowIcon} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* ---- Gallery Grid or Empty State ---- */}
        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyTitle}>No photos yet</p>
            <p className={styles.emptySubtitle}>
              Gallery photos will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div className={getGridClass()}>
            {gridImages.map((item, index) => {
              const isLast = index === gridImages.length - 1 && remaining > 0;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={styles.gridItem}
                  onClick={() => openLightbox(index)}
                  aria-label={item.caption || `Open gallery image ${index + 1}`}
                >
                  <Image
                    src={item.image}
                    alt={item.caption || `Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
                    className={styles.gridImage}
                  />
                  {isLast && (
                    <span className={styles.moreOverlay}>
                      <span className={styles.moreCount}>+{remaining}</span>
                      <span className={styles.moreLabel}>More Photos</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ======== MODAL ======== */}
      {modalOpen && current && (
        <div
          className={styles.modalBackdrop}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Close gallery"
            >
              <X className={styles.closeIcon} aria-hidden="true" />
            </button>

            <div className={styles.modalImageWrap}>
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavLeft}`}
                  onClick={goToPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft className={styles.navArrowIcon} aria-hidden="true" />
                </button>
              )}

              <img
                key={modalIndex}
                className={styles.modalImage}
                src={current.image}
                alt={current.caption || `Gallery image ${modalIndex + 1}`}
              />

              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavRight}`}
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className={styles.navArrowIcon} aria-hidden="true" />
                </button>
              )}
            </div>

            {current.caption && (
              <p className={styles.modalCaption}>{current.caption}</p>
            )}

            <p className={styles.modalCounter}>
              {modalIndex + 1} / {images.length}
            </p>

            {images.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {images.map((item, idx) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      idx === modalIndex ? styles.thumbnailActive : styles.thumbnail
                    }
                    onClick={() => setModalIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    aria-current={idx === modalIndex}
                  >
                    <img src={item.image} alt={item.caption || `Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}