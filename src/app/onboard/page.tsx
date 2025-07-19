"use client";
import HeroTitle from "@/components/Banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  hospitalFormSchema,
  HospitalFormType,
} from "@/components/HospitalForm/types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { showToast } from "@/lib/toast";
type DoctorFormInputs = {
  name: string;
  email: string;
  phone: string;
  website: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  gstNumber: string;
  fasttagCount: string;
  fasttagPrice: string;
  specialization: string;
  experience: number;
  hospitalName: string;
  location: string;
  address: string;
  town: string;
  district: string;
  pincode: string;
  accountnumber: string;
  verifyAccountnumber: string;
  accountHoldername: string;
  bankName: string;
  ifsc: string;
  upiId: string;
  billingAccountHolder: string;
  billingLocation: string;
  billingAddress: string;
  billingTown: string;
  billingDistrict: string;
  billingState: string;
  billingPincode: string;
  state: string;
};

const Onboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormInputs>();

  const onSubmit = async (data: DoctorFormInputs) => {
    console.log("Form Submitted:", data.state);
    const hospital = {
      name: data?.name,
      logo: "",
      location: data?.town,
      address: {
        lineOne: data?.name,
        lineTwo: data?.address,
        city: data?.town,
        district: data?.district,
        state: data?.state,
        pincode: data?.pincode,
        street: data?.location,
      },
      billing_address: {
        lineOne: data?.billingAccountHolder,
        lineTwo: data?.billingAddress,
        city: data?.billingTown,
        district: data?.billingDistrict,
        state: data?.billingState,
        pincode: data?.billingPincode,
        street: data?.billingLocation,
      },
      admin: {
        name: data?.adminName,
        email: data?.adminEmail,
        password: data?.adminPassword,
      },
      fastTag: {
        enabled: true,
        count: parseInt(data?.fasttagCount),
        price: parseInt(data?.fasttagPrice),
      },
      bank_details: {
        account_number: data?.accountnumber,
        account_holder: data?.accountHoldername,
        ifsc: data?.ifsc,
        bank_name: data?.bankName,
        upi_id: data?.upiId,
      },
      contact_details: {
        email: data?.email,
        mobile: data?.phone,
        website: data?.website,
      },
      gst: data?.gstNumber,
      documents: [],
      status: "active",
      from_web: false,
    };
    try {
      const APIURL = "https://api.zodoai.com/api/hospitals";
      const response = await axios.post(APIURL, hospital);
      console.log(response);

      const message =
        (response?.data?.statusCode === 201 && response?.data?.message) ||
        "Hospital created successfully";
      showToast({
        type: "success",
        message,
      });
    } catch (error) {
      const message = "Unable to create hospital";
      showToast({
        type: "error",
        message,
      });
    }
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2 MB.");
      setPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* <div className="flex items-start space-x-6">
        <div className="w-24 h-24 rounded-md bg-gray-200 text-center flex items-center justify-center text-sm text-muted-foreground overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="object-cover w-full h-full"
            />
          ) : (
            "Preview"
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Please upload square image.
            <br />
            Size less than 2 MB
          </p>

          <div>
            <label htmlFor="file-upload">
              <Button variant="outline" type="button" asChild>
                <span>Choose file</span>
              </Button>
            </label>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md md:p-10 p-4 md:px-16 "
      >
        <div className="flex flex-wrap gap-6">
          {/* Doctor Name */}
          <div className="flex flex-col space-y-1.5 md:w-4/12 w-full">
            <label htmlFor="name">Hospital Name *</label>
            <Input
              id="name"
              placeholder="Hospital"
              {...register("name", { required: "Hospital name is required" })}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col space-y-1.5 md:w-4/12 w-full">
            <label htmlFor="email">Contact Email *</label>
            <Input
              id="email"
              type="email"
              placeholder="example@hospital.com"
              {...register("email", { required: "Contact email is required" })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="email">Contact Number *</label>
            <Input
              id="phone"
              type="text"
              placeholder="+91"
              {...register("phone", { required: "Contact number is required" })}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="email">Admin Name *</label>
            <Input
              id="adminName"
              type="text"
              placeholder="Admin Name"
              {...register("adminName", { required: "Admin name is required" })}
            />
            {errors.adminName && (
              <span className="text-sm text-red-500">
                {errors.adminName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="email">Admin Email *</label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="Admin Email"
              {...register("adminEmail", {
                required: "Admin email is required",
              })}
            />
            {errors.adminEmail && (
              <span className="text-sm text-red-500">
                {errors.adminEmail.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="email">Password *</label>
            <Input
              id="password"
              type="password"
              placeholder=""
              {...register("adminPassword", {
                required: "Admin password is required",
              })}
            />
            {errors.adminPassword && (
              <span className="text-sm text-red-500">
                {errors.adminPassword.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1.5 md:w-2/12 w-full">
            <label htmlFor="email">GST Number</label>
            <Input
              id="gst"
              type="text"
              placeholder="GST"
              // {...register('email', { required: 'Email is required' })}
            />
            {/* {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )} */}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-5/12 w-full">
            <label htmlFor="email">Website</label>
            <Input
              id="website"
              type="text"
              placeholder="Website"
              // {...register('website', { required: 'Email is required' })}
            />
            {/* {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )} */}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex flex-col space-y-1.5 md:w-2/12 w-full">
            <label htmlFor="specialization">Fasttag Count</label>
            <Input
              id="fasttagCOunt"
              placeholder="Count"
              {...register("fasttagCount", {
                required: "Fasttag count is required",
              })}
            />
            {errors.fasttagCount && (
              <span className="text-sm text-red-500">
                {errors.fasttagCount.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-2/12 w-full">
            <label htmlFor="specialization">Fasttag Price</label>
            <Input
              id="fasttagCOunt"
              placeholder="Count"
              {...register("fasttagPrice", {
                required: "Fasttag price is required",
              })}
            />
            {errors.fasttagPrice && (
              <span className="text-sm text-red-500">
                {errors.fasttagPrice.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          {/* Location */}
          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="location">Location *</label>
            <Input
              id="location"
              placeholder="Location"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <span className="text-sm text-red-500">
                {errors.location.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-4/12 w-full">
            <label htmlFor="location">Address *</label>
            <Input
              id="location"
              placeholder="Location"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <span className="text-sm text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Town */}
          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="town">Town *</label>
            <Input
              id="town"
              placeholder="Town"
              {...register("town", { required: "Town is required" })}
            />
            {errors.town && (
              <span className="text-sm text-red-500">
                {errors.town.message}
              </span>
            )}
          </div>

          {/* District */}
          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="district">District *</label>
            <Input
              id="district"
              placeholder="District"
              {...register("district", { required: "District is required" })}
            />
            {errors.district && (
              <span className="text-sm text-red-500">
                {errors.district.message}
              </span>
            )}
          </div>

          {/* State */}
          <div className="flex flex-col space-y-1.5 md:w-2/12 w-full">
            <label htmlFor="state">State *</label>
            <Input
              id="state"
              placeholder="State"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <span className="text-sm text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          {/* Pincode */}
          <div className="flex flex-col space-y-1.5 md:w-2/12 w-full">
            <label htmlFor="pincode">Pincode *</label>
            <Input
              id="pincode"
              placeholder="Pincode"
              {...register("pincode", { required: "Pincode is required" })}
            />
            {errors.pincode && (
              <span className="text-sm text-red-500">
                {errors.pincode.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-6">
          {/* Account Number */}
          <div className="flex flex-col space-y-1.5 md:w-4/12 w-full">
            <label htmlFor="accountnumber">Account Number *</label>
            <Input
              id="accountnumber"
              placeholder="Account Number"
              {...register("accountnumber", {
                required: "Account number is required",
              })}
            />
            {errors.accountnumber && (
              <span className="text-sm text-red-500">
                {errors.accountnumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5 md:w-4/12 w-full">
            <label htmlFor="verifyAccountnumber">Verify Account Number *</label>
            <Input
              id="verifyAccountnumber"
              placeholder="Verify account number"
              {...register("verifyAccountnumber", {
                required: "Verify account number is required",
              })}
            />
            {errors.verifyAccountnumber && (
              <span className="text-sm text-red-500">
                {errors.verifyAccountnumber.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-6">
          {/* Account Holder Name */}
          <div className="flex flex-col space-y-1.5  md:w-4/12 w-full">
            <label htmlFor="accountHoldername">Account Holder Name *</label>
            <Input
              id="accountHoldername"
              placeholder="Account Holder Name"
              {...register("accountHoldername", {
                required: "Account holder name is required",
              })}
            />
            {errors.accountHoldername && (
              <span className="text-sm text-red-500">
                {errors.accountHoldername.message}
              </span>
            )}
          </div>

          {/* Bank Name */}
          <div className="flex flex-col space-y-1.5  md:w-3/12 w-full">
            <label htmlFor="bankName">Bank Name *</label>
            <Input
              id="bankName"
              placeholder="Bank Name"
              {...register("bankName", { required: "Bank name is required" })}
            />
            {errors.bankName && (
              <span className="text-sm text-red-500">
                {errors.bankName.message}
              </span>
            )}
          </div>

          {/* IFSC */}
          <div className="flex flex-col space-y-1.5  md:w-2/12 w-full">
            <label htmlFor="ifsc">IFSC *</label>
            <Input
              id="ifsc"
              placeholder="IFSC"
              {...register("ifsc", { required: "IFSC is required" })}
            />
            {errors.ifsc && (
              <span className="text-sm text-red-500">
                {errors.ifsc.message}
              </span>
            )}
          </div>

          {/* UPI ID */}
          <div className="flex flex-col space-y-1.5  md:w-2/12 w-full">
            <label htmlFor="upiId">UPI ID *</label>
            <Input
              id="upiId"
              placeholder="UPI ID"
              {...register("upiId", { required: "UPI ID is required" })}
            />
            {errors.upiId && (
              <span className="text-sm text-red-500">
                {errors.upiId.message}
              </span>
            )}
          </div>

          {/* Billing Account Holder Name */}
          <div className="flex flex-col space-y-1.5 md:w-3/12 w-full">
            <label htmlFor="billingAccountHolder">
              Billing Account Holder Name *
            </label>
            <Input
              id="billingAccountHolder"
              placeholder="Billing Account Holder Name"
              {...register("billingAccountHolder", {
                required: "Billing account holder name is required",
              })}
            />
            {errors.billingAccountHolder && (
              <span className="text-sm text-red-500">
                {errors.billingAccountHolder.message}
              </span>
            )}
          </div>

          {/* Billing Location */}
          <div className="flex flex-col space-y-1.5  md:w-3/12 w-full">
            <label htmlFor="billingLocation">Billing Location *</label>
            <Input
              id="billingLocation"
              placeholder="Billing Location"
              {...register("billingLocation", {
                required: "Billing location is required",
              })}
            />
            {errors.billingLocation && (
              <span className="text-sm text-red-500">
                {errors.billingLocation.message}
              </span>
            )}
          </div>

          {/* Billing Address */}
          <div className="flex flex-col space-y-1.5  md:w-4/12 w-full">
            <label htmlFor="billingAddress">Billing Address *</label>
            <Input
              id="billingAddress"
              placeholder="Billing Address"
              {...register("billingAddress", {
                required: "Billing address is required",
              })}
            />
            {errors.billingAddress && (
              <span className="text-sm text-red-500">
                {errors.billingAddress.message}
              </span>
            )}
          </div>

          {/* Billing Town */}
          <div className="flex flex-col space-y-1.5  md:w-3/12 w-full">
            <label htmlFor="billingTown">Billing Town *</label>
            <Input
              id="billingTown"
              placeholder="Billing Town"
              {...register("billingTown", {
                required: "Billing town is required",
              })}
            />
            {errors.billingTown && (
              <span className="text-sm text-red-500">
                {errors.billingTown.message}
              </span>
            )}
          </div>

          {/* Billing District */}
          <div className="flex flex-col space-y-1.5  md:w-3/12 w-full">
            <label htmlFor="billingDistrict">Billing District *</label>
            <Input
              id="billingDistrict"
              placeholder="Billing District"
              {...register("billingDistrict", {
                required: "Billing district is required",
              })}
            />
            {errors.billingDistrict && (
              <span className="text-sm text-red-500">
                {errors.billingDistrict.message}
              </span>
            )}
          </div>

          {/* Billing State */}
          <div className="flex flex-col space-y-1.5  md:w-3/12 w-full">
            <label htmlFor="billingState">Billing State *</label>
            <Input
              id="billingState"
              placeholder="Billing State"
              {...register("billingState", {
                required: "Billing state is required",
              })}
            />
            {errors.billingState && (
              <span className="text-sm text-red-500">
                {errors.billingState.message}
              </span>
            )}
          </div>

          {/* Billing Pincode */}
          <div className="flex flex-col space-y-1.5  md:w-2/12 w-full">
            <label htmlFor="billingPincode">Billing Pincode *</label>
            <Input
              id="billingPincode"
              placeholder="Billing Pincode"
              {...register("billingPincode", {
                required: "Billing pincode is required",
              })}
            />
            {errors.billingPincode && (
              <span className="text-sm text-red-500">
                {errors.billingPincode.message}
              </span>
            )}
          </div>
        </div>

        {/* Submit button full-width */}
        <div className="md:col-span-2 mt-10 flex justify-center">
          <Button type="submit" className="md:w-2/12 w-4/12">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default Onboard;
