import { apiCall } from "../api";
import { TimeSlotsResponseI, FetchTimeSlotsParams } from "./types";

export const fetchTimeSlotsAPI = async (params: FetchTimeSlotsParams): Promise<TimeSlotsResponseI> => {
    const { doctor_id, hospitalId, date } = params;

    const query: Record<string, string> = {
        date
    };

    if (doctor_id) {
        query.doctor_id = doctor_id;
    }

    if (hospitalId) {
        query.hospitalId = hospitalId;
    }

    return await apiCall("time-slots/available", "GET", {
        query
    });
};
