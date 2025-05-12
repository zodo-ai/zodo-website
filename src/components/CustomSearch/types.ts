export type CustomSearchPropsI = {
  locations: string[];
  onLocationChange?: (location: string) => void;
  onSearchChange?: (query: string) => void;
};