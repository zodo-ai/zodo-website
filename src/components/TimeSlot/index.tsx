import React from 'react';
import { TimeSlotI } from '@/network/timeslots/types';
import { Button } from '@/components/ui/button';

interface TimeSlotProps {
    timeSlot: TimeSlotI;
    onSelect?: (timeSlot: TimeSlotI) => void;
    isSelected?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ timeSlot, onSelect, isSelected = false }) => {
    const handleClick = () => {
        if (timeSlot.isAvailable && onSelect) {
            onSelect(timeSlot);
        }
    };

    return (
        <Button
            variant={isSelected ? "default" : "outline"}
            className={`
                relative min-w-[80px] h-10 text-sm
                ${timeSlot.isAvailable 
                    ? 'hover:bg-[#1B7C7B] hover:text-white cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                }
                ${isSelected ? 'bg-[#1B7C7B] text-white' : ''}
                ${!timeSlot.isAvailable ? 'line-through' : ''}
            `}
            onClick={handleClick}
            disabled={!timeSlot.isAvailable}
        >
            {timeSlot.time}
            {!timeSlot.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
                </div>
            )}
        </Button>
    );
};

export default TimeSlot;
