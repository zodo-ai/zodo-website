import Link from "next/link";

import {
  CalendarX,
  Search,
  ClipboardList,
  Stethoscope,
  BriefcaseMedical,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{
    type?: string;
    bookingId?: string;
  }>;
}

export default async function BookingCancelPage({
  searchParams,
}: Props) {

  const params =
    await searchParams;

  const bookingType =
    params?.type || "doctor";

  const bookingId =
    params?.bookingId;

  const isDoctor =
    bookingType === "doctor";

  return (
    <main className="min-h-screen bg-[#F6FAF9] px-4 py-12">

      <section className="mx-auto flex max-w-xl flex-col items-center rounded-[28px] border border-[#DCEBE8] bg-white p-8 text-center shadow-sm">

        {/* Icon */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDoctor
              ? "#FEF3C7"
              : "#FEE2E2",
            color: isDoctor
              ? "#D97706"
              : "#DC2626",
          }}
        >
          {isDoctor ? (
            <Stethoscope
              size={30}
              strokeWidth={2.2}
            />
          ) : (
            <BriefcaseMedical
              size={30}
              strokeWidth={2.2}
            />
          )}
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-[#173F3A]">

          {isDoctor
            ? "Appointment Not Completed"
            : "Service Booking Failed"}

        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-7 text-[#5C7074]">

          {isDoctor
            ? "Your doctor appointment payment was cancelled or could not be completed."
            : "Your hospital service booking payment was cancelled or could not be completed."}

        </p>

        {/* Booking ID */}
        {bookingId && (

          <div className="mt-4 rounded-full bg-[#F5F7F7] px-4 py-2 text-sm font-semibold text-[#4B5C61]">

            Booking ID: {bookingId}

          </div>

        )}

        {/* Status Card */}
        <div className="mt-6 w-full rounded-2xl bg-[#F8FBFA] p-5 text-left">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-2 text-red-600">

              <CalendarX size={18} />

            </div>

            <div>

              <p className="text-sm font-semibold text-[#173F3A]">
                Payment Failed
              </p>

              <p className="text-xs text-[#6B7C80]">
                Booking was not completed
              </p>

            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">

          <Button
            asChild
            className="bg-[#1D453F] hover:bg-[#173A35]"
          >

            <Link
              href={
                isDoctor
                  ? "/doctors"
                  : "/hospitals"
              }
            >

              <Search size={18} />

              {isDoctor
                ? "Find Doctors"
                : "Browse Services"}

            </Link>

          </Button>

          <Button
            variant="outline"
            asChild
          >

            <Link href="/my-bookings">

              <ClipboardList size={18} />

              My Bookings

            </Link>

          </Button>

        </div>

      </section>

    </main>
  );
}