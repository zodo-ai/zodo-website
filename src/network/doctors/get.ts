import { apiCall } from "../api";
import { DoctorsDataI } from "./types";

export interface FetchDoctorsParams {
    page?: number;
    limit?: number;
    name?: string;
    district_id?: string | null;
    hospital_id?: string;
}

export const fetchDoctorsAPI = async (params: FetchDoctorsParams = {}): Promise<DoctorsDataI> => {
    const { page = 1, limit = 10, name, district_id, hospital_id } = params;
    
    const query: Record<string, string | number> = {
        page,
        limit,
    };
    
    if (name) {
        query.name = name;
    }
    if (district_id && district_id !== "null") {
        query.district_id = district_id;
    }
    
    if (hospital_id) {
        query.hospital_id = hospital_id;
    }

    return await apiCall("doctors", "GET", {
        query
    });
};
