"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  CalendarDays,
  Send,
  Loader2,
  Stethoscope,
  BriefcaseMedical,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { fetchCurrentUserProfileAPI } from "@/network/auth";
import { fetchDoctorDetailAPI } from "@/network/doctors/get";
import { DoctorI } from "@/network/doctors/types";
import { UserProfile } from "@/types/auth";
import { showToast } from "@/lib/toast";
import { HospitalServiceI } from "@/network/hospital-services/types";
import { fetchHospitalServiceDetailAPI } from "@/network/hospital-services/get";
import { createEnquiryAPI } from "@/network/enquiries/post";
import useChildUsers from "@/hooks/child-users/use-child-users";
import SwitchPatientModal, { PatientOption } from "@/components/SwitchPatientModal";

const formatDateLabel = (date?: Date): string =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
    : "Select date";

const getProfileName = (profile: UserProfile | null): string =>
  [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback;
};

const CreateEnquiryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "doctor";

  const serviceId = searchParams.get("serviceId") || "";
  const [service, setService] = useState<HospitalServiceI | null>(null);

  const doctorId = searchParams.get("doctorId") || "";
  const doctorSlug = searchParams.get("doctorSlug") || doctorId;
  const { isAuthenticated, isHydrated } = useAuth();

  const [doctor, setDoctor] = useState<DoctorI | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (
      type === "doctor"
        ? !doctorId
        : !serviceId
    ) {
      setLoadingPage(false);
      return;
    }

    const loadContext = async () => {
      try {
        setLoadingPage(true);

        let profileResponse: UserProfile;

        if (type === "doctor") {
          const [doctorData, profileData] = await Promise.all([
            fetchDoctorDetailAPI(doctorSlug),
            fetchCurrentUserProfileAPI(),
          ]);

          profileResponse = profileData;
          setDoctor(doctorData);
        } else {
          const [serviceData, profileData] = await Promise.all([
            fetchHospitalServiceDetailAPI(serviceId),
            fetchCurrentUserProfileAPI(),
          ]);

          profileResponse = profileData;
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

      } catch (error) {
        showToast({
          message: "Error",
          description: getErrorMessage(error, "Failed to load details"),
          type: "error",
        });
      } finally {
        setLoadingPage(false);
      }
    };

    loadContext();
  }, [
    type,
    doctorId,
    doctorSlug,
    serviceId,
    isAuthenticated,
    isHydrated,
    router,
  ]);

  const submitEnquiry = async () => {
    if (!selectedPatient || !selectedDate) {
      showToast({
        message: "Missing details",
        description: "Please select patient and preferred date",
        type: "error",
      });
      return;
    }

    if (!reason.trim()) {
      showToast({
        message: "Reason required",
        description: "Please enter the reason for enquiry.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);

      await createEnquiryAPI({
        user_id: profile?.id,
        doctor_id: type === "doctor" ? doctorId : undefined,
        hospital_id: type === "doctor" ? doctor?.hospital_id || "" : service?.hospital_id || "",
        patient_name: selectedPatient.name,
        phone_number: profile?.phone || "",
        enquiry_date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        message: reason.trim(),
      });

      showToast({
        message: "Enquiry Submitted",
        description: "We will get back to you soon.",
        type: "success",
      });

      // Redirect back after success
      if (type === "doctor") {
        router.push(doctor?.slug ? `/doctors/${doctor.slug}` : "/doctors");
      } else {
        router.push("/hospitals");
      }

    } catch (error) {
      showToast({
        message: "Submission failed",
        description: getErrorMessage(error, "Failed to submit enquiry"),
        type: "error",
      });
    } finally {
      setSubmitting(false);
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
    (type === "doctor" && !doctorId) ||
    (type === "service" && !serviceId)
  ) {
    return (
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-red-700">
            {type === "doctor"
              ? "Doctor details are missing."
              : "Service details are missing."}
          </p>

          <Button
            asChild
            className="mt-5 bg-[#1D453F] hover:bg-[#173A35]"
          >
            <Link href={type === "doctor" ? "/doctors" : "/hospitals"}>
              {type === "doctor" ? "Find Doctors" : "Browse Hospitals"}
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
              type === "doctor"
                ? doctor?.slug
                  ? `/doctors/${doctor.slug}`
                  : "/doctors"
                : "/hospitals"
            }
          >
            <ArrowLeft size={18} />
            {type === "doctor" ? "Back to Doctor" : "Back to Hospital"}
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-5 rounded-lg border border-[#E0ECE9] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 border-b border-[#E6EEEC] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#347D73]">
                  {type === "doctor" ? (
                    <Stethoscope size={16} />
                  ) : (
                    <BriefcaseMedical size={16} />
                  )}
                  {type === "doctor" ? "Doctor Enquiry" : "Service Enquiry"}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-[#173F3A]">
                  {type === "doctor"
                    ? `Enquiry for Dr. ${doctor?.name || "Doctor"}`
                    : `Enquiry for ${service?.name || "Service"}`}
                </h1>
                <p className="mt-2 text-sm text-[#6B7C80]">
                  {type === "doctor"
                    ? "Choose a preferred date and let us know your concern."
                    : "Choose a preferred date for this service and let us know any specific notes."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#344C50]">
                Preferred Date
                <span className="text-red-500">*</span>
              </label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Select preferred date"
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
                Preferred date selected
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="text-sm font-semibold text-[#344C50]"
              >
                {type === "doctor" ? "Reason for enquiry" : "Enquiry notes"}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={
                  type === "doctor"
                    ? "Example: Headache, fever, want to know availability"
                    : "Example: Scan requirement, health checkup, diagnostic request"
                }
                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
          </section>

          <aside className="h-fit space-y-4 rounded-lg border border-[#E0ECE9] bg-white p-5 shadow-sm md:p-6">
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
              onClick={submitEnquiry}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Enquiry
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

export default function CreateEnquiryPage() {
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
      <CreateEnquiryContent />
    </Suspense>
  );
}
