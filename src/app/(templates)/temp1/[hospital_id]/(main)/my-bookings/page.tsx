"use client";

import { useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import useTemp1MyBookings from "@/hooks/bookings/use-temp1-hook";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  const visiblePages = 5;
  const halfRange = Math.floor(visiblePages / 2);
  let start = Math.max(1, currentPage - halfRange);
  const end = Math.min(totalPages, start + visiblePages - 1);

  start = Math.max(1, end - visiblePages + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export default function MyBookingsPage({ params }: { params: Promise<{ hospital_id: string }> }) {
  const resolvedParams = use(params);
  const hospital_id = resolvedParams.hospital_id;
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const {
    bookings,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setPage,
    refresh,
  } = useTemp1MyBookings({
    limit: 10,
    autoFetch: isAuthenticated,
    hospitalId: hospital_id,
  });

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isHydrated, router]);

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }

    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" asChild className="w-fit gap-2">
            <Link href={`/temp1/${hospital_id}/profile`}>
              <ArrowLeft size={18} />
              Back to Profile
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-fit gap-2 border-[color-mix(in_srgb,var(--primary-color)_30%,white)] text-[var(--primary-color)]"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        <Card className="rounded-lg border-[color-mix(in_srgb,var(--primary-color)_15%,white)] shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">
                <CalendarDays size={22} />
                My Bookings
              </CardTitle>
              <p className="mt-2 text-sm text-gray-500">
                {totalItems > 0
                  ? `${totalItems} appointment${totalItems === 1 ? "" : "s"} found`
                  : "Your appointment history will appear here."}
              </p>
            </div>
            {totalPages > 1 && (
              <p className="text-sm font-medium text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-100 bg-red-50 p-8 text-center">
                <p className="font-semibold text-red-700">
                  Could not load bookings
                </p>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <Button
                  className="mt-5 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                  onClick={refresh}
                >
                  Try Again
                </Button>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[color-mix(in_srgb,var(--primary-color)_25%,white)] bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] p-10 text-center">
                <p className="font-semibold text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">No bookings yet</p>
                <p className="mt-2 text-sm text-gray-500">
                  Book a doctor consultation and it will show up here.
                </p>
                <Button
                  asChild
                  className="mt-5 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                >
                  <Link href={`/temp1/${hospital_id}/our-doctors`}>Find Doctors</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && !error && totalPages > 1 && (
          <nav className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              className="gap-2 border-[color-mix(in_srgb,var(--primary-color)_30%,white)] text-[var(--primary-color)]"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className={
                  page === currentPage
                    ? "hover:opacity-90"
                    : "border-[color-mix(in_srgb,var(--primary-color)_30%,white)] text-[var(--primary-color)]"
                }
                style={page === currentPage ? { backgroundColor: "var(--primary-color)", color: "white" } : {}}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              className="gap-2 border-[color-mix(in_srgb,var(--primary-color)_30%,white)] text-[var(--primary-color)]"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </nav>
        )}
      </div>
    </main>
  );
}
