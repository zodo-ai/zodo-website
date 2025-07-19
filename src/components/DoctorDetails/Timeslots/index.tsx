import React from "react";
import { Slot, TimeSlotProps } from "./types";
import { formatDisplayTime } from "@/helpers/formatDisplayTime";

const TimeSlots: React.FC<TimeSlotProps> = ({ timeSlots }) => {
  console.log("Time slots ", timeSlots);
  return (
    <div className="md:gap-5 gap-1 flex flex-wrap pt-3">
      {timeSlots.map((item: Slot) => (
        <button key={item.startTime} className="py-2 w-[100px] text-sm font-semibold border border-transparent hover:border hover:border-green-600 rounded-md focus:outline-1 focus:outline-offset-1 focus:bg-[#F6F0DD] focus:outline-[#F6F0DD] focus:text-[#CA9A02] focus:hover:border-[#CA9A02] active:bg-[#F6F0DD] active:text-[#CA9A02] active:border-[#CA9A02]">
          <span>{formatDisplayTime(item.startTime)}</span>
          {/* - */}
          {/* <span>{formatDisplayTime(item.endTime)}</span> */}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;
