"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import { updateUserProfileAPI } from "@/network/auth";
import { fetchDistrictsAPI } from "@/network/districts/get";
import { DistrictI } from "@/network/districts/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  age: z.coerce
    .number()
    .min(1, "Age must be at least 1")
    .max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  district_id: z.string().min(1, "Please select a district"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface CompleteProfileComponentProps {
  userId: string;
  phoneNumber: string;
  onSuccess: () => void;
}

const CompleteProfileComponent = ({
  userId,
  phoneNumber,
  onSuccess,
}: CompleteProfileComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState<DistrictI[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const selectedGender = watch("gender");
  const selectedDistrictId = watch("district_id");

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setDistrictLoading(true);
        const response = await fetchDistrictsAPI();
        setDistricts(response.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        showToast({
          message: "Warning",
          description: "Could not load districts list",
          type: "error",
        });
      } finally {
        setDistrictLoading(false);
      }
    };

    loadDistricts();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await updateUserProfileAPI(userId, {
        first_name: data.first_name,
        last_name: data.last_name,
        age: data.age,
        gender: data.gender,
        district_id: data.district_id,
      });

      if (response.status) {
        showToast({
          message: "Success",
          description: "Profile created successfully",
          type: "success",
        });
        onSuccess();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to complete profile";
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
    <Card className="w-full rounded-lg border-[#DDEBE8] shadow-sm lg:min-w-[560px]">
      <CardHeader className="items-center text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF5F2] text-[#1D453F]">
          <UserRound size={24} />
        </div>
        <CardTitle className="text-2xl text-[#173F3A]">
          Complete Profile
        </CardTitle>
        <p className="flex items-center justify-center gap-2 text-sm text-[#6B7C80]">
          <Phone size={15} />
          {phoneNumber}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="flex items-center gap-2 text-sm font-medium text-[#344C50]"
              >
                <UserRound size={15} />
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="first_name"
                className="h-11"
                placeholder="Enter first name"
                {...register("first_name")}
              />
              {errors.first_name && (
                <span className="text-sm text-red-500">
                  {errors.first_name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="flex items-center gap-2 text-sm font-medium text-[#344C50]"
              >
                <UserRound size={15} />
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="last_name"
                className="h-11"
                placeholder="Enter last name"
                {...register("last_name")}
              />
              {errors.last_name && (
                <span className="text-sm text-red-500">
                  {errors.last_name.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="age"
                className="flex items-center gap-2 text-sm font-medium text-[#344C50]"
              >
                <CalendarDays size={15} />
                Age <span className="text-red-500">*</span>
              </label>
              <Input
                id="age"
                type="number"
                min="1"
                max="150"
                className="h-11"
                placeholder="Enter your age"
                {...register("age")}
              />
              {errors.age && (
                <span className="text-sm text-red-500">
                  {errors.age.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="flex items-center gap-2 text-sm font-medium text-[#344C50]"
              >
                <BadgeCheck size={15} />
                Gender <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedGender}
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="gender" className="h-11">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <span className="text-sm text-red-500">
                  {errors.gender.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="district_id"
              className="flex items-center gap-2 text-sm font-medium text-[#344C50]"
            >
              <MapPin size={15} />
              District <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedDistrictId}
              onValueChange={(value) =>
                setValue("district_id", value, { shouldValidate: true })
              }
              disabled={districtLoading}
            >
              <SelectTrigger id="district_id" className="h-11">
                <SelectValue
                  placeholder={
                    districtLoading ? "Loading districts..." : "Select district"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {districts
                  .filter((district) => district.id)
                  .map((district) => (
                    <SelectItem key={district.id} value={district.id || ""}>
                      {district.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.district_id && (
              <span className="text-sm text-red-500">
                {errors.district_id.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-full bg-[#1D453F] font-semibold text-white hover:bg-[#173A35]"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompleteProfileComponent;
