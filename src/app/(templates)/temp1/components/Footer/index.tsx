import Link from "next/link";
import Image from "next/image";
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import styles from "./Footer.module.css";
import { HospitalWebSettings } from "@/network/hospital-web/types";
import { HospitalServiceI } from "@/network/hospital-services/types";

interface FooterProps {
  settings?: HospitalWebSettings | null;
  hospitalName?: string;
  services?: HospitalServiceI[];
  hospitalSlug?: string;
}

export function Footer({ settings, hospitalName = "Apollo", services = [], hospitalSlug = "" }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.mainFooterPadding}`}>
        <div className={styles.mainGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="#home" className={styles.logoWrapper} style={{ textDecoration: 'none' }}>
              {settings?.logo_image ? (
                <Image
                  src={settings.logo_image}
                  alt={hospitalName || "Logo"}
                  width={150}
                  height={50}
                  style={{ objectFit: "contain", maxHeight: "50px" }}
                />
              ) : (
                <div className={styles.logoIcon}>
                  <Stethoscope size={24} color="#ffffff" />
                </div>
              )}
            </Link>
            <p className={styles.brandDescription}>
              {settings?.description
                ? settings.description.slice(0, 100) + (settings.description.length > 100 ? "..." : "")
                : "Delivering exceptional healthcare with advanced technology and compassionate experts."}
            </p>
            {settings?.social_links && (
              <div className={styles.socials}>
                {settings.social_links.facebook && (
                  <Link href={settings.social_links.facebook} target="_blank" className={styles.socialLink}>
                    <Facebook size={20} />
                  </Link>
                )}
                {settings.social_links.twitter && (
                  <Link href={settings.social_links.twitter} target="_blank" className={styles.socialLink}>
                    <Twitter size={20} />
                  </Link>
                )}
                {settings.social_links.instagram && (
                  <Link href={settings.social_links.instagram} target="_blank" className={styles.socialLink}>
                    <Instagram size={20} />
                  </Link>
                )}
                {settings.social_links.linkedin && (
                  <Link href={settings.social_links.linkedin} target="_blank" className={styles.socialLink}>
                    <Linkedin size={20} />
                  </Link>
                )}
                {settings.social_links.youtube && (
                  <Link href={settings.social_links.youtube} target="_blank" className={styles.socialLink}>
                    <Youtube size={20} />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.list}>
              <li><Link href={`/temp1/${hospitalSlug}`} className={styles.link}>Home</Link></li>
              <li><Link href={`/temp1/${hospitalSlug}#about-us`} className={styles.link}>About Us</Link></li>
              <li><Link href={`/temp1/${hospitalSlug}/our-doctors`} className={styles.link}>Doctors</Link></li>
              <li><Link href={`/temp1/${hospitalSlug}/our-departments`} className={styles.link}>Departments</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className={styles.heading}>Services</h3>
            <ul className={styles.list}>
              {services && services.length > 0 ? (
                services.slice(0, 4).map((service) => (
                  <li key={service.id}>
                    <Link href={`/temp1/${hospitalSlug}/our-services/${service.id}`} className={styles.link}>
                      {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                [
                  "General Consultation",
                  "Dental Care",
                  "Cardiology",
                  "Neurology",
                ].map((item) => (
                  <li key={item}>
                    <Link href={`/temp1/${hospitalSlug}/our-services`} className={styles.link}>
                      {item}
                    </Link>
                  </li>
                ))
              )}
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
