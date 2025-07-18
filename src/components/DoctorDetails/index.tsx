import React, { useState } from "react";
import InfoCardPair from "../InfoCardPair";
import HospitalOne from "~/png/HospitalOne.png";
import { DoctorI } from "@/network/doctors/types";
import { calculateExperience } from "@/helpers/calculateExperience";

interface DoctorDetailsProps {
  doctor?: DoctorI | null;
  loading?: boolean;
}

const DoctorDetails = ({ doctor, loading }: DoctorDetailsProps) => {
    const tabs = ["Morning", "Afternoon", "Evening"];
    const [activeTab, setActiveTab] = useState("Morning");
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
      </div>
    );
  }

  console.log("Doctor ", doctor);
  const rating = doctor?.avg_rating || 0;
  const specialisation = doctor?.specialisations
    ? doctor?.specialisations[0].name
    : "";

  const experience = doctor?.work_start_date
    ? calculateExperience(doctor?.work_start_date)
    : "";
  return (
    <div className="">
      <InfoCardPair
        leftCard={{
          imageSrc:
            doctor?.profile_pic && doctor.profile_pic.trim() !== ""
              ? doctor.profile_pic
              : HospitalOne,
          title: doctor?.name || "",
          subtitle: specialisation, // Could be enhanced with specialty field if available
          rating: { value: rating, count: 623 }, // Default values since not in API
          location: doctor?.city ? `${doctor?.city} • ${experience} of experience` : "",
          phone: doctor?.phone_number || "",
          tag: doctor?.hospital_id ? "Hospital Doctor" : "Independent Practice",
        }}
        rightCard={{
          heading: "About Me",
          description:
            doctor?.about ||
            `${
              doctor?.name
            } is a dedicated medical professional providing quality healthcare services. ${
              doctor?.city ? `Based in ${doctor?.city}, ` : ""
            }committed to patient care and medical excellence.`,
        }}
      />

      <div className="grid grid-cols-[3fr_2fr] gap-4 rounded-2xl">
        <div className="space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA]">
          <h3 className="text-[#03182C] font-semibold text-xl ">
            Time Slot Available
          </h3>
          <div className="rounded-xl h-64">
            <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`relative px-4 py-2 text-sm sm:text-base transition-all duration-300 ${
              activeTab === tab
                ? "text-teal-700 font-medium border-b-2 border-teal-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 text-sm sm:text-base text-gray-700">
        {activeTab === "Morning" && <div>Morning content here</div>}
        {activeTab === "Afternoon" && <div>Afternoon content here</div>}
        {activeTab === "Evening" && <div>Evening content here</div>}
      </div>
    </div>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA]">
          <h3 className="text-[#03182C] font-semibold text-xl">Reviews</h3>
          <div className="bg-[#EAF7FF] rounded-xl  h-64"></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
