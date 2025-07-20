export interface TimeSlotI {
    id: string;
    time: string;
    isAvailable: boolean;
    doctorId?: string;
    hospitalId?: string;
    date?: string;
}

export interface TimeSlotsResponseI {
    data: TimeSlotI[];
    meta?: {
        total?: number;
        date?: string;
        doctorId?: string;
    };
}

export interface FetchTimeSlotsParams {
    doctorId?: string;
    hospitalId?: string;
    appointmentDate: string; // Required date parameter
}
