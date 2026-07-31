import Image from "next/image";
import { Quote } from "lucide-react";
import styles from "./DirectorMessage.module.css";

interface DirectorMessageProps {
  directorName?: string;
  directorTitle?: string;
  directorMessage?: string;
  directorImage?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1594824436998-058d01de1a24?q=80&w=1964&auto=format&fit=crop";

export function DirectorMessage({
  directorName,
  directorTitle,
  directorMessage,
  directorImage,
}: DirectorMessageProps) {
  if (!directorName && !directorMessage && !directorTitle) return null;

  const name = directorName || "Dr. Sahila Khan";

  return (
    <section className={styles.section} aria-labelledby="director-heading">
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Image */}
          <div className={styles.imageWrapper}>
            <Image
              src={directorImage || DEFAULT_IMAGE}
              alt={name}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className={styles.image}
            />
          </div>

          {/* Text Content */}
          <div className={styles.content}>
            <Quote className={styles.quoteIcon} aria-hidden="true" />

            <h4 className={styles.subtitle}>Director&apos;s Message</h4>
            <h2 id="director-heading" className={styles.title}>
              {directorTitle || "A Personal Commitment to Your Smile"}
            </h2>
            <p className={styles.description}>
              {directorMessage ||
                "At Dr Sahila's Dental Hub, our mission is to provide world-class dental care with compassion, integrity, and excellence. We strive to make every patient's experience comfortable and memorable."}
            </p>

            <div className={styles.authorSection}>
              <div className={styles.signature} aria-hidden="true">
                {name}
              </div>
              <h3 className={styles.authorName}>{name}</h3>
              <p className={styles.authorRole}>Hospital Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}