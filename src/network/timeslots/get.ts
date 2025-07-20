import { apiCall } from "../api";
import { TimeSlotsResponseI, FetchTimeSlotsParams } from "./types";

export const fetchTimeSlotsAPI = async (params: FetchTimeSlotsParams): Promise<TimeSlotsResponseI> => {
    const { doctorId, hospitalId, appointmentDate } = params;
    
    const query: Record<string, string> = {
        appointmentDate
    };
    
    if (doctorId) {
        query.doctorId = doctorId;
    }
    
    if (hospitalId) {
        query.hospitalId = hospitalId;
    }
    
    return await apiCall("timeslots", "GET", {
        query
    });
};
