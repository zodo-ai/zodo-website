import { apiCall } from "../api";
import {
  LoginPhonePayload,
  LoginPhoneResponse,
  VerifyOTPPayload,
  VerifyOTPResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  GetUserProfileResponse,
  UserProfile,
} from "@/types/auth";

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

export const loginWithPhoneAPI = async (
  payload: LoginPhonePayload
): Promise<LoginPhoneResponse> => {
  return await apiCall("auth/login/user", "POST", {
    payload,
    headers: {
      "app-type": "user",
    },
  });
};

export const verifyOTPAPI = async (
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> => {
  return await apiCall("auth/verify-otp", "POST", {
    payload,
  });
};

export const updateUserProfileAPI = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<UpdateUserResponse> => {
  const url = `users/${encodeURIComponent(userId)}/update`;
  return await apiCall(url, "PATCH", {
    payload,
    headers: getAuthHeaders(),
  });
};

export const fetchCurrentUserProfileAPI = async (): Promise<UserProfile> => {
  const response = await apiCall<undefined, GetUserProfileResponse>(
    "auth/me",
    "GET",
    {
      headers: getAuthHeaders(),
    }
  );

  const nestedProfile = response.data?.data;

  return (nestedProfile || response.data) as UserProfile;
};
