"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Expand, Images } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "./warehouse-plan-gallery.module.css";

const plans = [
  {
    title: "Unit comparison",
    description: "Ground-floor, mezzanine and total floor areas for all five units.",
    src: "/besa-assets/stage-one-unit-comparison.png",
    alt: "Comparison of the five Stage One units showing ground, mezzanine and total floor areas",
  },
  {
    title: "Ground-floor plan",
    description: "Five warehouse units with office and amenity areas.",
    src: "/besa-assets/stage-one-ground-floor-plan.png",
    alt: "Stage One ground-floor plan showing five warehouses with office and amenity areas",
  },
  {
    title: "Mezzanine plan",
    description: "Upper-level office and mezzanine configuration.",
    src: "/besa-assets/stage-one-mezzanine-plan.png",
    alt: "Stage One mezzanine plan showing upper-level office areas",
  },
  {
    title: "Front elevation",
    description: "Indicative frontage with glazed entries and roller doors.",
    src: "/besa-assets/stage-one-front-elevation.png",
    alt: "Stage One front elevation with glazed entries and roller doors",
  },
  {
    title: "Stage One site plan",
    description: "Simplified site arrangement showing access and shared parking.",
    src: "/besa-assets/stage-one-site-plan.png",
    alt: "Simplified Stage One site plan showing five units, access and shared parking",
  },
] as const;

export function WarehousePlanGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selected = plans[selectedIndex];

  const selectPrevious = () => {
    setSelectedIndex((current) => (current - 1 + plans.length) % plans.length);
  };

  const selectNext = () => {
    setSelectedIndex((current) => (current + 1) % plans.length);
  };

  return (
    <>
      <details className={styles.gallery}>
        <summary className={styles.summary}>
          <span className={styles.summaryLead}>
            <span className={styles.icon}><Images aria-hidden="true" /></span>
            <span><small>Stage One documentation</small><strong>View plans &amp; elevations</strong></span>
          </span>
          <span className={styles.summaryMeta}>5 drawings <ChevronDown className={styles.summaryChevron} aria-hidden="true" /></span>
        </summary>

        <div className={styles.content}>
          <div className={styles.viewerHeading} aria-live="polite">
            <div><small>{String(selectedIndex + 1).padStart(2, "0")} / 05</small><h3>{selected.title}</h3></div>
            <p>{selected.description}</p>
          </div>

          <button
            className={styles.featured}
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Enlarge ${selected.title}`}
          >
            <img src={selected.src} alt={selected.alt} />
            <span>Enlarge drawing <Expand aria-hidden="true" /></span>
          </button>

          <div className={styles.thumbnailStrip} role="tablist" aria-label="Choose a Stage One drawing">
            {plans.map((plan, index) => (
              <button
                className={styles.thumbnail}
                data-active={index === selectedIndex}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Show ${plan.title}`}
                onClick={() => setSelectedIndex(index)}
                key={plan.src}
              >
                <img src={plan.src} alt="" />
                <span>{plan.title}</span>
              </button>
            ))}
          </div>
        </div>
      </details>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className={styles.lightbox}>
          <DialogHeader className={styles.lightboxHeader}>
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogDescription>{selected.description}</DialogDescription>
          </DialogHeader>
          <div className={styles.lightboxImage}>
            <img src={selected.src} alt={selected.alt} />
            <button className={`${styles.lightboxNav} ${styles.previous}`} type="button" onClick={selectPrevious} aria-label="Previous drawing"><ChevronLeft aria-hidden="true" /></button>
            <button className={`${styles.lightboxNav} ${styles.next}`} type="button" onClick={selectNext} aria-label="Next drawing"><ChevronRight aria-hidden="true" /></button>
          </div>
          <div className={styles.lightboxFooter}>
            <span>{selectedIndex + 1} of {plans.length}</span>
            <span>Use the arrows to move between drawings</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
