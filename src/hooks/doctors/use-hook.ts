import { useState, useEffect, useCallback } from 'react';
import { fetchDoctorsAPI, FetchDoctorsParams } from '@/network/doctors/get';
import { DoctorsDataI, DoctorI } from '@/network/doctors/types';
import { showToast } from '@/lib/toast';
import { UseDoctorListingOptionsI, UseDoctorListingReturnI } from './types';

const useDoctorListing = (options: UseDoctorListingOptionsI = {}): UseDoctorListingReturnI => {
    const { initialLimit = 10, autoFetch = true } = options;
    
    const [doctors, setDoctors] = useState<DoctorI[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [cityFilter, setCityFilter] = useState<string>('');
    const [hospitalFilter, setHospitalFilter] = useState<string>('');

    const fetchDoctors = useCallback(async (params: FetchDoctorsParams, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            const response: DoctorsDataI = await fetchDoctorsAPI(params);
            
            // Handle different response formats
            let doctorsData: DoctorI[] = [];
            let meta = {
                currentPage: params.page || 1,
                totalPages: 1,
                totalItems: 0
            };

            if (Array.isArray(response)) {
                // Direct array response
                doctorsData = response;
                meta.totalItems = response.length;
                meta.totalPages = Math.ceil(response.length / (params.limit || initialLimit));
            } else if (response.data) {
                // Structured response
                doctorsData = response.data;
                if (response.meta) {
                    meta = {
                        currentPage: response.meta.currentPage || params.page || 1,
                        totalPages: response.meta.totalPages || 1,
                        totalItems: response.meta.totalItems || doctorsData.length
                    };
                }
            }
            
            if (isLoadMore) {
                setDoctors(prev => [...prev, ...doctorsData]);
            } else {
                setDoctors(doctorsData);
            }
            
            setCurrentPage(meta.currentPage);
            setTotalPages(meta.totalPages);
            setTotalItems(meta.totalItems);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctors';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [initialLimit]);

    const loadMore = useCallback(() => {
        if (loadingMore || currentPage >= totalPages) return;
        
        const nextPage = currentPage + 1;
        fetchDoctors({
            page: nextPage,
            limit: initialLimit,
            name: searchQuery || undefined,
            city: cityFilter || undefined,
            hospital_id: hospitalFilter || undefined,
        }, true);
    }, [currentPage, totalPages, loadingMore, initialLimit, searchQuery, cityFilter, hospitalFilter, fetchDoctors]);

    const refresh = useCallback(() => {
        setCurrentPage(1);
        fetchDoctors({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            city: cityFilter || undefined,
            hospital_id: hospitalFilter || undefined,
        });
    }, [initialLimit, searchQuery, cityFilter, hospitalFilter, fetchDoctors]);

    const search = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchDoctors({
            page: 1,
            limit: initialLimit,
            name: query || undefined,
            city: cityFilter || undefined,
            hospital_id: hospitalFilter || undefined,
        });
    }, [initialLimit, cityFilter, hospitalFilter, fetchDoctors]);

    const filterByCity = useCallback((city: string) => {
        setCityFilter(city);
        setCurrentPage(1);
        fetchDoctors({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            city: city || undefined,
            hospital_id: hospitalFilter || undefined,
        });
    }, [initialLimit, searchQuery, hospitalFilter, fetchDoctors]);

    const filterByHospital = useCallback((hospitalId: string) => {
        setHospitalFilter(hospitalId);
        setCurrentPage(1);
        fetchDoctors({
            page: 1,
            limit: initialLimit,
            name: searchQuery || undefined,
            city: cityFilter || undefined,
            hospital_id: hospitalId || undefined,
        });
    }, [initialLimit, searchQuery, cityFilter, fetchDoctors]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setCityFilter('');
        setHospitalFilter('');
        setCurrentPage(1);
        fetchDoctors({
            page: 1,
            limit: initialLimit,
        });
    }, [initialLimit, fetchDoctors]);

    useEffect(() => {
        if (autoFetch) {
            fetchDoctors({
                page: 1,
                limit: initialLimit,
            });
        }
    }, [autoFetch, initialLimit, fetchDoctors]);

    const hasMore = currentPage < totalPages;

    return {
        doctors,
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
        filterByCity,
        filterByHospital,
        clearFilters,
    };
};

export default useDoctorListing;
