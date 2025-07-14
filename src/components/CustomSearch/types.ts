import { DistrictI } from "@/network/districts/types";

export type LocationOption = string | DistrictI;

export type CustomSearchPropsI = {
  locations: LocationOption[];
  placeholder?: string;
  onLocationChange?: (location: string, districtId?: string | null) => void;
  onSearchChange?: (query: string) => void;
  useDistricts?: boolean;
};