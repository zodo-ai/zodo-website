import { apiCall } from "../api";
import { SpecialisationsDataI } from "./types";

export interface FetchSpecialisationsParams {
  page?: number;
  limit?: number;
}

export const fetchSpecialisationsAPI = async (
  params: FetchSpecialisationsParams = {}
): Promise<SpecialisationsDataI> => {
  const { page = 1, limit = 100 } = params;

  const query: Record<string, string | number> = {
    page,
    limit,
  };

  return await apiCall("specialisations", "GET", {
    query,
  });
};
