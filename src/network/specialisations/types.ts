import { SpecialisationI } from "../doctors/types";

export interface SpecialisationsResponseI {
  data?: SpecialisationI[];
  meta?: {
    itemsPerPage?: number;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    sortBy?: string[][];
  };
  links?: {
    current?: string;
  };
}

export type SpecialisationsDataI = SpecialisationI[] | SpecialisationsResponseI;
