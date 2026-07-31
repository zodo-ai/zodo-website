import { useCallback, useEffect, useState } from "react";
import { fetchTemp1MyBookingsAPI } from "@/network/bookings/get";
import { BookingI, BookingsMetaI } from "@/network/bookings/types";
import { showToast } from "@/lib/toast";

interface UseTemp1MyBookingsOptionsI {
  hospitalId: string;
  initialPage?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseTemp1MyBookingsReturnI {
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

const useTemp1MyBookings = ({
  hospitalId,
  initialPage = 1,
  limit = 10,
  autoFetch = true,
}: UseTemp1MyBookingsOptionsI): UseTemp1MyBookingsReturnI => {
  const [bookings, setBookings] = useState<BookingI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BookingsMetaI | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchBookings = useCallback(
    async (page: number) => {
      if (!hospitalId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetchTemp1MyBookingsAPI({
          page,
          limit,
          hospitalId,
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
    [limit, hospitalId]
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

export default useTemp1MyBookings;
