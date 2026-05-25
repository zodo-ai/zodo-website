"use client";

import { Suspense, useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  BriefcaseMedical,
  Stethoscope,
  TicketPercent,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { fetchCurrentUserProfileAPI } from "@/network/auth";
import { fetchDoctorDetailAPI } from "@/network/doctors/get";
import { DoctorI } from "@/network/doctors/types";
import { UserProfile } from "@/types/auth";
import { showToast } from "@/lib/toast";
import {
  calculateBookingAmountAPI,
  CalculateBookingAmountResponse,
  createBookingAPI,
  CreateDoctorBookingPayload,
  createHospitalServiceBookingAPI,
  CreateHospitalServiceBookingPayload,
} from "@/network/bookings/post";
import { validateCouponAPI } from "@/network/coupons/post";
import { CouponI } from "@/network/coupons/types";
import { APIResError } from "@/network/api";
import { HospitalServiceI } from "@/network/hospital-services/types";
import { fetchHospitalServiceDetailAPI } from "@/network/hospital-services/get";
import useChildUsers from "@/hooks/child-users/use-child-users";
import SwitchPatientModal, { PatientOption } from "@/components/SwitchPatientModal";

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



const CreateBookingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingType = searchParams.get("type") || "doctor";

  const serviceId = searchParams.get("serviceId") || "";
  const [service, setService] = useState<HospitalServiceI | null>(null);

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
  const [reason, setReason] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { childUsers, loading: loadingChildUsers } = useChildUsers({ userId: profile?.id });
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
  const [showSwitchPatient, setShowSwitchPatient] = useState(false);

  const patients = useMemo(() => {
    const list: PatientOption[] = [];
    if (profile) {
      list.push({
        id: profile.id,
        name: getProfileName(profile),
        age: profile.age || 0,
        gender: profile.gender || "",
        relation: "Self",
        profile_picture: profile.profile_picture || "",
      });
    }
    childUsers.forEach((child) => {
      list.push({
        id: child.id,
        name: child.fullname,
        age: child.age,
        gender: child.gender,
        relation: child.relation || "Family",
        profile_picture: child.profile_picture || "",
      });
    });
    return list;
  }, [profile, childUsers]);


  const loadAmount = useCallback(
    async (couponId?: string) => {

      const bookingId =
        bookingType === "doctor"
          ? doctorId
          : serviceId;

      if (!bookingId) {
        return;
      }

      try {

        setAmountLoading(true);

        const response =
          await calculateBookingAmountAPI({

            ...(bookingType === "doctor"
              ? {
                doctor_id: doctorId,
              }
              : {
                hospital_service_id:
                  serviceId,
              }),

            is_fast_tag: false,

            ...(couponId
              ? {
                coupon_id: couponId,
              }
              : {}),
          });

        setAmountDetails(response);

      } catch (error) {

        showToast({
          message: "Error",
          description:
            getErrorMessage(
              error,
              "Failed to calculate amount"
            ),
          type: "error",
        });

      } finally {

        setAmountLoading(false);
      }
    },
    [
      bookingType,
      doctorId,
      serviceId,
    ]
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (
      bookingType === "doctor"
        ? !doctorId
        : !serviceId
    ) {
      setLoadingPage(false);
      return;
    }

    const loadBookingContext = async () => {
      try {
        setLoadingPage(true);

        let profileResponse:
          UserProfile;

        if (bookingType === "doctor") {

          const [
            doctorData,
            profileData,
          ] = await Promise.all([
            fetchDoctorDetailAPI(
              doctorSlug
            ),
            fetchCurrentUserProfileAPI(),
          ]);

          profileResponse =
            profileData;

          setDoctor(doctorData);

        } else {

          const [
            serviceData,
            profileData,
          ] = await Promise.all([
            fetchHospitalServiceDetailAPI(
              serviceId
            ),
            fetchCurrentUserProfileAPI(),
          ]);

          profileResponse =
            profileData;

          setService(serviceData);
        }

        setProfile(profileResponse);
        setSelectedPatient((prev) => {
          if (prev) return prev;
          return {
            id: profileResponse.id,
            name: getProfileName(profileResponse),
            age: profileResponse.age || 0,
            gender: profileResponse.gender || "",
            relation: "Self",
            profile_picture: profileResponse.profile_picture || "",
          };
        });

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
    bookingType,
    doctorId,
    doctorSlug,
    serviceId,
    isAuthenticated,
    isHydrated,
    loadAmount,
    router,
  ]);


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
        ...(bookingType === "doctor"
          ? {
            doctor_id: doctorId,
          }
          : {
            hospital_service_id:
              serviceId,
          }),

        is_fast_tag: false,

        coupon_id:
          validation.coupon.id,
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
    if (!selectedPatient || !amountDetails || !selectedDate) {
      showToast({
        message: "Missing details",
        description: "Please select patient and appointment date",
        type: "error",
      });
      return;
    }

    const profileName = selectedPatient.name;

    if (!profileName || !selectedPatient.age || !selectedPatient.gender) {
      showToast({
        message: "Complete patient profile",
        description:
          "Name, age and gender are required to create a booking.",
        type: "error",
      });

      if (selectedPatient.relation === "Self") {
        router.push("/profile");
      }
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

      const doctorPayload: CreateDoctorBookingPayload = {
        doctor_id: doctorId,

        hospital_id:
          doctor?.hospital_id || null,

        user_details: {
          name: profileName,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
        },

        appointmentDate:
          formatDateForApi(selectedDate),

        reason: reason.trim(),

        is_online: false,

        is_service: false,

        amount: String(amountDetails.total),

        coupon_id:
          amountDetails.coupon_id ||
          appliedCoupon?.id ||
          null,

        meta_data: amountDetails,

        isWeb: true,

        successCallback:
          `${origin}/booking/success?type=${bookingType}`,

        errorCallback:
          `${origin}/booking/cancel?type=${bookingType}`,
      };

      const servicePayload: CreateHospitalServiceBookingPayload = {
        hospital_service_id: serviceId,

        hospital_id:
          service?.hospital_id || null,

        user_details: {
          name: profileName,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
        },

        appointmentDate:
          formatDateForApi(selectedDate),

        reason: reason.trim(),

        is_service: true,

        amount: String(amountDetails.total),

        coupon_id:
          amountDetails.coupon_id ||
          appliedCoupon?.id ||
          null,

        meta_data: amountDetails,

        isWeb: true,

        successCallback:
          `${origin}/booking/success?type=${bookingType}`,

        errorCallback:
          `${origin}/booking/cancel?type=${bookingType}`,
      };


      const response =
        bookingType === "doctor"
          ? await createBookingAPI(
            doctorPayload
          )
          : await createHospitalServiceBookingAPI(
            servicePayload
          );

      if (response.status) {
        showToast({
          message: "Booking created",
          description:
            "Redirecting to checkout...",
          type: "success",
        });

        const paymentUrl =
          response.data.paymentOrder?.payment_link;

        if (!paymentUrl) {
          showToast({
            message: "Payment link missing",
            description:
              "Unable to start payment",
            type: "error",
          });

          return;
        }

        window.location.href = paymentUrl;
      }
    } catch (error) {
      showToast({
        message: "Booking failed",
        description: getErrorMessage(
          error,
          "Failed to create booking"
        ),
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

  if (
    (bookingType === "doctor" &&
      !doctorId) ||

    (bookingType === "service" &&
      !serviceId)
  ) {
    return (
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-red-700">
            {bookingType === "doctor"
              ? "Doctor details are missing."
              : "Service details are missing."}
          </p>

          <Button
            asChild
            className="mt-5 bg-[#1D453F] hover:bg-[#173A35]"
          >
            <Link
              href={
                bookingType === "doctor"
                  ? "/doctors"
                  : "/hospitals"
              }
            >
              {bookingType === "doctor"
                ? "Find Doctors"
                : "Browse Hospitals"}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6FAF9] px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Button variant="outline" asChild className="gap-2">
          <Link
            href={
              bookingType === "doctor"
                ? doctor?.slug
                  ? `/doctors/${doctor.slug}`
                  : "/doctors"
                : "/hospitals"
            }
          >
            <ArrowLeft size={18} />
            {bookingType === "doctor"
              ? "Back to Doctor"
              : "Back to Hospital"}
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-5 rounded-lg border border-[#E0ECE9] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 border-b border-[#E6EEEC] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#347D73]">
                  {
                    bookingType === "doctor" ? (
                      <Stethoscope size={16} />
                    ) : (
                      <BriefcaseMedical size={16} />
                    )
                  }
                  {bookingType === "doctor"
                    ? "Clinic Appointment"
                    : "Hospital Service"}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-[#173F3A]">
                  {bookingType === "doctor"
                    ? `Book appointment with Dr. ${doctor?.name || "Doctor"
                    }`
                    : `Book ${service?.name || "Service"
                    }`}
                </h1>
                <p className="mt-2 text-sm text-[#6B7C80]">
                  {bookingType === "doctor"
                    ? "Choose an appointment date and enter your concern."
                    : "Choose your preferred booking date for this service."}
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-md bg-[#EAF5F2] px-3 py-2 text-sm font-semibold text-[#1D453F]">
                {
                  bookingType === "doctor" ? (
                    <Stethoscope size={16} />
                  ) : (
                    <BriefcaseMedical size={16} />
                  )
                }
                {bookingType === "doctor"
                  ? "Offline Consultation"
                  : "Service Booking"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#344C50]">
                Appointment Date
                <span className="text-red-500">*</span>
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
                className="w-full cursor-pointer"
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
              <p className="mt-2 text-sm text-[#5C7074]">
                Appointment date selected
              </p>
            </div>


            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="text-sm font-semibold text-[#344C50]"
              >
                {bookingType === "doctor"
                  ? "Reason for consultation"
                  : "Booking notes"}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={
                  bookingType === "doctor"
                    ? "Example: Headache, fever, follow-up consultation"
                    : "Example: Scan requirement, health checkup, diagnostic request"
                }
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
                <span className="text-[#6B7C80]">
                  {bookingType === "doctor"
                    ? "Consultation fee"
                    : "Service fee"}
                </span>
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
                    className="cursor-pointer h-10"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || amountLoading}
                    className="bg-[#1D453F] hover:bg-[#173A35] cursor-pointer h-10"
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

            <div className="rounded-lg border border-[#E6EEEC] p-4 relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold uppercase text-[#7B8E92]">
                  Patient
                </p>
                <button
                  type="button"
                  onClick={() => setShowSwitchPatient(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#1B7C7B] hover:text-[#1D453F] transition-colors cursor-pointer"
                >
                  <ArrowRightLeft size={14} />
                  Switch User
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-semibold text-[#173F3A]">
                  {selectedPatient?.name || "Profile incomplete"}
                </p>
                {selectedPatient?.relation && (
                  <span className="inline-flex items-center rounded-sm bg-[#EAF5F2] px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#1D453F]">
                    {selectedPatient.relation}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#6B7C80]">
                {selectedPatient?.age ? `${selectedPatient.age} years` : "Age missing"} ·{" "}
                <span className="capitalize">{selectedPatient?.gender || "Gender missing"}</span>
              </p>
            </div>

            <Button
              type="button"
              className="h-11 w-full rounded-full bg-[#1D453F] font-semibold hover:bg-[#173A35] cursor-pointer"
              onClick={createBooking}
              disabled={creating || amountLoading}
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

      {showSwitchPatient && (
        <SwitchPatientModal
          open={showSwitchPatient}
          onClose={() => setShowSwitchPatient(false)}
          patients={patients}
          selectedPatientId={selectedPatient?.id}
          onSelect={(patient) => {
            setSelectedPatient(patient);
            setShowSwitchPatient(false);
          }}
          loading={loadingChildUsers}
        />
      )}
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
