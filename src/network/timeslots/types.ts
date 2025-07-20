export interface TimeSlotI {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlotsResponseI {
    data: TimeSlotI[];
    message: string;
    status: number
}

export interface FetchTimeSlotsParams {
    doctor_id?: string;
    hospitalId?: string;
    date: string; 
}



