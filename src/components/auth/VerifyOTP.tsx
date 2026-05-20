"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { showToast } from "@/lib/toast";
import { verifyOTPAPI } from "@/network/auth";
import { AuthUser } from "@/types/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface VerifyOTPComponentProps {
  userId: string;
  phoneNumber: string;
  onSuccess: (
    tokens: { accessToken: string; refreshToken: string },
    isNewUser: boolean,
    user: AuthUser
  ) => void;
  onBack: () => void;
}

const VerifyOTPComponent = ({
  userId,
  phoneNumber,
  onSuccess,
  onBack,
}: VerifyOTPComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleDigitInput = (index: number, value: string) => {
    const nextValue = value.length > 1 ? value.slice(-1) : value;

    if (!/^\d*$/.test(nextValue)) {
      return;
    }

    const newOtp = otpValue.split("");
    newOtp[index] = nextValue;
    setValue("otp", newOtp.join(""));

    if (nextValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      const response = await verifyOTPAPI({
        user_id: userId,
        otp: data.otp,
      });

      if (response.status) {
        showToast({
          message: "Success",
          description: "OTP verified successfully",
          type: "success",
        });
        onSuccess(
          response.data.tokens,
          response.data.new_user,
          response.data.user
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";
      showToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-lg border-[#DDEBE8] shadow-sm">
      <CardHeader className="items-center text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF5F2] text-[#1D453F]">
          <ShieldCheck size={24} />
        </div>
        <CardTitle className="text-2xl text-[#173F3A]">Verify OTP</CardTitle>
        <p className="text-sm leading-6 text-[#6B7C80]">
          Enter the 4-digit code sent to {phoneNumber}.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Button
            type="button"
            variant="ghost"
            className="h-auto px-0 text-[#1D453F] hover:bg-transparent hover:text-[#173A35]"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Edit mobile number
          </Button>

          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={otpValue[index] || ""}
                  onChange={(event) =>
                    handleDigitInput(index, event.target.value)
                  }
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className="h-12 w-12 rounded-lg border-2 border-[#DDEBE8] text-center text-2xl font-bold text-[#173F3A] focus:border-[#1D453F] focus-visible:ring-[#1D453F]/20"
                  inputMode="numeric"
                />
              ))}
            </div>
            {errors.otp && (
              <span className="block text-center text-sm text-red-500">
                {errors.otp.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || otpValue.length !== 4}
            className="h-11 w-full rounded-full bg-[#1D453F] font-semibold text-white hover:bg-[#173A35]"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              disabled={timeLeft > 0}
              className="h-auto p-0 text-[#1D453F] underline"
            >
              Resend OTP {timeLeft > 0 && `(${timeLeft}s)`}
            </Button>
            <p className="mt-2 text-xs text-[#7B8E92]">
              Your information is safe with us.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyOTPComponent;
