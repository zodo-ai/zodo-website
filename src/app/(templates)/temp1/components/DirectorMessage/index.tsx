import Image from "next/image";
import { Quote } from "lucide-react";
import styles from "./DirectorMessage.module.css";

interface DirectorMessageProps {
  directorName?: string;
  directorTitle?: string;
  directorMessage?: string;
}

export function DirectorMessage({
  directorName,
  directorTitle,
  directorMessage,
}: DirectorMessageProps) {
  if (!directorName && !directorMessage && !directorTitle) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          
          {/* Image */}
          <div className={styles.imageWrapper}>
            <Image 
              src="https://images.unsplash.com/photo-1594824436998-058d01de1a24?q=80&w=1964&auto=format&fit=crop" 
              alt="Hospital Director" 
              fill
              className={styles.image}
            />
          </div>

          {/* Text Content */}
          <div className={styles.content}>
            <Quote size={80} className={styles.quoteIcon} />
            
            <h4 className={styles.subtitle}>
              Director&apos;s Message
            </h4>
            <h2 className={styles.title}>
              {directorTitle || "A Personal Commitment to Your Smile"}
            </h2>
            <div className={styles.description}>
              {directorMessage || "At Dr Sahila's Dental Hub, our mission is to provide world-class dental care with compassion, integrity, and excellence. We strive to make every patient's experience comfortable and memorable."}
            </div>
            
            <div className={styles.authorSection}>
              {/* Fake signature using a cursive font or styled text */}
              <div className={styles.signature}>
                {directorName || "Dr. Sahila Khan"}
              </div>
              <h3 className={styles.authorName}>{directorName || "Dr. Sahila Khan"}</h3>
              <p className={styles.authorRole}>Hospital Director</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
