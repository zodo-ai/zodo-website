import { CheckSquare, Users, UserPlus, FileHeart, Clock } from "lucide-react";
import styles from "./StatsSection.module.css";

export function StatsSection() {
  const stats = [
    {
      icon: CheckSquare,
      value: "10+",
      label: "Years of Excellence",
    },
    {
      icon: Users,
      value: "5000+",
      label: "Happy Patients",
    },
    {
      icon: UserPlus,
      value: "15+",
      label: "Expert Doctors",
    },
    {
      icon: FileHeart,
      value: "20+",
      label: "Dental Services",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Emergency Support",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={styles.statItem}
            >
              <div className={styles.iconWrapper}>
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.value}>{stat.value}</h3>
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
