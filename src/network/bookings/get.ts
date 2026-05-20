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
