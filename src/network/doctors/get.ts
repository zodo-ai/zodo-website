import { apiCall } from "../api";
import { DoctorsDataI } from "./types";

export interface FetchDoctorsParams {
    page?: number;
    limit?: number;
    name?: string;
    city?: string;
    hospital_id?: string;
}

export const fetchDoctorsAPI = async (params: FetchDoctorsParams = {}): Promise<DoctorsDataI> => {
    const { page = 1, limit = 10, name, city, hospital_id } = params;
    
    const query: Record<string, string | number> = {
        page,
        limit,
    };
    
    if (name) {
        query.name = name;
    }
    
    if (city) {
        query.city = city;
    }
    
    if (hospital_id) {
        query.hospital_id = hospital_id;
    }
    
    return await apiCall("doctors", "GET", {
        query
    });
};
