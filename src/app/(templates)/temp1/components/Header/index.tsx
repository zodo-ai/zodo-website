"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Stethoscope, UserRound, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ConfirmModal from "@/components/ConfirmModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import styles from "./Header.module.css";

interface HeaderProps {
  hospitalName?: string;
  logoImage?: string;
  hospitalSlug?: string;
}

const NAV_ITEMS = ["Home", "About Us", "Doctors", "Departments", "Services", "Contact"];

export function Header({
  hospitalName = "Apollo",
  logoImage,
  hospitalSlug,
}: HeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();

  const homeHref = hospitalSlug ? `/temp1/${hospitalSlug}` : "/";

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setMenuOpen(false);
    logout();
    router.push(homeHref);
  };

  // Lock body scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!menuOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const renderAuthActions = (onNavigate?: () => void) => {
    if (isHydrated && user) {
      return (
        <div className={styles.userActions}>
          <Link
            href={hospitalSlug ? `/temp1/${hospitalSlug}/profile` : "/profile"}
            aria-label="Profile"
            onClick={onNavigate}
          >
            <Avatar className={styles.avatar}>
              <AvatarFallback className={styles.avatarFallback}>
                <UserRound className={styles.avatarIcon} aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => setShowLogoutConfirm(true)}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className={styles.logoutIcon} aria-hidden="true" />
          </button>
        </div>
      );
    }

    return (
      <Link
        href={hospitalSlug ? `/temp1/${hospitalSlug}/auth` : "/auth"}
        className={styles.loginButton}
        onClick={onNavigate}
      >
        Login
      </Link>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href={homeHref} className={styles.logoLink}>
            {logoImage ? (
              <Image
                src={logoImage}
                alt={hospitalName || "Logo"}
                width={150}
                height={50}
                className={styles.logoImage}
              />
            ) : (
              <span className={styles.logoIcon}>
                <Stethoscope className={styles.logoIconSvg} aria-hidden="true" />
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className={styles.navLink}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className={styles.actions}>{renderAuthActions()}</div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className={styles.menuIcon} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
        >
          <div
            className={styles.drawerPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className={styles.drawerHeader}>
              <Link
                href={homeHref}
                className={styles.logoLink}
                onClick={() => setMenuOpen(false)}
              >
                {logoImage ? (
                  <Image
                    src={logoImage}
                    alt={hospitalName || "Logo"}
                    width={130}
                    height={44}
                    className={styles.logoImage}
                  />
                ) : (
                  <span className={styles.logoIcon}>
                    <Stethoscope className={styles.logoIconSvg} aria-hidden="true" />
                  </span>
                )}
              </Link>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className={styles.menuIcon} aria-hidden="true" />
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Mobile primary">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={styles.drawerNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className={styles.drawerActions}>
              {renderAuthActions(() => setMenuOpen(false))}
            </div>
          </div>
        </div>
      )}

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