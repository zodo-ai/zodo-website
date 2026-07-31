import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  hospitalName?: string;
  aboutUs?: string;
  aboutUsImage?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop";

export function AboutSection({
  hospitalName = "",
  aboutUs = "",
  aboutUsImage = "",
}: AboutSectionProps) {
  return (
    <section id="about-us" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <h4 className={styles.subtitle}>About Us</h4>
            <h2 id="about-heading" className={styles.title}>
              {hospitalName ? `About ${hospitalName}` : "About Us"}
            </h2>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: aboutUs || "Welcome to our hospital",
              }}
            />
            <button type="button" className={styles.button}>
              Learn More About Us
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Image */}
          <div className={styles.imageContent}>
            <Image
              src={aboutUsImage || DEFAULT_IMAGE}
              alt={hospitalName ? `${hospitalName} hospital` : "Hospital"}
              fill
              sizes="(min-width: 992px) 50vw, 100vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}