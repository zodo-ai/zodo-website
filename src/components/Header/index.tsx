"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { BrandLogo } from "../Logo";
import Navigation from "../Navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ConfirmModal from "../ConfirmModal";

const headerLinks = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Find Doctors",
    link: "/doctors",
  },
  {
    label: "Find Hospitals",
    link: "/hospitals",
  },
  {
    label: "About Us",
    link: "/",
  },
  {
    label: "Contact",
    link: "/contact",
  },
];

const Header = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  if (!isHydrated) return null;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex lg:hidden">
            <SidebarTrigger />
          </div>
          <BrandLogo />
        </div>

        <Navigation headerLinks={headerLinks} />

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" aria-label="Profile">
                <Avatar className="h-10 w-10 cursor-pointer border border-[#DCE9E6] transition-opacity hover:opacity-80">
                  <AvatarFallback className="bg-[#EAF5F2] text-[#1D453F]">
                    <UserRound size={20} />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <Button
              asChild
              className="h-10 rounded-full bg-teal-700 px-6 text-white hover:bg-teal-800"
            >
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>

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
};

export default Header;
