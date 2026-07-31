import { apiCall } from "../api";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  const accessToken = localStorage.getItem("accessToken");

  return accessToken
    ? {
      Authorization: `Bearer ${accessToken}`,
    }
    : {};
};

export interface CreateEnquiryPayload {
  user_id?: string;
  doctor_id?: string;
  hospital_id?: string;
  patient_name: string;
  phone_number: string;
  enquiry_date: string;
  message: string;
}

export interface CreateEnquiryResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const createEnquiryAPI = async (
  payload: CreateEnquiryPayload
): Promise<CreateEnquiryResponse> => {
  return await apiCall("enquiries", "POST", {
    payload,
    headers: getAuthHeaders(),
  });
};
