import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  hospitalName?: string;
  aboutUs?: string;
  aboutUsImage?: string;
}

export function AboutSection({
  hospitalName = "",
  aboutUs = "",
  aboutUsImage = "",
}: AboutSectionProps) {
  return (
    <section id="about-us" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <h4 className={styles.subtitle}>About Us</h4>
            <h2 className={styles.title}>
              {hospitalName ? `About ${hospitalName}` : "About Us"}
            </h2>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: aboutUs || "Welcome to our hospital" }}
            />
            <button className={styles.button}>
              Learn More About Us
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Image */}
          <div className={styles.imageContent}>
            <Image
              src={aboutUsImage || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop"}
              alt="Hospital"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
