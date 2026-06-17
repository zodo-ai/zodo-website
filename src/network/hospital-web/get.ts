import { apiCall } from "../api";
import { HospitalWebFullResponse } from "./types";

export const fetchHospitalWebFull = async (
  hospitalId: string
): Promise<HospitalWebFullResponse> => {
  return await apiCall(
    `hospital-web/${encodeURIComponent(hospitalId)}/full`,
    "GET"
  );
};
