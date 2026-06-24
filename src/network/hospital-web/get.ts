import { apiCall } from "../api";
import { HospitalWebFullResponse, HospitalStatsResponse } from "./types";

export const fetchHospitalWebFull = async (
  hospitalId: string
): Promise<HospitalWebFullResponse> => {
  return await apiCall(
    `hospital-web/${encodeURIComponent(hospitalId)}/full`,
    "GET"
  );
};

export const fetchHospitalStats = async (
  hospitalId: string
): Promise<HospitalStatsResponse> => {
  return await apiCall(
    `hospital-web/${encodeURIComponent(hospitalId)}/stats`,
    "GET"
  );
};
