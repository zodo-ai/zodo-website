import { apiCall } from "../api";
import {
  CreateChildUserPayload,
  CreateChildUserResponse,
  DeleteChildUserResponse,
  FetchChildUsersResponse,
  GetChildUserByIdResponse,
  UpdateChildUserPayload,
  UpdateChildUserResponse,
} from "@/types/child-user";

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

export const fetchChildUsersAPI = async (
  userId: string,
  limit: number = 20
): Promise<FetchChildUsersResponse> => {
  return await apiCall("child-users", "GET", {
    query: {
      user_id: userId,
      limit,
    },
    headers: getAuthHeaders(),
  });
};

export const createChildUserAPI = async (
  userId: string,
  payload: CreateChildUserPayload
): Promise<CreateChildUserResponse> => {
  return await apiCall("child-users", "POST", {
    query: {
      user_id: userId,
    },
    payload,
    headers: getAuthHeaders(),
  });
};

export const updateChildUserAPI = async (
  childUserId: string,
  payload: UpdateChildUserPayload
): Promise<UpdateChildUserResponse> => {
  return await apiCall(`child-users/${encodeURIComponent(childUserId)}`, "PATCH", {
    payload,
    headers: getAuthHeaders(),
  });
};

export const deleteChildUserAPI = async (
  childUserId: string
): Promise<DeleteChildUserResponse> => {
  return await apiCall(`child-users/${encodeURIComponent(childUserId)}`, "DELETE", {
    headers: getAuthHeaders(),
  });
};

export const fetchChildUserByIdAPI = async (
  childUserId: string
): Promise<GetChildUserByIdResponse> => {
  return await apiCall(`child-users/${encodeURIComponent(childUserId)}`, "GET", {
    headers: getAuthHeaders(),
  });
};
