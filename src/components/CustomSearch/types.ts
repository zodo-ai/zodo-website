import { DistrictI } from "@/network/districts/types";

export type LocationOption = string | DistrictI;

export type CustomSearchPropsI = {
  locations: LocationOption[];
  onLocationChange?: (location: string, districtId?: string) => void;
  onSearchChange?: (query: string) => void;
  useDistricts?: boolean; // Flag to determine if using district objects or strings
};