import Image from "next/image";
import Link from "next/link";
import styles from "./DoctorsSection.module.css";
import { DoctorI } from "@/network/doctors/types";

interface DoctorsSectionProps {
  doctors?: DoctorI[];
}

function getExperience(workStartDate: string | ""): string {
  if (!workStartDate) return "";
  const start = new Date(workStartDate);
  const now = new Date();
  const years = Math.floor(
    (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  if (years < 1) return "< 1 Year Experience";
  return `${years}+ Years Experience`;
}

export function DoctorsSection({ doctors = [] }: DoctorsSectionProps) {
  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Available Doctors</h2>
          <Link href="#doctors" className={styles.viewAll}>
            View All Doctors
          </Link>
        </div>

        <div className={styles.grid}>
          {doctors.map((doctor) => (
            <div key={doctor.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {doctor.profile_pic && (
                  <Image
                    src={doctor.profile_pic}
                    alt={doctor.name}
                    fill
                    className={styles.doctorImage}
                  />
                )}
                <div className={styles.badge}>
                  {doctor.specialisations?.[0]?.name ?? "Doctor"}
                </div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{doctor.name}</h3>
                <p className={styles.role}>
                  {doctor.specialisations
                    ?.map((s) => s.name)
                    .join(", ") ?? ""}
                </p>
                <p className={styles.experience}>
                  {getExperience(doctor.work_start_date ?? "")}
                </p>
                <button className={styles.profileButton}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
