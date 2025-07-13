import { apiCall } from "../api";
import { DistrictsResponseI } from "./types";

export const fetchDistrictsAPI = async (): Promise<DistrictsResponseI> => {
    return await apiCall("districts", "GET", {});
};
