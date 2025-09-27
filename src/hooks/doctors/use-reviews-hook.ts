import { useState, useEffect, useCallback } from 'react';
import {  FetchReviewParams, fetchReviewsAPI } from '@/network/doctors/get';
import { ReviewI, ReviewsDataI } from '@/network/doctors/types';
import { showToast } from '@/lib/toast';
import {  UseReviewListingOptionsI, UseReviewListingReturnI } from './types';
// import { doctorFilters } from '@/dummy/filters';

const useReviewListing = (options: UseReviewListingOptionsI = {}): UseReviewListingReturnI => {
    const { initialLimit = 10, autoFetch = true, doctorSlug } = options;
    
    const [reviews, setReviews] = useState<ReviewI[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    // const [searchQuery, setSearchQuery] = useState<string>('');
    // const [districtFilter, setDistrictFilter] = useState<string>('');
    // const [hospitalFilter, setHospitalFilter] = useState<string>('');

    const fetchReviews = useCallback(async (params: FetchReviewParams, isLoadMore = false) => {
        
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            const response: ReviewsDataI = await fetchReviewsAPI(params);
            
            // Handle different response formats
            let reviewData: ReviewI[] = [];
            let meta = {
                currentPage: params.page || 1,
                totalPages: 1,
                totalItems: 0
            };

            if (Array.isArray(response)) {
                // Direct array response
                reviewData = response;
                meta.totalItems = response.length;
                meta.totalPages = Math.ceil(response.length / (params.limit || initialLimit));
            } else if (response.data) {
                // Structured response
                reviewData = response.data;
                if (response.meta) {
                    meta = {
                        currentPage: response.meta.currentPage || params.page || 1,
                        totalPages: response.meta.totalPages || 1,
                        totalItems: response.meta.totalItems || reviewData.length
                    };
                }
            }
            
            if (isLoadMore) {
                setReviews(prev => [...prev, ...reviewData]);
            } else {
                setReviews(reviewData);
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
        fetchReviews({
            page: nextPage,
            limit: initialLimit,
            doctor_id: doctorSlug
        }, true);
    }, [currentPage, totalPages, loadingMore, initialLimit, doctorSlug, fetchReviews]);

    // const refresh = useCallback(() => {
    //     setCurrentPage(1);
    //     fetchReviews({
    //         page: 1,
    //         limit: initialLimit,
    //         // name: searchQuery || undefined,
    //         // district_id: districtFilter || undefined,
    //         // hospital_id: hospitalFilter || undefined,
    //     });
    // }, [initialLimit, searchQuery, districtFilter, hospitalFilter, fetchReviews]);

    // const search = useCallback((query: string) => {
    //     setSearchQuery(query);
    //     setCurrentPage(1);
    //     fetchReviews({
    //         page: 1,
    //         limit: initialLimit,
    //         // name: query || undefined,
    //         // district_id: districtFilter || undefined,
    //         // hospital_id: hospitalFilter || undefined,
    //     });
    // }, [initialLimit, districtFilter, hospitalFilter, fetchReviews]);

    // const filterByCity = useCallback((districtId: string | null) => {
    //     setDistrictFilter(districtId || '');
    //     setCurrentPage(1);
    //     fetchReviews({
    //         page: 1,
    //         limit: initialLimit,
    //         // name: searchQuery || undefined,
    //         // district_id: districtId || undefined,
    //         // hospital_id: hospitalFilter || undefined,
    //     });
    // }, [initialLimit, searchQuery, hospitalFilter, fetchReviews]);

    // const filterByHospital = useCallback((hospitalId: string) => {
    //     setHospitalFilter(hospitalId);
    //     setCurrentPage(1);
    //     fetchReviews({
    //         page: 1,
    //         limit: initialLimit,
    //         // name: searchQuery || undefined,
    //         // district_id: districtFilter || undefined,
    //         // hospital_id: hospitalId || undefined,
    //     });
    // }, [initialLimit, searchQuery, districtFilter, fetchReviews]);

    // const clearFilters = useCallback(() => {
    //     setSearchQuery('');
    //     setDistrictFilter('');
    //     setHospitalFilter('');
    //     setCurrentPage(1);
    //     fetchReviews({
    //         page: 1,
    //         limit: initialLimit,
    //     });
    // }, [initialLimit, fetchReviews]);

    useEffect(() => {
        if (autoFetch) {
            fetchReviews({
                page: 1,
                limit: initialLimit,
                doctor_id:doctorSlug
            });
        }
    }, [autoFetch, initialLimit, fetchReviews, doctorSlug]);

    const hasMore = currentPage < totalPages;

    return {
        reviews,
        loading,
        loadingMore,
        error,
        hasMore,
        currentPage,
        totalPages,
        totalItems,
        loadMore,
    };
};

export default useReviewListing;
