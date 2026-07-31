"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Save, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUploadFile from "@/hooks/files/use-upload-file";
import { ChildUser } from "@/types/child-user";
import { fetchChildUserByIdAPI } from "@/network/child-users";

const childUserSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  age: z.coerce
    .number()
    .min(1, "Age must be at least 1")
    .max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  relation: z.string().trim().min(1, "Relation is required"),
});

type ChildUserFormData = z.infer<typeof childUserSchema>;

const genderOptions = ["male", "female", "other"] as const;

const relationOptions = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Son",
  "Daughter",
  "Husband",
  "Wife",
  "Friend",
  "Other",
];

interface ChildUserFormModalProps {
  open: boolean;
  editingUser: ChildUser | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    data: ChildUserFormData & { profile_picture: string }
  ) => void;
}

const ChildUserFormModal = ({
  open,
  editingUser,
  saving,
  onClose,
  onSubmit,
}: ChildUserFormModalProps) => {
  const [profileImage, setProfileImage] = useState("");
  const { uploadFile, loading: imageUploading } = useUploadFile();

  const [loadingUser, setLoadingUser] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChildUserFormData>({
    resolver: zodResolver(childUserSchema),
    defaultValues: {
      fullname: "",
      age: 1,
      gender: "male",
      relation: "",
    },
  });

  const selectedGender = watch("gender");
  const selectedRelation = watch("relation");

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      if (editingUser) {
        const fetchUser = async () => {
          setLoadingUser(true);
          try {
            const response = await fetchChildUserByIdAPI(editingUser.id);
            if (response.data) {
              const fetchedUser = response.data;
              reset({
                fullname: fetchedUser.fullname || "",
                age: fetchedUser.age || 1,
                gender: (fetchedUser.gender as "male" | "female" | "other") || "other",
                relation: fetchedUser.relation ? fetchedUser.relation.toLowerCase() : "",
              });
              setProfileImage(fetchedUser.profile_picture || "");
            }
          } catch (error) {
            console.error("Failed to fetch user:", error);
            // Fallback to the user data passed in from the list
            reset({
              fullname: editingUser.fullname || "",
              age: editingUser.age || 1,
              gender: (editingUser.gender as "male" | "female" | "other") || "other",
              relation: editingUser.relation ? editingUser.relation.toLowerCase() : "",
            });
            setProfileImage(editingUser.profile_picture || "");
          } finally {
            setLoadingUser(false);
          }
        };
        fetchUser();
      } else {
        reset({
          fullname: "",
          age: 1,
          gender: "male",
          relation: "",
        });
        setProfileImage("");
      }
    }
  }, [open, editingUser, reset]);

  const handleFormSubmit = (data: ChildUserFormData) => {
    onSubmit({
      ...data,
      profile_picture: profileImage,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/45">
      <div className="min-h-screen flex items-start sm:items-center justify-center p-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="child-user-form-title"
          className="w-full sm:max-w-sm rounded-xl border border-[#DCE9E6] bg-white shadow-xl max-h-full overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E6EEEC] bg-white px-5 py-4 sm:px-6 rounded-t-2xl sm:rounded-t-xl">
            <h2
              id="child-user-form-title"
              className="text-lg font-semibold text-[#173F3A]"
            >
              {editingUser ? "Edit Family Member" : "Add Family Member"}
            </h2>
            <button
              onClick={onClose}
              disabled={saving || imageUploading}
              className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-full text-[#6B7C80] transition-colors hover:bg-[#F4F8F7] hover:text-[#173F3A]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-5 p-5 sm:p-6"
          >
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative inline-block">
                <Avatar className="h-20 w-20 border-2 border-[#DCE9E6] shadow-sm">
                  {profileImage && (
                    <AvatarImage src={profileImage} alt="Profile" />
                  )}
                  <AvatarFallback className="bg-[#EAF5F2] text-[#1D453F]">
                    <UserRound size={36} />
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="child-profile-upload"
                  className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1D453F] text-white shadow-lg transition-all hover:bg-[#173A35] hover:scale-105"
                >
                  {imageUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Camera size={14} />
                  )}
                  <input
                    id="child-profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={imageUploading || saving}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const uploadedUrl = await uploadFile(file);
                      if (uploadedUrl) {
                        setProfileImage(uploadedUrl);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-[#7B8E92]">
                {imageUploading ? "Uploading..." : "Tap to upload photo"}
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="child-fullname"
                className="text-sm font-medium text-[#344C50]"
              >
                Full Name
              </label>
              <Input
                id="child-fullname"
                placeholder="Enter full name"
                {...register("fullname")}
              />
              {errors.fullname && (
                <p className="text-sm text-red-500">{errors.fullname.message}</p>
              )}
            </div>

            {/* Age & Gender */}
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label
                  htmlFor="child-age"
                  className="text-sm font-medium text-[#344C50]"
                >
                  Age
                </label>
                <Input
                  id="child-age"
                  type="number"
                  min="1"
                  max="150"
                  placeholder="Age"
                  {...register("age")}
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <label
                  htmlFor="child-gender"
                  className="text-sm font-medium text-[#344C50]"
                >
                  Gender
                </label>
                <Select
                  value={selectedGender}
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female" | "other", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="child-gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    {genderOptions.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Relation */}
            <div className="space-y-2">
              <label
                htmlFor="child-relation"
                className="text-sm font-medium text-[#344C50]"
              >
                Relation
              </label>
              <Select
                value={selectedRelation}
                onValueChange={(value) =>
                  setValue("relation", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="child-relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent className="z-[999]">
                  {relationOptions.map((relation) => (
                    <SelectItem key={relation} value={relation.toLowerCase()}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.relation && (
                <p className="text-sm text-red-500">{errors.relation.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-3 border-t border-[#E6EEEC] pt-5 justify-end mb-10 sm:mb-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving || imageUploading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || imageUploading || loadingUser}
                className="gap-2 bg-[#1D453F] hover:bg-[#173A35] flex-1"
              >
                {(saving || loadingUser) ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {saving ? (editingUser ? "Updating..." : "Adding...") : "Loading..."}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingUser ? "Update Member" : "Add Member"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChildUserFormModal;
