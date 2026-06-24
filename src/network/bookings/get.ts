import { apiCall } from "../api";
import { MyBookingsResponseI } from "./types";

export interface FetchMyBookingsParams {
  page?: number;
  limit?: number;
}

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

export const fetchMyBookingsAPI = async ({
  page = 1,
  limit = 10,
}: FetchMyBookingsParams = {}): Promise<MyBookingsResponseI> => {
  return await apiCall("bookings/my-bookings", "GET", {
    query: {
      page,
      limit,
    },
    headers: getAuthHeaders(),
  });
};

export interface FetchTemp1MyBookingsParams extends FetchMyBookingsParams {
  hospitalId: string;
}

export const fetchTemp1MyBookingsAPI = async ({
  page = 1,
  limit = 10,
  hospitalId,
}: FetchTemp1MyBookingsParams): Promise<MyBookingsResponseI> => {
  return await apiCall("bookings/my-bookings", "GET", {
    query: {
      page,
      limit,
    },
    headers: {
      ...getAuthHeaders(),
      "HOSPITAL-ID": hospitalId,
    },
  });
};
