import { DoctorI, ReviewI } from "@/network/doctors/types";

export interface UseDoctorListingReturnI {
    doctors: DoctorI[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    loadMore: () => void;
    refresh: () => void;
    search: (query: string) => void;
    filterByCity: (districtId: string | null) => void;
    filterByHospital: (hospitalId: string) => void;
    clearFilters: () => void;
}

export interface UseReviewListingReturnI {
    reviews: ReviewI[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    // hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    // loadMore: () => void;
    // refresh: () => void;
    // search: (query: string) => void;
    // filterByCity: (districtId: string | null) => void;
    // filterByHospital: (hospitalId: string) => void;
    // clearFilters: () => void;
}

export interface UseDoctorListingOptionsI {
    initialLimit?: number;
    autoFetch?: boolean;
}

export interface UseReviewListingOptionsI {
    initialLimit?: number;
    autoFetch?: boolean;
    doctorSlug?: string;
}