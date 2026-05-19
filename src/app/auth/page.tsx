"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import LoginPhoneComponent from "@/components/auth/LoginPhone";
import VerifyOTPComponent from "@/components/auth/VerifyOTP";
import CompleteProfileComponent from "@/components/auth/CompleteProfile";
import { BrandLogo } from "@/components/Logo";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/hooks/use-auth";
import { AuthUser } from "@/types/auth";

type AuthStep = "login" | "verify-otp" | "complete-profile" | "success";

const authBenefits = [
  {
    title: "Find trusted doctors",
    description: "Browse verified specialists and choose a convenient slot.",
    icon: Stethoscope,
  },
  {
    title: "Manage appointments",
    description: "Book consultations and view your booking history in one place.",
    icon: CalendarCheck,
  },
  {
    title: "Secure access",
    description: "Continue with phone verification and keep your account protected.",
    icon: ShieldCheck,
  },
];

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setAuthData } = useAuth();

  const reloadToHome = () => {
    window.location.href = "/";
  };

  const handleLoginSuccess = (userId: string, phoneNumber: string) => {
    setUserId(userId);
    setPhoneNumber(phoneNumber);
    setStep("verify-otp");
  };

  const handleOTPSuccess = (
    tokens: { accessToken: string; refreshToken: string },
    isNewUser: boolean,
    user: AuthUser
  ) => {
    setAuthData(user, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    if (isNewUser) {
      setStep("complete-profile");
    } else {
      setStep("success");
      showToast({
        message: "Welcome",
        description: "Logging you in...",
        type: "success",
      });
      setTimeout(reloadToHome, 1500);
    }
  };

  const handleProfileSuccess = () => {
    setStep("success");
    showToast({
      message: "Welcome",
      description: "Your account has been created successfully",
      type: "success",
    });
    setTimeout(reloadToHome, 1500);
  };

  const handleBackToLogin = () => {
    setStep("login");
    setUserId("");
    setPhoneNumber("");
  };

  return (
    <main className="min-h-screen bg-[#F6FAF9] px-4 py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <div className="mb-8 flex justify-center lg:justify-start">
          <BrandLogo />
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
          <section className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#347D73]">
              ZODO AI healthcare
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-[#173F3A]">
              Book care faster with one secure account.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#5C7074]">
              Sign in to schedule doctor consultations, track bookings, and
              keep your profile ready for every appointment.
            </p>

            <div className="mt-8 space-y-4">
              {authBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex gap-4 rounded-lg border border-[#DDEBE8] bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EAF5F2] text-[#1D453F]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#173F3A]">
                        {benefit.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-[#6B7C80]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md lg:max-w-none">
            {step === "login" && (
              <LoginPhoneComponent onSuccess={handleLoginSuccess} />
            )}

            {step === "verify-otp" && (
              <VerifyOTPComponent
                userId={userId}
                phoneNumber={phoneNumber}
                onSuccess={handleOTPSuccess}
                onBack={handleBackToLogin}
              />
            )}

            {step === "complete-profile" && (
              <CompleteProfileComponent
                userId={userId}
                phoneNumber={phoneNumber}
                onSuccess={handleProfileSuccess}
              />
            )}

            {step === "success" && (
              <div className="rounded-lg border border-[#DDEBE8] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-[#173F3A]">
                  Success
                </h2>
                <p className="mt-2 text-sm text-[#6B7C80]">
                  Your account is ready. Redirecting...
                </p>
              </div>
            )}
          </section>
        </div>

        <p className="mt-8 text-center text-sm text-[#6B7C80]">
          By continuing, you agree to our{" "}
          <a
            href="/terms-and-conditions"
            className="font-medium text-[#1D453F] hover:underline"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            className="font-medium text-[#1D453F] hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}
