import { useState } from "react";

import {
  uploadFileAPI,
} from "@/network/files/post";

import { showToast } from "@/lib/toast";

interface UseUploadFileReturn {
  uploadFile: (
    file: File
  ) => Promise<string | null>;

  loading: boolean;

  error: string | null;
}

const MAX_FILE_SIZE =
  2 * 1024 * 1024;

const allowedTypes = [
  "image/",
];

const useUploadFile =
  (): UseUploadFileReturn => {

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<string | null>(null);

    const uploadFile = async (
      file: File
    ): Promise<string | null> => {

      try {

        setLoading(true);

        setError(null);

        // File size validation
        if (
          file.size >
          MAX_FILE_SIZE
        ) {

          throw new Error(
            "File size must be less than 2MB"
          );
        }

        // File type validation
        if (
          !allowedTypes.some(
            (type) =>
              file.type.startsWith(type)
          )
        ) {

          throw new Error(
            "Only image files are allowed"
          );
        }

        const response =
          await uploadFileAPI(file);

        showToast({
          type: "success",
          message:
            "Image uploaded successfully",
        });

        return response.data.url;

      } catch (err) {

        const message =
          err instanceof Error
            ? err.message
            : "Upload failed";

        setError(message);

        showToast({
          type: "error",
          message,
        });

        return null;

      } finally {

        setLoading(false);

      }
    };

    return {
      uploadFile,
      loading,
      error,
    };
  };

export default useUploadFile;