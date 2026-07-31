"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    ShieldCheck,
    Cpu,
    CalendarClock,
    Heart,
    ShieldPlus,
    Calendar,
    MapPin,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Phone,
    Loader2,
} from "lucide-react";
import styles from "./page.module.css";
import { HospitalServiceI, HospitalServicesResponseI } from "@/network/hospital-services/types";
import { fetchHospitalServicesAPI } from "@/network/hospital-services/get";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
    id: number;
    icon: typeof ShieldCheck;
    title: string;
    subtitle: string;
}

interface ServicesListingClientProps {
    initialServices: HospitalServiceI[];
    initialMeta?: {
        itemsPerPage?: number;
        totalItems?: number;
        currentPage?: number;
        totalPages?: number;
        sortBy?: string[][];
    };
    hospitalSlug?: string;
    hospitalId?: string;
}

// ---------------------------------------------------------------------------
// Mock Data for UI
// ---------------------------------------------------------------------------

const FEATURES: FeatureItem[] = [
    {
        id: 1,
        icon: ShieldCheck,
        title: "Trusted Hospitals",
        subtitle: "Verified & Secure",
    },
    {
        id: 2,
        icon: Cpu,
        title: "Advanced Technology",
        subtitle: "Latest Equipment",
    },
    {
        id: 3,
        icon: CalendarClock,
        title: "Easy Booking",
        subtitle: "Quick & Convenient",
    },
];

