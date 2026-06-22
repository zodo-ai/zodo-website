import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Stethoscope } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  hospitalName?: string;
  logoImage?: string;
}

export function Header({ hospitalName = "Apollo", logoImage }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoGroup}>
          {/* Logo Section */}
          <Link href="#" className={styles.logoLink}>
            {logoImage ? (
              <Image 
                src={logoImage} 
                alt={hospitalName || "Logo"} 
                width={150} 
                height={50} 
                style={{ objectFit: "contain", maxHeight: "50px" }}
              />
            ) : (
              <div className={styles.logoIcon}>
                <Stethoscope size={24} />
              </div>
            )}
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
