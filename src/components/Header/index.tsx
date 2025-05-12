'use client'
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { BrandLogo } from "../Logo";

const headerLinks = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Features",
    link: "/features"
  },
  {
    label: "About us",
    link: "/about"
  },
  {
    label: "Contact",
    link: '/contact'
  }
];

export const Header = () => {
  const pathname = usePathname()
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
      <BrandLogo />

      <nav className="flex items-center justify-center flex-1 mx-10">
        <div className="flex space-x-8">
          {headerLinks.map((item) => {
            const isActive = pathname === item.link
            return (
              <Link key={item.link} href={item.link} className={twMerge("font-medium text-sm pb-1", isActive ? "text-[#1D453F]" : "text-[#004746]")}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search doctor"
            className="pl-10 pr-4 py-2 h-10 rounded-full border border-gray-200 focus:border-emerald-500 focus:ring-0 w-48"
          />
        </div>
        <Button className="bg-[#1D453F] hover:bg-emerald-900 text-white rounded-full px-7 h-10">
          Get Appointment
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Header;
