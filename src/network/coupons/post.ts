import { apiCall } from "../api";
import { ValidateCouponPayload, ValidateCouponResponse } from "./types";

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

export const validateCouponAPI = async (
  payload: ValidateCouponPayload
): Promise<ValidateCouponResponse> => {
  return await apiCall("coupons/validate", "POST", {
    payload,
    headers: getAuthHeaders(),
  });
};
