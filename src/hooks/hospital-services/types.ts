import { HospitalServiceI } from "@/network/hospital-services/types";

export interface UseHospitalServicesListingReturnI {
    services: HospitalServiceI[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;

    loadMore: () => void;
    refresh: () => void;

    filterByHospital: (
        hospitalId: string
    ) => void;
}

export interface UseHospitalServicesListingOptionsI {
    initialLimit?: number;
    autoFetch?: boolean;
}