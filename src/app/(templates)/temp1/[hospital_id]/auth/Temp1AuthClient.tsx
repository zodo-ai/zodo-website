"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Smartphone,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import {
  loginWithPhoneAPI,
  verifyOTPAPI,
  updateUserProfileAPI,
} from "@/network/auth";
import { fetchDistrictsAPI } from "@/network/districts/get";
import { DistrictI } from "@/network/districts/types";
import { useAuth } from "@/hooks/use-auth";
import { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizePhoneNumber } from "@/lib/validations";

type AuthStep = "login" | "verify-otp" | "complete-profile" | "success";

interface Temp1AuthClientProps {
  hospitalName: string;
  logoImage?: string;
  primaryColor: string;
  hospitalSlug: string;
}

const loginSchema = z.object({
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\+\(\)]+$/, "Phone number contains invalid characters")
    .refine((value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 10;
    }, "Phone number must contain at least 10 digits"),
});

const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numeric"),
});

const profileSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().optional(),
  age: z.coerce.number().min(1, "Age must be at least 1").max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  district_id: z.string().min(1, "Please select a district"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

export default function Temp1AuthClient({
  hospitalName,
  logoImage,
  primaryColor,
  hospitalSlug,
}: Temp1AuthClientProps) {
  const [step, setStep] = useState<AuthStep>("login");
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState<DistrictI[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);

  useEffect(() => {
    if (step === "complete-profile") {
      const loadDistricts = async () => {
        try {
          setDistrictLoading(true);
          const response = await fetchDistrictsAPI();
          setDistricts(response.data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setDistrictLoading(false);
        }
      };
      loadDistricts();
    }
  }, [step]);

  // Styling helper based on primaryColor
  const primaryBgColor = { backgroundColor: primaryColor, color: "#fff" };
  const primaryTextColor = { color: primaryColor };
  const primaryBorderColor = { borderColor: primaryColor };

  const reloadToHome = () => {
    window.location.href = `/temp1/${hospitalSlug}`;
  };

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return error instanceof Error ? error.message : "An error occurred";
  };

  // --- LOGIN PHONE ---
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const normalizedPhone = normalizePhoneNumber(data.phone_number);
      const response = await loginWithPhoneAPI({ phone_number: normalizedPhone });

      if (response.status) {
        const phone = response.data.user.phone_number || response.data.user.phone || normalizedPhone;
        showToast({ message: "Success", description: "OTP sent to your phone", type: "success" });
        setUserId(response.data.user.id);
        setPhoneNumber(phone);
        setStep("verify-otp");
      }
    } catch (error) {
      showToast({ message: "Error", description: getErrorMessage(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- VERIFY OTP ---
  const {
    watch: watchOtp,
    setValue: setOtpValue,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPFormData>({ resolver: zodResolver(otpSchema), defaultValues: { otp: "" } });
  const otpValue = watchOtp("otp");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitInput = (index: number, value: string) => {
    const nextValue = value.length > 1 ? value.slice(-1) : value;
    if (!/^\d*$/.test(nextValue)) return;

    const newOtp = otpValue.split("");
    newOtp[index] = nextValue;
    setOtpValue("otp", newOtp.join(""));

    if (nextValue && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onVerifyOtp = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      const response = await verifyOTPAPI({ user_id: userId, otp: data.otp });

      if (response.status) {
        showToast({ message: "Success", description: "OTP verified successfully", type: "success" });
        setAuthData(response.data.user, {
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken,
        });

        if (response.data.new_user) {
          setStep("complete-profile");
        } else {
          setStep("success");
          setTimeout(reloadToHome, 1500);
        }
      }
    } catch (error) {
      showToast({ message: "Error", description: getErrorMessage(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPLETE PROFILE ---
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const onCompleteProfile = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await updateUserProfileAPI(userId, {
        first_name: data.first_name,
        last_name: data.last_name || "",
        age: data.age,
        gender: data.gender,
        district_id: data.district_id,
      });

      if (response.status) {
        showToast({ message: "Success", description: "Profile completed", type: "success" });
        setStep("success");
        setTimeout(reloadToHome, 1500);
      }
    } catch (error) {
      showToast({ message: "Error", description: getErrorMessage(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-[#F6FAF9]">
      {/* LEFT PANEL - Branding */}
      <div className="hidden md:flex flex-1 flex-col justify-center relative overflow-hidden text-center p-10" style={primaryBgColor}>
        {/* Subtle background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col items-center h-full py-4">
          <div className="bg-white p-3 rounded-xl shadow-md mb-8 inline-block">
            {logoImage ? (
              <Image
                src={logoImage}
                alt={hospitalName}
                width={150}
                height={50}
                className="object-contain max-h-[50px] mx-auto"
              />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Stethoscope size={24} style={primaryTextColor} />
                <span className="font-bold text-lg" style={primaryTextColor}>{hospitalName}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Welcome to {hospitalName}
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-sm mx-auto">
            Your health and well-being are our top priority. Sign in to easily manage your appointments and records.
          </p>

          <div className="mt-auto space-y-4 w-full max-w-sm mx-auto text-left">
            {[
              { title: "Find trusted doctors", icon: Stethoscope },
              { title: "Manage appointments", icon: CalendarCheck },
              { title: "Secure access", icon: ShieldCheck },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-4 items-center bg-white/10 rounded-lg p-4 backdrop-blur-sm shadow-sm transition hover:bg-white/20">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-800">
                    <Icon size={20} style={primaryTextColor} />
                  </div>
                  <span className="font-medium text-white">{benefit.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Forms */}
      <div className="w-full flex-1 p-4 sm:p-8 flex flex-col justify-center items-center overflow-y-auto">
        {step === "login" && (
          <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <Smartphone size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="text-gray-500 mt-2">Enter your mobile number to continue.</p>
            </div>

            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <div className="flex h-12 items-center gap-2 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-3 text-gray-600">
                    <Smartphone size={18} />
                    <span className="text-sm font-semibold">+91</span>
                  </div>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="Enter mobile number"
                    className="h-12 rounded-l-none text-lg border-gray-200"
                    {...registerLogin("phone_number")}
                  />
                </div>
                {loginErrors.phone_number && (
                  <span className="text-sm text-red-500">{loginErrors.phone_number.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                style={primaryBgColor}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </form>
          </div>
        )}

        {step === "verify-otp" && (
          <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
              <p className="text-gray-500 mt-2">Enter the 4-digit code sent to +91 {phoneNumber}.</p>
            </div>

            <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-6">
              <Button
                type="button"
                variant="ghost"
                className="h-auto px-0 hover:bg-transparent -mt-2"
                style={primaryTextColor}
                onClick={() => setStep("login")}
              >
                <ArrowLeft size={16} className="mr-2" /> Edit mobile number
              </Button>

              <div className="space-y-2">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={otpValue[index] || ""}
                      onChange={(e) => handleDigitInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="h-14 w-14 rounded-xl border-2 text-center text-2xl font-bold transition-all focus:ring-4"
                      style={{
                        borderColor: otpValue[index] ? primaryColor : '#E5E7EB',
                        color: primaryColor,
                        boxShadow: otpValue[index] ? `0 0 0 2px ${primaryColor}20` : 'none'
                      }}
                      inputMode="numeric"
                    />
                  ))}
                </div>
                {otpErrors.otp && (
                  <span className="block text-center text-sm text-red-500 mt-2">{otpErrors.otp.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || otpValue.length !== 4}
                className="h-12 w-full rounded-full font-semibold shadow-md hover:shadow-lg transition-all mt-6"
                style={primaryBgColor}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </div>
        )}

        {step === "complete-profile" && (
          <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Complete Profile</h2>
              <p className="text-gray-500 mt-2">Almost there! We need a few more details.</p>
            </div>

            <form onSubmit={handleProfileSubmit(onCompleteProfile)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <Input {...registerProfile("first_name")} className="h-11" placeholder="John" />
                  {profileErrors.first_name && <span className="text-xs text-red-500">{profileErrors.first_name.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input {...registerProfile("last_name")} className="h-11" placeholder="Doe" />
                  {profileErrors.last_name && <span className="text-xs text-red-500">{profileErrors.last_name.message}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  {...registerProfile("gender")}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {profileErrors.gender && <span className="text-xs text-red-500">{profileErrors.gender.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Input type="number" {...registerProfile("age")} className="h-11" placeholder="Enter age" />
                {profileErrors.age && <span className="text-xs text-red-500">{profileErrors.age.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  {...registerProfile("district_id")}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={districtLoading}
                >
                  <option value="">{districtLoading ? "Loading districts..." : "Select district"}</option>
                  {districts.filter(d => d.id).map(d => (
                    <option key={d.id || "null-id"} value={d.id || ""}>{d.name}</option>
                  ))}
                </select>
                {profileErrors.district_id && <span className="text-xs text-red-500">{profileErrors.district_id.message}</span>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-full font-semibold shadow-md hover:shadow-lg transition-all mt-4"
                style={primaryBgColor}
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in duration-500">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500">Your account is ready. Redirecting you home...</p>
          </div>
        )}
      </div>
    </main>
  );
}
