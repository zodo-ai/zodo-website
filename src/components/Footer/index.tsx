'use client';

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Logo from "~/svg/DetailedLogo.svg";
import SocialOne from "~/svg/SocialOne.svg";
import SocialTwo from "~/svg/SocialTwo.svg";
import SocialThree from "~/svg/SocialThree.svg";
import Screenshot from "~/png/Screenshot.png";
import Gradient from "~/png/GradientGreen.png";
import Thunder from "~/svg/SuperThunder.svg";

import OutlinedHeader from "../OutlinedHeader";
import links from "@/dummy/links";

const Footer = () => {
  const socialIcons = [SocialOne, SocialTwo, SocialThree];
  const pathname = usePathname();

  // Hide footer on selected pages
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/booking/create")
  ) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-mobile-gradient md:bg-[#004746]">
      {/* Background Gradient */}
      <Image
        src={Gradient}
        alt="Background Gradient"
        fill
        priority
        className="absolute inset-0 z-10 hidden object-cover md:flex"
      />

      {/* CTA Section */}
      <div className="relative z-20 mt-20 flex flex-col items-center justify-center">
        <div className="mb-4 space-y-6 text-center md:mb-16">
          <OutlinedHeader
            text="GET STARTED"
            borderColor="border-[#4CBAB1] md:border-[#004746]"
            icon={Thunder}
            paddingY="py-1"
            paddingX="px-2"
            textColor="text-white md:text-[#004746]"
          />

          <h2 className="text-5xl font-medium text-white md:text-6xl md:text-[#004746]">
            Build With PALQAR LLC
          </h2>

          <div className="flex justify-center">
            <p className="w-3/4 font-extralight leading-6 text-[#8CCCCBB8] md:text-black">
              Transform your business with cutting-edge AI, SaaS, cloud,
              web, and mobile solutions. We build secure, scalable,
              and innovative digital products for businesses worldwide.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-block rounded-full bg-[#004746] px-8 py-4 text-white transition hover:bg-[#023b3a]"
          >
            Contact Us
          </Link>
        </div>

        <Image
          src={Screenshot}
          alt="PALQAR Platform"
          width={1000}
          height={750}
          className="hidden rounded-xl drop-shadow-2xl md:flex"
          priority
        />
      </div>

      {/* Footer */}
      <footer className="relative z-20 mt-[-50px] flex flex-col items-center space-y-10 px-4 py-16 text-white">
        {/* Logo */}
        <Image
          src={Logo}
          alt="PALQAR LLC Logo"
          width={650}
          height={150}
          className="w-60 md:w-[300px]"
          priority
        />

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((item) => (
            <Link key={item.label} href={item.link}>
              <button className="rounded-full bg-[#195654] px-4 py-2 text-sm font-medium transition hover:bg-[#236c6a] md:text-base">
                {item.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {socialIcons.map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="rounded-full bg-[#195654] p-2 transition hover:bg-[#236c6a]"
            >
              <Image
                src={Icon}
                width={18}
                height={18}
                alt={`Social ${index + 1}`}
              />
            </a>
          ))}
        </div>

        {/* Company Information */}
        <div className="max-w-md text-center text-sm leading-7 text-[#CCDADA]">
          <h3 className="mb-2 text-lg font-semibold text-white">
            PALQAR LLC
          </h3>

          <p>
            1990 N California Blvd
            <br />
            8th Floor
            <br />
            Walnut Creek, CA 94596
            <br />
            United States
          </p>

          <p className="mt-3">
            <a
              href="mailto:info@palqar.com"
              className="transition hover:text-white"
            >
              info@palqar.com
            </a>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-[#CCDADA]">
          © {new Date().getFullYear()} PALQAR LLC. All Rights Reserved.
        </p>
      </footer>
    </section>
  );
};

export default Footer;
