import Link from "next/link";
import styles from "./ServicesSection.module.css";
import { HospitalServiceI } from "@/network/hospital-services/types";

interface ServicesSectionProps {
  services?: HospitalServiceI[];
  hospitalId?: string;
}

export function ServicesSection({ services = [], hospitalId = "" }: ServicesSectionProps) {
  const displayServices = services.slice(0, 4);
  if (displayServices.length === 0) return null;

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Services</h2>
          <Link href={hospitalId ? `/temp1/${hospitalId}/our-services` : "our-services"} className={styles.viewAll}>
            View All Services
          </Link>
        </div>

        <div className={styles.grid}>
          {displayServices.map((service) => (
            <div key={service.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <div className={styles.badge}>Service</div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.description}>
                  {service.description || "Professional healthcare service."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
