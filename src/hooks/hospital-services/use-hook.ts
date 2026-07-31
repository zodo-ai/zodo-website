import {
    useState,
    useEffect,
    useCallback,
} from "react";

import { showToast } from "@/lib/toast";

import {
    fetchHospitalServicesAPI,
    FetchHospitalServicesParams,
} from "@/network/hospital-services/get";

import {
    HospitalServicesDataI,
    HospitalServiceI,
} from "@/network/hospital-services/types";

import {
    UseHospitalServicesListingOptionsI,
    UseHospitalServicesListingReturnI,
} from "./types";

const useHospitalServicesListing = (
    options: UseHospitalServicesListingOptionsI = {}
): UseHospitalServicesListingReturnI => {

    const {
        initialLimit = 8,
        autoFetch = true,
    } = options;

    const [services, setServices] = useState<
        HospitalServiceI[]
    >([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingMore, setLoadingMore] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(0);

    const [totalItems, setTotalItems] =
        useState(0);

    const [hospitalFilter, setHospitalFilter] =
        useState("");

    const fetchServices = useCallback(
        async (
            params: FetchHospitalServicesParams,
            isLoadMore = false
        ) => {

            try {

                if (isLoadMore) {
                    setLoadingMore(true);
                } else {
                    setLoading(true);
                    setError(null);
                }

                const response:
                    HospitalServicesDataI =
                    await fetchHospitalServicesAPI(
                        params
                    );

                let servicesData:
                    HospitalServiceI[] = [];

                let meta = {
                    currentPage:
                        params.page || 1,
                    totalPages: 1,
                    totalItems: 0,
                };

                if (Array.isArray(response)) {

                    servicesData = response;

                    meta.totalItems =
                        response.length;

                    meta.totalPages =
                        Math.ceil(
                            response.length /
                            (params.limit ||
                                initialLimit)
                        );

                } else if (response.data) {

                    servicesData =
                        response.data;

                    if (response.meta) {

                        meta = {
                            currentPage:
                                response.meta
                                    .currentPage ||
                                params.page ||
                                1,

                            totalPages:
                                response.meta
                                    .totalPages || 1,

                            totalItems:
                                response.meta
                                    .totalItems ||
                                servicesData.length,
                        };
                    }
                }

                if (isLoadMore) {

                    setServices(prev => [
                        ...prev,
                        ...servicesData,
                    ]);

                } else {

                    setServices(
                        servicesData
                    );
                }

                setCurrentPage(
                    meta.currentPage
                );

                setTotalPages(
                    meta.totalPages
                );

                setTotalItems(
                    meta.totalItems
                );

            } catch (err) {

                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch services";

                setError(errorMessage);

                showToast({
                    type: "error",
                    message: errorMessage,
                });

                console.error(err);

            } finally {

                setLoading(false);
                setLoadingMore(false);
            }
        },
        [initialLimit]
    );

    const loadMore = useCallback(() => {

        if (
            loadingMore ||
            currentPage >= totalPages
        ) {
            return;
        }

        const nextPage =
            currentPage + 1;

        fetchServices(
            {
                page: nextPage,
                limit: initialLimit,
                hospital_id:
                    hospitalFilter ||
                    undefined,
            },
            true
        );

    }, [
        loadingMore,
        currentPage,
        totalPages,
        initialLimit,
        hospitalFilter,
        fetchServices,
    ]);

    const refresh = useCallback(() => {

        setCurrentPage(1);

        fetchServices({
            page: 1,
            limit: initialLimit,
            hospital_id:
                hospitalFilter ||
                undefined,
        });

    }, [
        initialLimit,
        hospitalFilter,
        fetchServices,
    ]);

    const filterByHospital = useCallback(
        (hospitalId: string) => {

            setHospitalFilter(
                hospitalId
            );

            setCurrentPage(1);

            fetchServices({
                page: 1,
                limit: initialLimit,
                hospital_id:
                    hospitalId ||
                    undefined,
            });

        },
        [
            initialLimit,
            fetchServices,
        ]
    );

    useEffect(() => {

        if (autoFetch) {

            fetchServices({
                page: 1,
                limit: initialLimit,
            });
        }

    }, [
        autoFetch,
        initialLimit,
        fetchServices,
    ]);

    const hasMore =
        currentPage < totalPages;

    return {
        services,
        loading,
        loadingMore,
        error,
        hasMore,
        currentPage,
        totalPages,
        totalItems,
        loadMore,
        refresh,
        filterByHospital,
    };
};

export default useHospitalServicesListing;