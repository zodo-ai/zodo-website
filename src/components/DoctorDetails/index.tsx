import React, { useEffect, useState } from "react";
import InfoCardPair from "../InfoCardPair";
import HospitalOne from "~/png/HospitalOne.png";
import { DoctorI, TimeSlotI } from "@/network/doctors/types";
import { calculateExperience } from "@/helpers/calculateExperience";
import useDoctorTimeslot from "@/hooks/doctors/use-timeslot-hook";
import { useParams } from "next/navigation";
import { categorizeSlots } from "@/helpers/categoriesTimeSlots";
import TimeSlots from "./Timeslots";

interface DoctorDetailsProps {
  doctor?: DoctorI | null;
  loading?: boolean;
  timeSlots?: TimeSlotI | null;
}
interface TabItem {
  id: string;
  title: string;
  component: React.ReactNode; // Or React.ReactNode if it can be more flexible
}

const DoctorDetails = ({ doctor, loading, timeSlots }: DoctorDetailsProps) => {
  const { morning, evening, afternoon } = categorizeSlots(
    timeSlots?.data || []
  );
  console.log("Evening", evening);

  const tabs = [
    {
      id: "1",
      title: "Morning",
      component: <TimeSlots timeSlots={morning} />,
    },
    {
      id: "2",
      title: "Afternoon",
      component: <TimeSlots timeSlots={afternoon} />,
    },
    {
      id: "3",
      title: "Evening",
      component: <TimeSlots timeSlots={evening} />,
    },
  ];
  console.log(morning, evening, afternoon);
  const [activeTab, setActiveTab] = useState<TabItem>();
  useEffect(() => {

        setActiveTab(tabs[0])
    }, [timeSlots])


  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
      </div>
    );
  }
  const params = useParams();
  const doctorSlug = params.slug as string;
  console.log("Slug ", doctorSlug);

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
          location: doctor?.city
            ? `${doctor?.city} • ${experience} of experience`
            : "",
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

      <div className="grid md:grid-cols-[3fr_2fr] gap-4 rounded-2xl md:w-7xl md:mx-0 mx-4">
        <div className="space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA] min-h-[450px] md:min-h-[400px]">
          <h3 className="text-[#03182C] font-semibold text-xl ">
            Time Slot Available
          </h3>
          <div className="rounded-xl h-64">
            <div className="w-full">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-4 py-2 text-sm sm:text-base transition-all duration-300 ${
                      activeTab?.id === tab.id
                        ? "text-teal-700 font-medium border-b-2 border-teal-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm sm:text-base text-gray-700">
                {activeTab?.component}
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
