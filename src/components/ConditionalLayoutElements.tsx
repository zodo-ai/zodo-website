"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith('/temp')) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/temp')) return null;
  return (
    <>
      <Footer />
      <BottomBar />
    </>
  );
}
