import Image from "next/image";
import { Quote } from "lucide-react";
import styles from "./DirectorMessage.module.css";

export function DirectorMessage() {
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
              A Personal Commitment to Your Smile
            </h2>
            <p className={styles.description}>
              At Dr Sahila&apos;s Dental Hub, our mission is to provide world-class dental care
              with compassion, integrity, and excellence. We strive to make every patient&apos;s
              experience comfortable and memorable.
            </p>
            
            <div className={styles.authorSection}>
              {/* Fake signature using a cursive font or styled text */}
              <div className={styles.signature}>
                Dr. Sahila Khan
              </div>
              <h3 className={styles.authorName}>Dr. Sahila Khan</h3>
              <p className={styles.authorRole}>Hospital Director</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
