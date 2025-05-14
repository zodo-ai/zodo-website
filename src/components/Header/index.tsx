'use client'
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "../Logo";
import Navigation from "../Navigation";
import { SidebarTrigger } from "../ui/sidebar";

const headerLinks = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Find Doctors",
    link: "/doctors"
  },
  {
    label: "Find Hospitals",
    link: "/hospitls"
  },
  {
    label: "About Us",
    link: "/about"
  },
  {
    label: "Contact",
    link: '/contact'
  }
];

const Header = () => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
      <div className="flex gap-2 items-center">
        <div className="flex lg:hidden">
        <SidebarTrigger />
          
        </div>
      <BrandLogo />

      </div>

      <Navigation headerLinks={headerLinks} />

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
