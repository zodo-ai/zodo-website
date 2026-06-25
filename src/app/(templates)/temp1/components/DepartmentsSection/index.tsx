import { ArrowRight, Stethoscope } from "lucide-react";
import Link from "next/link";
import styles from "./DepartmentsSection.module.css";
import { DepartmentI } from "@/network/departments/types";

interface DepartmentsSectionProps {
  departments?: DepartmentI[];
  hospitalId?: string;
}

export function DepartmentsSection({
  departments = [],
  hospitalId = "",
}: DepartmentsSectionProps) {
  if (departments.length === 0) return null;

  return (
    <section id="departments" className={styles.section} aria-labelledby="departments-heading">
      <div className={styles.container}>
        <h2 id="departments-heading" className={styles.title}>
          Our Departments
        </h2>

        <ul className={styles.grid} aria-label="Departments">
          {departments.map((dept) => (
            <li key={dept.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Stethoscope className={styles.icon} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className={styles.name}>{dept.name}</p>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link
            href={hospitalId ? `/temp1/${hospitalId}/our-departments` : "our-departments"}
            className={styles.viewAll}
          >
            View All Departments
            <ArrowRight className={styles.arrowIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}