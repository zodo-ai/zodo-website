import { ArrowRight, Stethoscope } from "lucide-react";
import Link from "next/link";
import styles from "./DepartmentsSection.module.css";
import { DepartmentI } from "@/network/departments/types";

interface DepartmentsSectionProps {
  departments?: DepartmentI[];
}

export function DepartmentsSection({
  departments = [],
}: DepartmentsSectionProps) {
  if (departments.length === 0) return null;

  return (
    <section id="departments" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Departments</h2>

        <div className={styles.grid}>
          {departments.map((dept) => (
            <div key={dept.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Stethoscope size={32} strokeWidth={1.5} />
              </div>
              <p className={styles.name}>{dept.name}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="#departments" className={styles.viewAll}>
            View All Departments <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
