"use client";

import { useMemo, useState, type FormEvent } from "react";
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
} from "lucide-react";
import styles from "./page.module.css";
import { HospitalServiceI } from "@/network/hospital-services/types";

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
    services: HospitalServiceI[];
    hospitalSlug?: string;
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

const CATEGORY_OPTIONS = [
    "All Categories",
    "CT Scan",
    "MRI Scan",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
];

const SORT_OPTIONS = ["Newest First", "Price: Low to High", "Price: High to Low"];

const ITEMS_PER_PAGE = 4;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ServicesListingClient({ services, hospitalSlug }: ServicesListingClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    const filteredServices = useMemo(() => {
        let result = services.filter((service) => {
            const matchesSearch = service.name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
                
            // Using name or description to match category loosely since category isn't in HospitalServiceI
            const serviceText = (service.name + " " + service.description).toLowerCase();
            const matchesCategory =
                category === "All Categories" || serviceText.includes(category.toLowerCase());

            return matchesSearch && matchesCategory;
        });

        if (sortBy === "Price: Low to High") {
            result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === "Price: High to Low") {
            result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        } else {
            // result = [...result].sort((a, b) => b.id - a.id);
        }

        return result;
    }, [services, searchTerm, category, sortBy]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
    );

    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
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
    };

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

                    <div className={styles.heroImage}>
                        <Image
                            src="/images/services/hero.jpg"
                            alt="Doctor preparing a patient for a CT scan"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.heroImageEl}
                        />
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* SEARCH FILTER SECTION */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.filterSection}>
                <form className={styles.filterCard} onSubmit={handleSearchSubmit}>
                    <div className={styles.filterGrid}>
                        <div className={styles.searchField}>
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
                                    setCurrentPage(1);
                                }}
                                className={styles.searchInput}
                                aria-label="Search services"
                            />
                        </div>

                        <select
                            className={styles.selectField}
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Filter by category"
                        >
                            {CATEGORY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className={styles.searchButton}>
                            <Search size={18} strokeWidth={2} aria-hidden="true" />
                            Search
                        </button>
                    </div>
                </form>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* SERVICES GRID */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.servicesSection}>
                <div className={styles.resultsBar}>
                    <p className={styles.resultsCount}>
                        Showing {paginatedServices.length} of {filteredServices.length}{" "}
                        services
                    </p>

                    <label className={styles.sortLabel}>
                        Sort by:
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(event) => {
                                setSortBy(event.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Sort services"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {paginatedServices.length === 0 ? (
                    <p className={styles.emptyState}>
                        No services match your search. Try a different keyword or filter.
                    </p>
                ) : (
                    <div className={styles.servicesGrid}>
                        {paginatedServices.map((service) => {
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
                                        <button
                                            type="button"
                                            className={styles.wishlistButton}
                                            aria-pressed={isWishlisted}
                                            aria-label={
                                                isWishlisted
                                                    ? "Remove from wishlist"
                                                    : "Add to wishlist"
                                            }
                                            onClick={() => toggleWishlist(service.id)}
                                        >
                                            <Heart
                                                size={18}
                                                strokeWidth={2}
                                                fill={isWishlisted ? "#0B8A53" : "none"}
                                                color={isWishlisted ? "#0B8A53" : "#1E2A3B"}
                                            />
                                        </button>
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
                                            <div className={styles.infoBox}>
                                                <MapPin
                                                    size={16}
                                                    strokeWidth={2}
                                                    className={styles.infoIcon}
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    <span className={styles.infoLabel}>
                                                        Hospital Location
                                                    </span>
                                                    <span className={styles.infoValue}>
                                                        View Map
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
