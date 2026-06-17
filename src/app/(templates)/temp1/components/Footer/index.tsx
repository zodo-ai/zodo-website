import Link from "next/link";
import { Stethoscope } from "lucide-react";
import styles from "./Footer.module.css";
import { HospitalWebSettings } from "@/network/hospital-web/types";

interface FooterProps {
  settings?: HospitalWebSettings | null;
  hospitalName?: string;
}

export function Footer({ settings, hospitalName = "Apollo" }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.mainFooterPadding}`}>
        <div className={styles.mainGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="#home" className={styles.logoWrapper} style={{ textDecoration: 'none' }}>
              <div className={styles.logoIcon}>
                <Stethoscope size={24} color="#ffffff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.logoTitle}>{hospitalName}</span>
                <span className={styles.logoSubtitle}>Hospital</span>
              </div>
            </Link>
            <p className={styles.brandDescription}>
              {settings?.about_us
                ? settings.about_us.slice(0, 100) + "..."
                : "Delivering exceptional healthcare with advanced technology and compassionate experts."}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.list}>
              {["Home", "About Us", "Doctors", "Departments"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className={styles.link}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className={styles.heading}>Services</h3>
            <ul className={styles.list}>
              {[
                "General Consultation",
                "Dental Care",
                "Cardiology",
                "Neurology",
              ].map((item) => (
                <li key={item}>
                  <Link href="#services" className={styles.link}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className={styles.heading}>Contact Us</h3>
            <ul className={styles.list}>
              <li>
                <span style={{ color: '#ffffff' }}>Address: </span>
                {settings?.contact_address || "123 Medical City, Health Avenue"}
              </li>
              <li>
                <span style={{ color: '#ffffff' }}>Phone: </span>
                {settings?.contact_phone || "+1 234 567 8900"}
              </li>
              <li>
                <span style={{ color: '#ffffff' }}>Email: </span>
                {settings?.contact_email || "info@hospital.com"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`${styles.container} ${styles.bottomContent}`}>
          <p className={styles.bottomText}>
            &copy; {new Date().getFullYear()} {hospitalName}. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="#privacy" className={styles.link}>Privacy Policy</Link>
            <span className={styles.separator}>|</span>
            <Link href="#terms" className={styles.link}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
