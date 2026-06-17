import Link from "next/link";
import { CalendarDays, Stethoscope } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  hospitalName?: string;
}

export function Header({ hospitalName = "Apollo" }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoGroup}>
          {/* Logo Section */}
          <Link href="#" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Stethoscope size={24} />
            </div>
            <div className={styles.logoTextWrapper}>
              <h1 className={styles.logoTitle}>{hospitalName}</h1>
              <p className={styles.logoSubtitle}>Hospital</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          {[
            "Home",
            "About Us",
            "Doctors",
            "Departments",
            "Services",
            "Contact",
          ].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={styles.navLink}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className={styles.actions}>
          <button className={styles.bookButton}>
            <CalendarDays size={18} />
            <span className={styles.bookTextDesktop}>Book Appointment</span>
            <span className={styles.bookTextMobile}>Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}
