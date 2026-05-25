"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  MapPin,
  Save,
  User,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import useMyBookings from "@/hooks/bookings/use-hook";
import {
  fetchCurrentUserProfileAPI,
  updateUserProfileAPI,
} from "@/network/auth";
import { fetchDistrictsAPI } from "@/network/districts/get";
import { DistrictI } from "@/network/districts/types";
import { AuthUser, Gender, UserProfile } from "@/types/auth";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/components/ConfirmModal";
import FamilyMembersCard from "@/components/FamilyMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import BookingCard from "@/components/BookingCard";
import useUploadFile from "@/hooks/files/use-upload-file";

const genderOptions: Gender[] = ["male", "female", "other"];

const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().optional(),
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

const isGender = (value: unknown): value is Gender =>
  typeof value === "string" && genderOptions.includes(value as Gender);

const getProfileName = (profile?: UserProfile | null): string => {
  const name = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Zodo user";
};

const formatLabel = (value?: string | null): string =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "Not set";

const mapProfileToForm = (profile: UserProfile): ProfileFormData => ({
  first_name: profile.first_name || "",
  last_name: profile.last_name || "",
  age: profile.age || 1,
  gender: isGender(profile.gender) ? profile.gender : "other",
  district_id: profile.district_id || "",
});

const mapProfileToAuthUser = (
  profile: UserProfile,
  fallbackUser?: AuthUser | null
): AuthUser => ({
  ...fallbackUser,
  id: profile.id,
  first_name: profile.first_name,
  last_name: profile.last_name,
  phone: profile.phone,
  phone_number: fallbackUser?.phone_number || profile.phone,
  user_type: profile.user_type,
  email: profile.email,
  profile_picture: profile.profile_picture,
  district_id: profile.district_id,
  gender: profile.gender,
  age: profile.age,
});

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    tokens,
    isAuthenticated,
    isHydrated,
    setAuthData,
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [districts, setDistricts] = useState<DistrictI[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingProfileData, setPendingProfileData] =
    useState<ProfileFormData | null>(null);

  const {
    bookings: recentBookings,
    loading: bookingsLoading,
    totalItems,
  } = useMyBookings({
    limit: 3,
    autoFetch: isAuthenticated,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    uploadFile,
    loading: imageUploading,
  } = useUploadFile();

  const [profileImage, setProfileImage] =
    useState<string>("");

  const selectedGender = watch("gender");
  const selectedDistrictId = watch("district_id");

  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const [profileResponse, districtsResponse] = await Promise.all([
        fetchCurrentUserProfileAPI(),
        fetchDistrictsAPI(),
      ]);

      setProfile(profileResponse);
      setProfileImage(profileResponse.profile_picture || "");
      setDistricts(districtsResponse.data || []);
      reset(mapProfileToForm(profileResponse));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile";
      showToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [reset]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    loadProfile();
  }, [isAuthenticated, isHydrated, loadProfile, router]);

  const districtName = useMemo(() => {
    const district = districts.find((item) => item.id === profile?.district_id);
    return district?.name || profile?.district_id || "Not set";
  }, [districts, profile?.district_id]);

  const userPhone = profile?.phone || user?.phone_number || user?.phone || "";


  const handleCancelEdit = () => {

    if (profile) {

      reset(
        mapProfileToForm(profile)
      );

      setProfileImage(
        profile.profile_picture || ""
      );
    }

    setIsEditing(false);
  };

  const handleEditSubmit = (data: ProfileFormData) => {
    setPendingProfileData(data);
    setShowEditConfirm(true);
  };

  const saveProfile = async () => {
    if (!profile || !pendingProfileData) {
      return;
    }

    const data = pendingProfileData;

    try {
      setSaving(true);
      const response = await updateUserProfileAPI(profile.id, {
        first_name: data.first_name,
        last_name: data.last_name || "",
        age: data.age,
        gender: data.gender,
        district_id: data.district_id,
        profile_picture: profileImage || "",
      });

      if (response.status) {
        const refreshedProfile = await fetchCurrentUserProfileAPI();
        setProfile(refreshedProfile);
        reset(mapProfileToForm(refreshedProfile));

        if (tokens) {
          setAuthData(mapProfileToAuthUser(refreshedProfile, user), tokens);
        }

        setIsEditing(false);
        setShowEditConfirm(false);
        setPendingProfileData(null);
        showToast({
          message: "Success",
          description: "Profile updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      showToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isHydrated || loadingProfile) {
    return (
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <Skeleton className="h-[520px] rounded-lg" />
            <Skeleton className="h-[520px] rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-[#F6FAF9] px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" asChild className="w-fit gap-2">
              <Link href="/">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <div className="flex flex-col gap-6">
              <Card className="rounded-lg border-[#E0ECE9] shadow-sm">
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl text-[#173F3A]">
                        <User size={22} />
                        My Profile
                      </CardTitle>
                      <p className="mt-2 text-sm text-[#6B7C80]">
                        Manage your personal details for bookings.
                      </p>
                    </div>
                    {!isEditing && (
                      <Button
                        type="button"
                        size="sm"
                        className="gap-2 bg-[#1D453F] hover:bg-[#173A35]"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="relative">

                      <Avatar className="h-20 w-20 border border-[#DCE9E6]">

                        {profileImage && (
                          <AvatarImage
                            src={profileImage}
                            alt={getProfileName(profile)}
                          />
                        )}

                        <AvatarFallback className="bg-[#EAF5F2] text-[#1D453F]">
                          <UserRound size={38} />
                        </AvatarFallback>

                      </Avatar>

                      {isEditing && (

                        <label
                          htmlFor="profile-upload"
                          className="absolute -bottom-2 left-1/2 flex h-5 min-w-[56px] -translate-x-1/2 cursor-pointer items-center justify-center rounded-sm bg-[#1D453F] px-2 text-white shadow-md transition hover:bg-[#173A35]"
                        >

                          <span className="text-xs font-semibold">
                            Change
                          </span>

                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={imageUploading}
                            onChange={async (e) => {

                              const file =
                                e.target.files?.[0];

                              if (!file) return;

                              const uploadedUrl =
                                await uploadFile(file);

                              if (uploadedUrl) {

                                setProfileImage(
                                  uploadedUrl
                                );
                              }
                            }}
                          />

                        </label>

                      )}

                    </div>
                    <div className="min-w-0">
                      <h1 className="truncate text-xl font-bold text-[#173F3A]">
                        {getProfileName(profile)}
                      </h1>
                      <p className="mt-1 text-sm text-[#6B7C80]">
                        {userPhone || "Phone not available"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="first_name"
                            className="text-sm font-medium text-[#344C50]"
                          >
                            First Name
                            <span className="text-red-500">*</span>
                          </label>
                          <Input id="first_name" {...register("first_name")} />
                          {errors.first_name && (
                            <p className="text-sm text-red-500">
                              {errors.first_name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="last_name"
                            className="text-sm font-medium text-[#344C50]"
                          >
                            Last Name
                          </label>
                          <Input id="last_name" {...register("last_name")} />
                          {errors.last_name && (
                            <p className="text-sm text-red-500">
                              {errors.last_name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="age"
                            className="text-sm font-medium text-[#344C50]"
                          >
                            Age
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="age"
                            type="number"
                            min="1"
                            max="150"
                            {...register("age")}
                          />
                          {errors.age && (
                            <p className="text-sm text-red-500">
                              {errors.age.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="gender"
                            className="text-sm font-medium text-[#344C50]"
                          >
                            Gender
                            <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={selectedGender}
                            onValueChange={(value) =>
                              setValue("gender", value as Gender, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {formatLabel(gender)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className="text-sm text-red-500">
                              {errors.gender.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="district_id"
                          className="text-sm font-medium text-[#344C50]"
                        >
                          District
                          <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={selectedDistrictId}
                          onValueChange={(value) =>
                            setValue("district_id", value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger id="district_id">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts
                              .filter((district) => district.id)
                              .map((district) => (
                                <SelectItem
                                  key={district.id}
                                  value={district.id || ""}
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errors.district_id && (
                          <p className="text-sm text-red-500">
                            {errors.district_id.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 border-t border-[#E6EEEC] pt-5 sm:flex-row">
                        <Button
                          type="submit"
                          disabled={saving}
                          className="flex-1 gap-2 bg-[#1D453F] hover:bg-[#173A35]"
                        >
                          <Save size={16} />
                          {saving ? "Saving..." : "Save Profile"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 rounded-lg bg-[#F4F8F7] p-4">
                        <UserRound size={18} className="text-[#347D73]" />
                        <div>
                          <p className="text-xs font-medium uppercase text-[#7B8E92]">
                            Age
                          </p>
                          <p className="font-semibold text-[#173F3A]">
                            {profile.age || "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-[#F4F8F7] p-4">
                        <UserRound size={18} className="text-[#347D73]" />
                        <div>
                          <p className="text-xs font-medium uppercase text-[#7B8E92]">
                            Gender
                          </p>
                          <p className="font-semibold text-[#173F3A]">
                            {formatLabel(profile.gender)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-[#F4F8F7] p-4">
                        <MapPin size={18} className="text-[#347D73]" />
                        <div>
                          <p className="text-xs font-medium uppercase text-[#7B8E92]">
                            District
                          </p>
                          <p className="font-semibold text-[#173F3A]">
                            {districtName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <FamilyMembersCard
                userId={profile.id}
                isAuthenticated={isAuthenticated}
              />
            </div>

            <Card className="rounded-lg border-[#E0ECE9] shadow-sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl text-[#173F3A]">
                    <CalendarDays size={22} />
                    Recent Bookings
                  </CardTitle>
                  <p className="mt-2 text-sm text-[#6B7C80]">
                    Showing the latest 3 appointments.
                  </p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="w-fit border-[#B7D5D0] text-[#1D453F]"
                >
                  <Link href="/my-bookings">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                  </div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        compact
                      />
                    ))}
                    {totalItems > 3 && (
                      <p className="text-sm text-[#6B7C80]">
                        {totalItems - 3} more booking
                        {totalItems - 3 === 1 ? "" : "s"} available.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[#C9DCD8] bg-[#F8FBFA] p-8 text-center">
                    <p className="font-semibold text-[#173F3A]">
                      No bookings yet
                    </p>
                    <p className="mt-2 text-sm text-[#6B7C80]">
                      Your recent appointments will appear here.
                    </p>
                    <Button
                      asChild
                      className="mt-5 bg-[#1D453F] hover:bg-[#173A35]"
                    >
                      <Link href="/doctors">Find Doctors</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ConfirmModal
        open={showEditConfirm}
        title="Save profile changes?"
        description="Your updated name, age, gender, and district will be used for your profile and future bookings."
        confirmText="Save Changes"
        loading={saving}
        onCancel={() => {
          setShowEditConfirm(false);
          setPendingProfileData(null);
        }}
        onConfirm={saveProfile}
      />
    </>
  );
}
