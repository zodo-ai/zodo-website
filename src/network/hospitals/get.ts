import { apiCall } from "../api"
import { HospitalDataI } from "./types";

export interface FetchHospitalsParams {
    page?: number;
    limit?: number;
    name?: string;
    location?: string;
}

export const fetchHospitalsAPI = async (params: FetchHospitalsParams = {}): Promise<HospitalDataI> => {
    const { page = 1, limit = 10, name, location } = params;

    const query: Record<string, string | number> = {
        page,
        pageSize: limit,
    };

    if (name) {
        query.name = name;
    }

    if (location) {
        query.location = location;
    }

    return await apiCall("hospitals", "GET", {
        query
    });
}