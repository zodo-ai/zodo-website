"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { showToast } from "@/lib/toast";
import useCreateHospital from "@/hooks/hospitals/use-create-hook";
import { HospitalFormInputs } from "@/types/onboard";

// Form sections
import HospitalInfoSection from "@/components/onboard/HospitalInfoSection";
import AdminDetailsSection from "@/components/onboard/AdminDetailsSection";
import FastTagSection from "@/components/onboard/FastTagSection";
import AddressSection from "@/components/onboard/AddressSection";
import BankDetailsSection from "@/components/onboard/BankDetailsSection";
import BillingAddressSection from "@/components/onboard/BillingAddressSection";
import DocumentsUpload from "@/components/onboard/DocumentsUpload";
import { useState } from "react";
interface FileDetailsI {
  url: string;
  filename: string;
  key: string;
}
const Onboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<HospitalFormInputs>();

  const { createHospital, loading: isSubmitting } = useCreateHospital();
  const accountNumber = watch("accountnumber");
  // const fastTagEnabled = watch("fastTagEnabled");
  const [document1, setDocument1] = useState<FileDetailsI>();
  const [document2, setDocument2] = useState<FileDetailsI>();
  const onSubmit = async (data: HospitalFormInputs) => {
    if (data.accountnumber !== data.verifyAccountnumber) {
      showToast({
        type: "error",
        message: "Account numbers do not match",
      });
      return;
    }

    // Additional FastTag validation
    if (data.fastTagEnabled) {
      if (!data.fasttagCount || parseInt(data.fasttagCount) < 1) {
        showToast({
          type: "error",
          message: "FastTag count is required and must be at least 1",
        });
        return;
      }
      if (!data.fasttagPrice || parseFloat(data.fasttagPrice) <= 0) {
        showToast({
          type: "error",
          message: "FastTag price is required and must be greater than 0",
        });
        return;
      }
    }

    if (!document1?.key || !document2?.key) {
      showToast({
        type: "error",
        message: "Please upload required documents",
      });
    }
    const file1Details = {
      name: document1?.filename,
      file: document1?.key,
    };
    const file2Details = {
      name: document2?.filename,
      file: document2?.key,
    };

    const documents = [file1Details, file2Details];

    const hospital = {
      name: data.hospitalname,
      logo: "",
      location: data.town,
      address: {
        lineOne: data.hospitalname,
        lineTwo: data.address,
        city: data.town,
        district: data.district,
        state: data.state,
        pincode: data.pincode,
        street: data.location,
      },
      billing_address: {
        lineOne: data.billingAccountHolder,
        lineTwo: data.billingAddress,
        city: data.billingTown,
        district: data.billingDistrict,
        state: data.billingState,
        pincode: data.billingPincode,
        street: data.billingLocation,
      },
      admin: {
        name: data.adminName,
        email: data.adminEmail,
        password: data.adminPassword,
      },
      fastTag: {
        enabled: data.fastTagEnabled,
        count: data.fastTagEnabled ? parseInt(data.fasttagCount) || 0 : 0,
        price: data.fastTagEnabled ? parseFloat(data.fasttagPrice) || 0 : 0,
      },
      bank_details: {
        account_number: data.accountnumber,
        account_holder: data.accountHoldername,
        ifsc: data.ifsc,
        bank_name: data.bankName,
        upi_id: data.upiId,
      },
      contact_details: {
        email: data.email,
        mobile: data.phone,
        website: data.website || "",
      },
      gst: data.gstNumber || "",
      documents: documents,
      status: "active",
      from_web: true,
    };

    const success = await createHospital(hospital);

    if (success) {
      reset();
    }
  };

  const handleDocument1 = (data: object) => {
    setDocument1(data);
  };

  const handleDocument2 = (data: object) => {
    setDocument2(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hospital Onboarding
          </h1>
          <p className="text-gray-600">
            Please fill in all the required information to register your
            hospital
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <HospitalInfoSection register={register} errors={errors} />
          <AdminDetailsSection register={register} errors={errors} />
          <FastTagSection
            register={register}
            errors={errors}
            control={control}
          />
          <AddressSection register={register} errors={errors} />
          <BankDetailsSection
            register={register}
            errors={errors}
            accountNumber={accountNumber}
          />
          <BillingAddressSection register={register} errors={errors} />
          <DocumentsUpload
            document1={document1}
            handleDocument1={handleDocument1}
            document2={document2}
            handleDocument2={handleDocument2}
          />

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-12 py-3"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboard;
