"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Smartphone } from "lucide-react";
import { showToast } from "@/lib/toast";
import { loginWithPhoneAPI } from "@/network/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizePhoneNumber } from "@/lib/validations";

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

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPhoneComponentProps {
  onSuccess: (userId: string, phoneNumber: string) => void;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return error instanceof Error ? error.message : "Failed to send OTP";
};

const LoginPhoneComponent = ({ onSuccess }: LoginPhoneComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const normalizedPhone = normalizePhoneNumber(data.phone_number);

      const response = await loginWithPhoneAPI({
        phone_number: normalizedPhone,
      });

      if (response.status) {
        const phoneNumber =
          response.data.user.phone_number ||
          response.data.user.phone ||
          normalizedPhone;

        showToast({
          message: "Success",
          description: "OTP sent to your phone",
          type: "success",
        });
        onSuccess(response.data.user.id, phoneNumber);
      }
    } catch (error: unknown) {
      showToast({
        message: "Error",
        description: getErrorMessage(error),
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
          <Smartphone size={24} />
        </div>
        <CardTitle className="text-2xl text-[#173F3A]">Sign in</CardTitle>
        <p className="text-sm leading-6 text-[#6B7C80]">
          Enter your mobile number to continue.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="phone_number"
              className="text-sm font-medium text-[#344C50]"
            >
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <div className="flex h-11 items-center gap-2 rounded-l-md border border-r-0 border-input bg-[#F8FBFA] px-3 text-[#344C50]">
                <Smartphone size={16} />
                <span className="text-sm font-semibold">+91</span>
              </div>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Enter mobile number"
                className="h-11 rounded-l-none"
                {...register("phone_number")}
              />
            </div>
            {errors.phone_number && (
              <span className="text-sm text-red-500">
                {errors.phone_number.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-full bg-[#1D453F] font-semibold text-white hover:bg-[#173A35]"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
            {!isLoading && <ArrowRight size={18} />}
          </Button>

          <p className="text-center text-xs leading-5 text-[#7B8E92]">
            We will send a one-time verification code to this number.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPhoneComponent;
