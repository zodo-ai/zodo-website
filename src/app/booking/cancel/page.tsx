import Link from "next/link";
import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingCancelPage() {
  return (
    <main className="min-h-screen bg-[#F6FAF9] px-4 py-12">
      <section className="mx-auto flex max-w-xl flex-col items-center rounded-lg border border-[#DCEBE8] bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <CalendarX size={34} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#173F3A]">
          Booking was not completed
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5C7074]">
          The payment was cancelled or could not be completed. You can choose a
          doctor and try booking again.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-[#1D453F] hover:bg-[#173A35]">
            <Link href="/doctors">
              <Search size={18} />
              Find Doctors
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my-bookings">My Bookings</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