const ITEMS_PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ServicesListingClient({
    initialServices,
    initialMeta,
    hospitalSlug,
    hospitalId,
}: ServicesListingClientProps) {
    // Read URL search params to pre-fill filters
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const hasUrlParams = !!searchParams.get("search");

    // Filter state
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(initialMeta?.currentPage ?? 1);

    // Data state
    const [services, setServices] = useState<HospitalServiceI[]>(initialServices);
    const [totalItems, setTotalItems] = useState(initialMeta?.totalItems ?? initialServices.length);
    const [totalPages, setTotalPages] = useState(initialMeta?.totalPages ?? 1);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    // If URL params are present, we should fetch immediately
    const [isInitial, setIsInitial] = useState(!hasUrlParams);

    const fetchServices = useCallback(async (page: number, search: string) => {
        setLoading(true);
        try {
            const result = await fetchHospitalServicesAPI({
                hospital_id: hospitalId,
                page,
                limit: ITEMS_PER_PAGE,
                search: search || undefined,
            });

            if (Array.isArray(result)) {
                setServices(result);
                setTotalItems(result.length);
                setTotalPages(1);
            } else {
                const response = result as HospitalServicesResponseI;
                setServices(response.data ?? []);
                setTotalItems(response.meta?.totalItems ?? 0);
                setTotalPages(response.meta?.totalPages ?? 1);
            }
        } catch {
            setServices([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    // Trigger fetch on filter or page change
    useEffect(() => {
        if (isInitial) {
            setIsInitial(false);
            return;
        }
        fetchServices(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchServices, isInitial]);

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
        setIsInitial(false);
        fetchServices(1, searchTerm);
    };

    const toggleWishlist = (id: string) => {
        setWishlist((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setIsInitial(false);
    };

    // Compute showing range
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
        <main className={styles.page}>
            {/* ----------------------------------------------------------------- */}
            {/* HERO SECTION */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.heroSection}>
                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <span className={styles.breadcrumbCurrent}>Services</span>
                        </nav>

                        <h1 className={styles.title}>
                            Our <span className={styles.titleAccent}>Medical Services</span>
                        </h1>

                        <p className={styles.description}>
                            Advanced diagnostics and treatments with modern technology for
                            your better health.
                        </p>

                        <ul className={styles.featureList}>
                            {FEATURES.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <li key={feature.id} className={styles.featureItem}>
                                        <span className={styles.featureIcon}>
                                            <Icon size={20} strokeWidth={2} aria-hidden="true" />
                                        </span>
                                        <span className={styles.featureText}>
                                            <span className={styles.featureTitle}>
                                                {feature.title}
                                            </span>
                                            <span className={styles.featureSubtitle}>
                                                {feature.subtitle}
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>


                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* SEARCH FILTER SECTION */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.filterSection}>
                <form className={styles.filterCard} onSubmit={handleSearchSubmit}>
                    <div className={styles.filterGrid} style={{ gridTemplateColumns: '1fr auto' }}>
                        <div className={styles.searchField} style={{ flex: 1 }}>
                            <Search
                                size={18}
                                strokeWidth={2}
                                className={styles.searchFieldIcon}
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                }}
                                className={styles.searchInput}
                                aria-label="Search services"
                            />
                        </div>
                    </div>
                </form>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* SERVICES GRID */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.servicesSection}>
                <div className={styles.resultsBar}>
                    <p className={styles.resultsCount}>
                        {totalItems > 0
                            ? `Showing ${startItem}–${endItem} of ${totalItems} services`
                            : "No services found"}
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
                        <Loader2 size={32} className={styles.spinner} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : services.length === 0 ? (
                    <p className={styles.emptyState}>
                        No services match your search. Try a different keyword or filter.
                    </p>
                ) : (
                    <div className={styles.servicesGrid}>
                        {services.map((service) => {
                            const isWishlisted = wishlist.has(service.id);
                            return (
                                <article key={service.id} className={styles.serviceCard}>
                                    <div className={styles.serviceImageWrap}>
                                        {service.image ? (
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className={styles.serviceImage}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ShieldPlus size={48} color="#0b8a53" opacity={0.5} />
                                            </div>
                                        )}
                                        <span className={styles.serviceBadge}>
                                            <ShieldPlus
                                                size={22}
                                                strokeWidth={2}
                                                color="#0B8A53"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>

                                    <div className={styles.serviceContent}>
                                        <h3 className={styles.serviceTitle}>{service.name}</h3>
                                        <p className={styles.serviceHospital}>
                                            <ShieldPlus
                                                size={14}
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            />
                                            Hospital Service
                                        </p>
                                        <p className={styles.serviceCategory}>
                                            {service.description ? service.description.substring(0, 50) + "..." : "Medical Service"}
                                        </p>

                                        <div className={styles.priceSection}>
                                            <span className={styles.currentPrice}>
                                                ₹{Number(service.price).toLocaleString("en-IN")}
                                            </span>
                                            {service.strike_through_price && (
                                                <span className={styles.oldPrice}>
                                                    ₹{Number(service.strike_through_price).toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoBox}>
                                                <Calendar
                                                    size={16}
                                                    strokeWidth={2}
                                                    className={styles.infoIcon}
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    <span className={styles.infoLabel}>
                                                        Daily Booking
                                                    </span>
                                                    <span className={styles.infoValue}>
                                                        {service.daily_booking_count || 0} Slots
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={hospitalSlug ? `/temp1/${hospitalSlug}/our-services/${service.id}` : `/services/${service.id}`}
                                            className={styles.viewButton}
                                        >
                                            View Details
                                            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* PAGINATION */}
                {/* ------------------------------------------------------------- */}
                {totalPages > 1 && (
                    <nav className={styles.pagination} aria-label="Services pagination">
                        <button
                            type="button"
                            className={styles.paginationArrow}
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ""
                                        }`}
                                    onClick={() => goToPage(page)}
                                    aria-current={page === currentPage ? "page" : undefined}
                                    aria-label={`Page ${page}`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            className={styles.paginationArrow}
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                        </button>
                    </nav>
                )}
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* HELP CTA BANNER */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <div className={styles.ctaIllustration}>
                        <Image
                            src="/images/services/help-icon.png"
                            alt=""
                            width={88}
                            height={88}
                        />
                    </div>

                    <div className={styles.ctaText}>
                        <h2 className={styles.ctaTitle}>
                            Need Help Choosing the Right Service?
                        </h2>
                        <p className={styles.ctaDescription}>
                            Our support team is here to help you find the best service for
                            your health needs.
                        </p>
                    </div>

                    <Link href="/contact" className={styles.ctaButton}>
                        <Phone size={18} strokeWidth={2} aria-hidden="true" />
                        Contact Us
                    </Link>
                </div>
            </section>
        </main>
    );
}
