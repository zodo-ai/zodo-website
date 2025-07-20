export type Slot ={
    startTime: string;
    endTime:string;
    isAvailable:boolean;
}

export type TimeSlotProps = {
  timeSlots: Slot[];
};
