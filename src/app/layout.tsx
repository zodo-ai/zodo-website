import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConditionalHeader, ConditionalFooter } from "@/components/ConditionalLayoutElements";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Zodo AI",
  description: "Hospital Booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full flex flex-col`}
      >

        <SidebarProvider className="flex-col" defaultOpen={false}>
          <ConditionalHeader />

          {children}
          <ConditionalFooter />

        </SidebarProvider>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      </body>
    </html>
  );
}
