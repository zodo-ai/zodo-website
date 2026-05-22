"use client";

import {
  CalendarDays,
  Clock,
  IndianRupee,
  ReceiptText,
  Stethoscope,
  Video,
  ScanLine,
} from "lucide-react";

import { BookingI } from "@/network/bookings/types";
import { formatDisplayTime } from "@/helpers/formatDisplayTime";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: BookingI;
  compact?: boolean;
}

const statusStyles: Record<string, string> = {
  started: "bg-blue-50 text-blue-700 border-blue-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
};

const formatAppointmentDate = (dateValue: string): string => {
  const [year, month, day] = dateValue.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatCurrency = (booking: BookingI): string => {
  const amount = Number(booking.meta_data?.total ?? booking.amount ?? 0);
  const currency = booking.meta_data?.currency || "INR";

  if (!Number.isFinite(amount) || amount <= 0) {
    return `${currency} 0`;
  }

  return `${currency} ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const normalizeLabel = (value?: string | null): string =>
  value
    ? value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not available";

const BookingCard = ({
  booking,
  compact = false,
}: BookingCardProps) => {
  const status = booking.status || "pending";

  const isServiceBooking = booking.type === "service";

  const doctorName =
    booking.doctor?.name || "Doctor unavailable";

  const qualification =
    booking.doctor?.registration_details?.qualification;

  const serviceName =
    booking.hospitalService?.name || "Service unavailable";

  const serviceDescription =
    booking.hospitalService?.description;

  return (
    <article className="rounded-lg border border-[#E6EEEC] bg-white p-4 shadow-sm transition hover:border-[#B7D5D0]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#1D453F]">
              {booking.booking_id}
            </span>

            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                statusStyles[status] ||
                  "bg-gray-50 text-gray-700 border-gray-100"
              )}
            >
              {normalizeLabel(status)}
            </span>

            <span className="rounded-full bg-[#EAF5F2] px-2.5 py-1 text-xs font-medium text-[#1D453F]">
              {normalizeLabel(booking.type)}
            </span>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EAF5F2] text-[#1D453F]">
              {isServiceBooking ? (
                <ScanLine size={20} />
              ) : (
                <Stethoscope size={20} />
              )}
            </div>

            <div className="min-w-0">
              {isServiceBooking ? (
                <>
                  <h3 className="truncate text-base font-semibold text-[#173F3A]">
                    {serviceName}
                  </h3>

                  {serviceDescription && (
                    <p className="text-sm text-[#6B7C80]">
                      {serviceDescription}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="truncate text-base font-semibold text-[#173F3A]">
                    Dr. {doctorName}
                  </h3>

                  {qualification && (
                    <p className="text-sm text-[#6B7C80]">
                      {qualification}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-md bg-[#F4F8F7] px-3 py-2 text-sm font-semibold text-[#1D453F]">
          <IndianRupee size={16} />
          <span>
            {formatCurrency(booking).replace("INR ", "")}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 grid gap-3 text-sm text-[#4F6064]",
          compact
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        <div className="flex items-center gap-2">
          <CalendarDays
            size={16}
            className="text-[#347D73]"
          />
          <span>
            {formatAppointmentDate(
              booking.appointmentDate
            )}
          </span>
        </div>

        {isServiceBooking ? (
          <div className="flex items-center gap-2">
            <ReceiptText
              size={16}
              className="text-[#347D73]"
            />
            <span>
              Token #{booking.token_number ?? "-"}
            </span>
          </div>
        ) : (
          !!booking.timeSlot && (
            <div className="flex items-center gap-2">
              <Clock
                size={16}
                className="text-[#347D73]"
              />
              <span>
                {formatDisplayTime(booking.timeSlot)}
              </span>
            </div>
          )
        )}

        <div className="flex items-center gap-2">
          <Video
            size={16}
            className="text-[#347D73]"
          />
          <span>
            {booking.is_online
              ? "Online"
              : "In person"}
          </span>
        </div>

        {!compact && (
          <div className="flex items-center gap-2">
            <ReceiptText
              size={16}
              className="text-[#347D73]"
            />
            <span>
              {normalizeLabel(booking.payment_type)}
            </span>
          </div>
        )}
      </div>

      {booking.reason && (
        <p className="mt-4 rounded-md bg-[#F8FBFA] px-3 py-2 text-sm text-[#506265]">
          {booking.reason}
        </p>
      )}
    </article>
  );
};

export default BookingCard;