import { useState, useEffect, useCallback } from 'react';
import { fetchHospitalsAPI, FetchHospitalsParams } from '@/network/hospitals/get';
import { HospitalDataI, HospitalsI } from '@/network/hospitals/types';
import { showToast } from '@/lib/toast';
import { UseHospitalListingOptionsI, UseHospitalListingReturnI } from './types';



const useHospitalListing = (options: UseHospitalListingOptionsI = {}): UseHospitalListingReturnI => {
    const { initialLimit = 10, autoFetch = true } = options;
    
    const [hospitals, setHospitals] = useState<HospitalsI[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [locationFilter, setLocationFilter] = useState<string>('');
    const [districtFilter, setDistrictFilter] = useState<string>('');

    const fetchHospitals = useCallback(async (params: FetchHospitalsParams, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            const response: HospitalDataI = await fetchHospitalsAPI(params);
            
            if (isLoadMore) {
                setHospitals(prev => [...prev, ...response.data]);
            } else {
                setHospitals(response.data);
            }
            
            setCurrentPage(response.meta.currentPage);
            setTotalPages(response.meta.totalPages);
            setTotalItems(response.meta.totalItems);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospitals';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching hospitals:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (loadingMore || currentPage >= totalPages) return;
        
        const nextPage = currentPage + 1;
        fetchHospitals({
            page: nextPage,
            limit: initialLimit,
            name: searchQuery || undefined,
            location: locationFilter || undefined,
            district_id: districtFilter || undefined,
        }, true);
    }, [currentPage, totalPages, loadingMore, initialLimit, searchQuery, locationFilter, districtFilter, fetchHospitals]);

    const refresh = useCallback(() => {
        setCurrentPage(1);
        fetchHospitals({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            location: locationFilter || undefined,
            district_id: districtFilter || undefined,
        });
    }, [initialLimit, searchQuery, locationFilter, districtFilter, fetchHospitals]);

    const search = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchHospitals({
            page: 1,
            limit: initialLimit,
            name: query || undefined,
            location: locationFilter || undefined,
            district_id: districtFilter || undefined,
        });
    }, [initialLimit, locationFilter, districtFilter, fetchHospitals]);

    const filterByLocation = useCallback((location: string) => {
        setLocationFilter(location);
        setCurrentPage(1);
        fetchHospitals({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            location: location || undefined,
            district_id: districtFilter || undefined,
        });
    }, [initialLimit, searchQuery, districtFilter, fetchHospitals]);

    const filterByDistrict = useCallback((districtId: string) => {
        setDistrictFilter(districtId);
        setCurrentPage(1);
        fetchHospitals({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            location: locationFilter || undefined,
            district_id: districtId || undefined,
        });
    }, [initialLimit, searchQuery, locationFilter, fetchHospitals]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setLocationFilter('');
        setDistrictFilter('');
        setCurrentPage(1);
        fetchHospitals({
            page: 1,
            limit: initialLimit,
        });
    }, [initialLimit, fetchHospitals]);

    useEffect(() => {
        if (autoFetch) {
            fetchHospitals({
                page: 1,
                limit: initialLimit,
            });
        }
    }, [autoFetch, initialLimit, fetchHospitals]);

    const hasMore = currentPage < totalPages;

    return {
        hospitals,
        loading,
        loadingMore,
        error,
        hasMore,
        currentPage,
        totalPages,
        totalItems,
        loadMore,
        refresh,
        search,
        filterByLocation,
        filterByDistrict,
        clearFilters,
    };
};

export default useHospitalListing;
