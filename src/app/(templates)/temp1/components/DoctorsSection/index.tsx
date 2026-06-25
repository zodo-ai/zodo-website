import Image from "next/image";
import Link from "next/link";
import styles from "./DoctorsSection.module.css";
import { DoctorI } from "@/network/doctors/types";

interface DoctorsSectionProps {
  doctors?: DoctorI[];
  hospitalId?: string;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

function getExperience(workStartDate: string): string {
  if (!workStartDate) return "";
  const start = new Date(workStartDate);
  const years = Math.floor((Date.now() - start.getTime()) / MS_PER_YEAR);
  if (years < 1) return "< 1 Year Experience";
  return `${years}+ Years Experience`;
}

export function DoctorsSection({
  doctors = [],
  hospitalId = "",
}: DoctorsSectionProps) {
  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className={styles.section} aria-labelledby="doctors-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="doctors-heading" className={styles.title}>
            Our Available Doctors
          </h2>
          <Link
            href={hospitalId ? `/temp1/${hospitalId}/our-doctors` : "our-doctors"}
            className={styles.viewAll}
          >
            View All Doctors
          </Link>
        </div>

        <ul className={styles.grid}>
          {doctors.map((doctor) => (
            <li key={doctor.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {doctor.profile_pic && (
                  <Image
                    src={doctor.profile_pic}
                    alt={doctor.name}
                    fill
                    sizes="(min-width: 992px) 25vw, 50vw"
                    className={styles.doctorImage}
                  />
                )}
                <span className={styles.badge}>
                  {doctor.specialisations?.[0]?.name ?? "Doctor"}
                </span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.name}>{doctor.name}</h3>
                <p className={styles.role}>
                  {doctor.specialisations?.map((s) => s.name).join(", ") ?? ""}
                </p>
                <p className={styles.experience}>
                  {getExperience(doctor.work_start_date ?? "")}
                </p>
                <Link
                  href={
                    hospitalId
                      ? `/temp1/${hospitalId}/our-doctors/${doctor.id}`
                      : `/our-doctors/${doctor.id}`
                  }
                  className={styles.profileButton}
                >
                  View Profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}