import { useCallback, useEffect, useState } from "react";
import { fetchMyBookingsAPI } from "@/network/bookings/get";
import { BookingI, BookingsMetaI } from "@/network/bookings/types";
import { showToast } from "@/lib/toast";

interface UseMyBookingsOptionsI {
  initialPage?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseMyBookingsReturnI {
  bookings: BookingI[];
  loading: boolean;
  error: string | null;
  meta: BookingsMetaI | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  setPage: (page: number) => void;
  refresh: () => void;
}

const useMyBookings = ({
  initialPage = 1,
  limit = 10,
  autoFetch = true,
}: UseMyBookingsOptionsI = {}): UseMyBookingsReturnI => {
  const [bookings, setBookings] = useState<BookingI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BookingsMetaI | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchBookings = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchMyBookingsAPI({
          page,
          limit,
        });

        setBookings(response.data || []);
        setMeta(response.meta || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch bookings";
        setError(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const refresh = useCallback(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  useEffect(() => {
    if (autoFetch) {
      fetchBookings(currentPage);
    }
  }, [autoFetch, currentPage, fetchBookings]);

  return {
    bookings,
    loading,
    error,
    meta,
    currentPage: meta?.currentPage || currentPage,
    totalPages: meta?.totalPages || 1,
    totalItems: meta?.totalItems || bookings.length,
    setPage,
    refresh,
  };
};

export default useMyBookings;
