import React from "react";
import { Slot, TimeSlotProps } from "./types";
import { formatDisplayTime } from "@/helpers/formatDisplayTime";

const TimeSlots: React.FC<TimeSlotProps> = ({ timeSlots }) => {
  return (
    <div className="md:gap-5 gap-1 flex flex-wrap pt-3">
      {timeSlots.map((item: Slot) => (
        <button
          key={item.startTime}
          disabled={!item.isAvailable}
          className={`
            py-2 w-[100px] text-sm font-semibold border rounded-md relative
            ${item.isAvailable
              ? 'border-transparent hover:border hover:border-green-600 focus:outline-1 focus:outline-offset-1 focus:bg-[#F6F0DD] focus:outline-[#F6F0DD] focus:text-[#CA9A02] focus:hover:border-[#CA9A02] active:bg-[#F6F0DD] active:text-[#CA9A02] active:border-[#CA9A02] cursor-pointer'
              : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            }
            ${!item.isAvailable ? 'line-through' : ''}
          `}
        >
          <span>{formatDisplayTime(item.startTime)}</span>
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;
