"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Loader2,
  Stethoscope,
  TicketPercent,
  Video,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import useTimeSlots from "@/hooks/timeslots/use-hook";
import { categorizeSlots } from "@/helpers/categoriesTimeSlots";
import { formatDisplayTime } from "@/helpers/formatDisplayTime";
import { fetchCurrentUserProfileAPI } from "@/network/auth";
import { fetchDoctorDetailAPI } from "@/network/doctors/get";
import { DoctorI } from "@/network/doctors/types";
import { TimeSlotI } from "@/network/timeslots/types";
import { UserProfile } from "@/types/auth";
import { showToast } from "@/lib/toast";
import {
  calculateBookingAmountAPI,
  CalculateBookingAmountResponse,
  createBookingAPI,
} from "@/network/bookings/post";
import { validateCouponAPI } from "@/network/coupons/post";
import { CouponI } from "@/network/coupons/types";
import { APIResError } from "@/network/api";

const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

const formatDateLabel = (date?: Date): string =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : "Select date";

const formatAmount = (amount?: number | null): string =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const getProfileName = (profile: UserProfile | null): string =>
  [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof APIResError) {
    const response = error.response as {
      message?: string;
      validationErrors?: string;
    };

    return response?.validationErrors || response?.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const SlotGroup = ({
  title,
  slots,
  selectedSlot,
  onSelect,
}: {
  title: string;
  slots: TimeSlotI[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}) => {
  if (slots.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[#173F3A]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.startTime;

          return (
            <button
              key={slot.startTime}
              type="button"
              disabled={!slot.isAvailable}
              onClick={() => onSelect(slot.startTime)}
              className={`h-10 min-w-[96px] rounded-md border px-3 text-sm font-semibold transition ${
                isSelected
                  ? "border-[#1D453F] bg-[#1D453F] text-white"
                  : slot.isAvailable
                  ? "border-[#C9DCD8] bg-white text-[#173F3A] hover:border-[#347D73]"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
              }`}
            >
              {formatDisplayTime(slot.startTime)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CreateBookingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || "";
  const doctorSlug = searchParams.get("doctorSlug") || doctorId;
  const { isAuthenticated, isHydrated } = useAuth();

  const [doctor, setDoctor] = useState<DoctorI | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [amountDetails, setAmountDetails] =
    useState<CalculateBookingAmountResponse | null>(null);
  const [amountLoading, setAmountLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponI | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [creating, setCreating] = useState(false);

  const {
    timeSlots,
    loading: slotsLoading,
    error: slotsError,
    selectedDate,
    setSelectedDate,
  } = useTimeSlots({
    doctor_id: doctorId,
    autoFetch: Boolean(doctorId),
  });

  const { morning, afternoon, evening } = useMemo(
    () => categorizeSlots(timeSlots || []),
    [timeSlots]
  );

  const loadAmount = useCallback(
    async (couponId?: string) => {
      if (!doctorId) {
        return;
      }

      try {
        setAmountLoading(true);
        const response = await calculateBookingAmountAPI({
          doctor_id: doctorId,
          is_fast_tag: false,
          ...(couponId ? { coupon_id: couponId } : {}),
        });
        setAmountDetails(response);
      } catch (error) {
        showToast({
          message: "Error",
          description: getErrorMessage(error, "Failed to calculate amount"),
          type: "error",
        });
      } finally {
        setAmountLoading(false);
      }
    },
    [doctorId]
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!doctorId) {
      setLoadingPage(false);
      return;
    }

    const loadBookingContext = async () => {
      try {
        setLoadingPage(true);
        const [doctorResponse, profileResponse] = await Promise.all([
          fetchDoctorDetailAPI(doctorSlug),
          fetchCurrentUserProfileAPI(),
        ]);

        setDoctor(doctorResponse);
        setProfile(profileResponse);
        await loadAmount();
      } catch (error) {
        showToast({
          message: "Error",
          description: getErrorMessage(error, "Failed to load booking details"),
          type: "error",
        });
      } finally {
        setLoadingPage(false);
      }
    };

    loadBookingContext();
  }, [
    doctorId,
    doctorSlug,
    isAuthenticated,
    isHydrated,
    loadAmount,
    router,
  ]);

  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDate]);

  const applyCoupon = async () => {
    const normalizedCoupon = couponCode.trim().toUpperCase();

    if (!normalizedCoupon) {
      showToast({
        message: "Coupon required",
        description: "Enter a coupon code before applying.",
        type: "error",
      });
      return;
    }

    if (!profile || !amountDetails) {
      return;
    }

    try {
      setCouponLoading(true);
      const validation = await validateCouponAPI({
        coupon_code: normalizedCoupon,
        user_id: profile.id,
        amount: amountDetails.fee,
      });

      if (!validation.is_valid || !validation.coupon?.id) {
        showToast({
          message: "Coupon not applied",
          description: validation.validationErrors || validation.message,
          type: "error",
        });
        return;
      }

      const recalculatedAmount = await calculateBookingAmountAPI({
        doctor_id: doctorId,
        is_fast_tag: false,
        coupon_id: validation.coupon.id,
      });

      setAppliedCoupon(validation.coupon);
      setAmountDetails(recalculatedAmount);
      showToast({
        message: "Coupon applied",
        description: validation.message,
        type: "success",
      });
    } catch (error) {
      showToast({
        message: "Coupon not applied",
        description: getErrorMessage(error, "Coupon is not valid"),
        type: "error",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    setAppliedCoupon(null);
    setCouponCode("");
    await loadAmount();
  };

  const createBooking = async () => {
    if (!profile || !amountDetails || !selectedDate || !selectedSlot) {
      showToast({
        message: "Missing details",
        description: "Please select appointment date and time slot.",
        type: "error",
      });
      return;
    }

    const profileName = getProfileName(profile);

    if (!profileName || !profile.age || !profile.gender) {
      showToast({
        message: "Complete your profile",
        description: "Name, age and gender are required to create a booking.",
        type: "error",
      });
      router.push("/profile");
      return;
    }

    if (!reason.trim()) {
      showToast({
        message: "Reason required",
        description: "Please enter the reason for consultation.",
        type: "error",
      });
      return;
    }

    try {
      setCreating(true);
      const origin = window.location.origin;
      const response = await createBookingAPI({
        doctor_id: doctorId,
        user_details: {
          name: profileName,
          age: profile.age,
          gender: profile.gender,
        },
        appointmentDate: formatDateForApi(selectedDate),
        timeSlot: selectedSlot,
        reason: reason.trim(),
        is_online: true,
        is_service: false,
        amount: String(amountDetails.total),
        coupon_id: amountDetails.coupon_id || appliedCoupon?.id || null,
        meta_data: amountDetails,
        isWeb: true,
        successCallback: `${origin}/booking/success`,
        errorCallback: `${origin}/booking/cancel`,
      });

      if (response.status) {
        showToast({
          message: "Booking created",
          description: "Redirecting to checkout...",
          type: "success",
        });

        const checkoutUrl = response.data.paymentOrder?.checkout_url;

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        router.push(
          `/booking/success?bookingId=${encodeURIComponent(
            response.data.booking.booking_id
          )}`
        );
      }
    } catch (error) {
      showToast({
        message: "Booking failed",
        description: getErrorMessage(error, "Failed to create booking"),
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  if (!isHydrated || loadingPage) {
    return (
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-5">
          <Skeleton className="h-10 w-44" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Skeleton className="h-[640px] rounded-lg" />
            <Skeleton className="h-[420px] rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!doctorId) {
    return (
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-red-700">
            Doctor details are missing.
          </p>
          <Button asChild className="mt-5 bg-[#1D453F] hover:bg-[#173A35]">
            <Link href="/doctors">Find Doctors</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6FAF9] px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Button variant="outline" asChild className="gap-2">
          <Link href={doctor?.slug ? `/doctors/${doctor.slug}` : "/doctors"}>
            <ArrowLeft size={18} />
            Back to Doctor
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-5 rounded-lg border border-[#E0ECE9] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 border-b border-[#E6EEEC] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#347D73]">
                  <Stethoscope size={16} />
                  Online consultation
                </p>
                <h1 className="mt-2 text-2xl font-bold text-[#173F3A]">
                  Book appointment with Dr. {doctor?.name || "Doctor"}
                </h1>
                <p className="mt-2 text-sm text-[#6B7C80]">
                  Choose a date, available time slot, and enter your concern.
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-md bg-[#EAF5F2] px-3 py-2 text-sm font-semibold text-[#1D453F]">
                <Video size={16} />
                Online
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#344C50]">
                  Appointment Date
                </label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder="Select appointment date"
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="w-full"
                />
              </div>

              <div className="rounded-lg border border-[#E6EEEC] bg-[#F8FBFA] p-4">
                <p className="text-xs font-semibold uppercase text-[#7B8E92]">
                  Selected
                </p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-[#173F3A]">
                  <CalendarDays size={16} />
                  {formatDateLabel(selectedDate)}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#5C7074]">
                  <Clock size={16} />
                  {selectedSlot
                    ? formatDisplayTime(selectedSlot)
                    : "Choose a time slot"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#E6EEEC] bg-[#FAFCFB] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#173F3A]">
                    Available Time Slots
                  </h2>
                  <p className="text-sm text-[#6B7C80]">
                    Times are shown for your selected appointment date.
                  </p>
                </div>
                {slotsLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-[#347D73]" />
                )}
              </div>

              {slotsError && (
                <div className="mb-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  {slotsError}
                </div>
              )}

              {slotsLoading ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <Skeleton className="h-10 rounded-md" />
                  <Skeleton className="h-10 rounded-md" />
                  <Skeleton className="h-10 rounded-md" />
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="space-y-5">
                  <SlotGroup
                    title="Morning"
                    slots={morning}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                  />
                  <SlotGroup
                    title="Afternoon"
                    slots={afternoon}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                  />
                  <SlotGroup
                    title="Evening"
                    slots={evening}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                  />
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-[#C9DCD8] bg-white p-6 text-center text-sm text-[#6B7C80]">
                  No time slots available for this date.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="text-sm font-semibold text-[#344C50]"
              >
                Reason for consultation
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Example: Headache, fever, follow-up consultation"
                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </section>

          <aside className="h-fit space-y-4 rounded-lg border border-[#E0ECE9] bg-white p-5 shadow-sm md:p-6">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#173F3A]">
                <CreditCard size={20} />
                Payment Summary
              </h2>
              <p className="mt-2 text-sm text-[#6B7C80]">
                Amount is calculated before checkout.
              </p>
            </div>

            <div className="space-y-3 rounded-lg bg-[#F8FBFA] p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7C80]">Consultation fee</span>
                <span className="font-semibold text-[#173F3A]">
                  {amountDetails?.currency || "INR"}{" "}
                  {formatAmount(amountDetails?.fee)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7C80]">Platform fee</span>
                <span className="font-semibold text-[#173F3A]">
                  {amountDetails?.currency || "INR"}{" "}
                  {formatAmount(amountDetails?.platform_fee)}
                </span>
              </div>
              {Boolean(amountDetails?.discount) && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold">
                    - {amountDetails?.currency || "INR"}{" "}
                    {formatAmount(amountDetails?.discount)}
                  </span>
                </div>
              )}
              <div className="border-t border-[#E1ECE9] pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#173F3A]">Total</span>
                  <span className="flex items-center gap-1 text-xl font-bold text-[#173F3A]">
                    <IndianRupee size={18} />
                    {formatAmount(amountDetails?.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[#E6EEEC] p-4">
              <label
                htmlFor="coupon"
                className="flex items-center gap-2 text-sm font-semibold text-[#344C50]"
              >
                <TicketPercent size={16} />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="SUMMER2025"
                  disabled={couponLoading || Boolean(appliedCoupon)}
                />
                {appliedCoupon ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeCoupon}
                    disabled={amountLoading}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || amountLoading}
                    className="bg-[#1D453F] hover:bg-[#173A35]"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <BadgePercent size={16} />
                  {appliedCoupon.coupon_code} applied
                </p>
              )}
            </div>

            <div className="rounded-lg border border-[#E6EEEC] p-4">
              <p className="text-xs font-semibold uppercase text-[#7B8E92]">
                Patient
              </p>
              <p className="mt-1 font-semibold text-[#173F3A]">
                {getProfileName(profile) || "Profile incomplete"}
              </p>
              <p className="mt-1 text-sm text-[#6B7C80]">
                {profile?.age ? `${profile.age} years` : "Age missing"} ·{" "}
                {profile?.gender || "Gender missing"}
              </p>
            </div>

            <Button
              type="button"
              className="h-11 w-full rounded-full bg-[#1D453F] font-semibold hover:bg-[#173A35]"
              onClick={createBooking}
              disabled={creating || amountLoading || slotsLoading}
            >
              {creating ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 />
                  Proceed to Checkout
                </>
              )}
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default function CreateBookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
          <div className="mx-auto max-w-6xl space-y-5">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-[640px] rounded-lg" />
          </div>
        </main>
      }
    >
      <CreateBookingContent />
    </Suspense>
  );
}
