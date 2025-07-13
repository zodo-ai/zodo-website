import { apiCall } from "../api"
import { HospitalDataI } from "./types";

export interface FetchHospitalsParams {
    page?: number;
    limit?: number;
    name?: string;
    location?: string;
    district_id?: string;
}

export const fetchHospitalsAPI = async (params: FetchHospitalsParams = {}): Promise<HospitalDataI> => {
    const { page = 1, limit = 10, name, location, district_id } = params;

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

    if (district_id) {
        query.district_id = district_id;
    }

    return await apiCall("hospitals", "GET", {
        query
    });
}