import { apiCall } from "../api";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  const accessToken =
    localStorage.getItem("accessToken");

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {};
};

export interface UploadFileResponse {
  status: boolean;
  message: string;
  data: {
    key: string;
    url: string;
    filename: string;
  };
}

export const uploadFileAPI = async (
  file: File
): Promise<UploadFileResponse> => {

  const formData = new FormData();

  formData.append("file", file);

  return await apiCall(
    "file-upload",
    "POST",
    {
      payload: formData,
      headers: {
        ...getAuthHeaders(),
      },
    }
  );
};