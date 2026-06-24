"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Stethoscope, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ConfirmModal from "@/components/ConfirmModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import styles from "./Header.module.css";

interface HeaderProps {
  hospitalName?: string;
  logoImage?: string;
  hospitalSlug?: string;
}

export function Header({ hospitalName = "Apollo", logoImage, hospitalSlug }: HeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push(hospitalSlug ? `/temp1/${hospitalSlug}` : "/");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoGroup}>
            {/* Logo Section */}
            <Link href={hospitalSlug ? `/temp1/${hospitalSlug}` : "/"} className={styles.logoLink}>
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

          {/* Action Buttons */}
          <div className={styles.actions}>
            {isHydrated && user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Link
                  href={hospitalSlug ? `/temp1/${hospitalSlug}/profile` : "/profile"}
                  aria-label="Profile"
                >
                  <Avatar style={{ height: "2.5rem", width: "2.5rem", cursor: "pointer", border: "1px solid color-mix(in srgb, var(--primary-color) 20%, white)", transition: "opacity 0.15s" }}>
                    <AvatarFallback style={{ backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)", color: "var(--primary-color)" }}>
                      <UserRound size={20} />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  style={{ borderRadius: "9999px", padding: "0.5rem", cursor: "pointer", border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Logout"
                >
                  <LogOut size={20} style={{ color: "color-mix(in srgb, var(--primary-color) 60%, black)" }} />
                </button>
              </div>
            ) : (
              <Link
                href={hospitalSlug ? `/temp1/${hospitalSlug}/auth` : "/auth"}
                className={styles.loginButton}
              >
                <span className={styles.loginTextDesktop}>Login</span>
                <span className={styles.loginTextMobile}>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout?"
        description="You will need to verify your phone number again to access your profile and bookings."
        confirmText="Logout"
        destructive
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
