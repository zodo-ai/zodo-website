import { apiCall } from "../api";
import { DoctorsDataI, DoctorI, TimeSlotI, ReviewsDataI } from "./types";

export interface FetchDoctorsParams {
  page?: number;
  limit?: number;
  name?: string;
  district_id?: string | null;
  hospital_id?: string;
}

export interface FetchReviewParams {
  page?: number;
  limit?: number;
  doctor_id?: string;
}

export const fetchDoctorsAPI = async (
  params: FetchDoctorsParams = {}
): Promise<DoctorsDataI> => {
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

  return await apiCall("doctors/open", "GET", {
    query,
  });
};

export const fetchDoctorDetailAPI = async (
  doctorId: string
): Promise<DoctorI> => {
  const url = `doctors/slug/${encodeURIComponent(doctorId)}`;
  return await apiCall(url, "GET");
};

export const fetchDoctorTimeslotsAPI = async (
  doctorId: string
): Promise<TimeSlotI> => {
  const url = `time-slots/doctors/${encodeURIComponent(doctorId)}`;
  return await apiCall(url, "GET");
};

export const fetchReviewsAPI = async (
  params: FetchReviewParams = {}
): Promise<ReviewsDataI> => {
  const { page = 1, limit = 10, doctor_id } = params;

  const query: Record<string, string | number> = {
    page,
    limit,
  };
  if (doctor_id && doctor_id !== "null") {
    query.doctor_id = doctor_id;
  }
  return await apiCall("reviews", "GET", {
    query,
  });
};
