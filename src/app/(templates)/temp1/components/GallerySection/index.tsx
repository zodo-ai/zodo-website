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
  // Filter to only images that have an actual URL
  const images = gallery.filter((g) => g.image && g.image.trim() !== "");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // ---------- Modal helpers ----------
  const openLightbox = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToPrev = useCallback(() => {
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
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

  // ---------- Render nothing if gallery data is completely empty ----------
  if (gallery.length === 0) return null;

  // ---------- Determine grid items ----------
  const gridImages = images.slice(0, MAX_GRID_ITEMS);
  const remaining = images.length - MAX_GRID_ITEMS;

  // Pick appropriate grid class based on count
  const getGridClass = () => {
    if (images.length === 1) return styles.singleGrid;
    if (images.length === 2) return styles.twoGrid;
    return styles.grid;
  };

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.container}>
        {/* ---- Header ---- */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Our Hospital Gallery</h2>
            <p>Take a look inside {hospitalName}</p>
          </div>

          {images.length > 0 && (
            <div className={styles.headerRight}>
              <span className={styles.photoCount}>
                <Camera size={15} />
                {images.length} Photo{images.length !== 1 ? "s" : ""}
              </span>
              <button className={styles.viewAllBtn} onClick={() => openLightbox(0)}>
                View All Photos <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* ---- Gallery Grid or Empty State ---- */}
        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No photos yet</p>
            <p className={styles.emptySubtitle}>
              Gallery photos will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div className={getGridClass()}>
            {gridImages.map((item, index) => {
              const isLast =
                index === gridImages.length - 1 && remaining > 0;

              return (
                <div
                  key={item.id}
                  className={styles.gridItem}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={item.image}
                    alt={item.caption || `Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  {isLast && (
                    <div className={styles.moreOverlay}>
                      <span className={styles.moreCount}>+{remaining}</span>
                      <span className={styles.moreLabel}>More Photos</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======== MODAL ======== */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* --- Single-Image Lightbox --- */}
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={closeModal}>
              <X size={20} />
            </button>

            <div className={styles.modalImageWrap}>
              {images.length > 1 && (
                <button
                  className={`${styles.modalNav} ${styles.modalNavLeft}`}
                  onClick={goToPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <img
                key={modalIndex}
                className={styles.modalImage}
                src={images[modalIndex].image}
                alt={
                  images[modalIndex].caption ||
                  `Gallery image ${modalIndex + 1}`
                }
              />

              {images.length > 1 && (
                <button
                  className={`${styles.modalNav} ${styles.modalNavRight}`}
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Caption */}
            {images[modalIndex].caption && (
              <p className={styles.modalCaption}>
                {images[modalIndex].caption}
              </p>
            )}

            {/* Counter */}
            <p className={styles.modalCounter}>
              {modalIndex + 1} / {images.length}
            </p>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className={
                      idx === modalIndex
                        ? styles.thumbnailActive
                        : styles.thumbnail
                    }
                    onClick={() => setModalIndex(idx)}
                  >
                    <img
                      src={item.image}
                      alt={item.caption || `Thumbnail ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
