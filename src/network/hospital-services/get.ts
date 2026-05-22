import { apiCall } from "../api";

import {
    HospitalServiceDetailResponseI,
    HospitalServiceI,
    HospitalServicesDataI,
} from "./types";

export interface FetchHospitalServicesParams {
    page?: number;
    limit?: number;
    hospital_id?: string;
}

export const fetchHospitalServicesAPI = async (
    params: FetchHospitalServicesParams = {}
): Promise<HospitalServicesDataI> => {

    const {
        page = 1,
        limit = 10,
        hospital_id,
    } = params;

    const query: Record<string, string | number> = {
        page,
        limit,
    };

    if (hospital_id) {
        query.hospital_id = hospital_id;
    }

    return await apiCall(
        "hospital-services/user",
        "GET",
        {
            query,
        }
    );
};

export const fetchHospitalServiceDetailAPI =
  async (
    serviceId: string
  ): Promise<HospitalServiceI> => {

    const response:
      HospitalServiceDetailResponseI =
      await apiCall(
        `hospital-services/${encodeURIComponent(
          serviceId
        )}`,
        "GET"
      );

    return response.data;
};