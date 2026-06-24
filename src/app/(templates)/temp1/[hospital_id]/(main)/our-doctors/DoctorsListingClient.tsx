"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Users,
    Building2,
    Clock3,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Phone,
    Calendar,
    Loader2,
} from "lucide-react";
import styles from "./page.module.css";
import { DoctorI, DoctorsResponseI, SpecialisationI } from "@/network/doctors/types";
import { HospitalStatsResponse } from "@/network/hospital-web/types";
import { fetchDoctorsAPI } from "@/network/doctors/get";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatItem {
    id: number;
    icon: typeof Users;
    value: string;
    label: string;
}

interface DoctorsListingClientProps {
    initialDoctors: DoctorI[];
    initialMeta?: {
        itemsPerPage?: number;
        totalItems?: number;
        currentPage?: number;
        totalPages?: number;
        sortBy?: string[][];
    };
    hospitalSlug?: string;
    hospitalId?: string;
    specialisations: SpecialisationI[];
    stats?: HospitalStatsResponse;
}

// ---------------------------------------------------------------------------
// Mock Data for UI (Stats fallback)
// ---------------------------------------------------------------------------

const STATS: StatItem[] = [
    { id: 1, icon: Users, value: "3", label: "Doctors" },
    { id: 2, icon: Building2, value: "4", label: "Departments" },
    { id: 3, icon: Clock3, value: "Online", label: "Appointments" },
];

const EXPERIENCE_OPTIONS = [
    { label: "All Experience", value: 0 },
    { label: "1+ Years", value: 1 },
    { label: "2+ Years", value: 2 },
    { label: "3+ Years", value: 3 },
    { label: "4+ Years", value: 4 },
    { label: "5+ Years", value: 5 },
];

const ITEMS_PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function DoctorsListingClient({
    initialDoctors,
    initialMeta,
    hospitalSlug,
    hospitalId,
    specialisations,
    stats,
}: DoctorsListingClientProps) {
    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialisation, setSelectedSpecialisation] = useState("");
    const [selectedExperience, setSelectedExperience] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialMeta?.currentPage ?? 1);

    // Data state
    const [doctors, setDoctors] = useState<DoctorI[]>(initialDoctors);
    const [totalItems, setTotalItems] = useState(initialMeta?.totalItems ?? initialDoctors.length);
    const [totalPages, setTotalPages] = useState(initialMeta?.totalPages ?? 1);
    const [loading, setLoading] = useState(false);

    // Track whether the user has changed filters (to skip the first fetch since we have SSR data)
    const [isInitial, setIsInitial] = useState(true);

    const displayStats: StatItem[] = stats
        ? [
            { id: 1, icon: Users, value: stats.doctors.toString(), label: "Doctors" },
            { id: 2, icon: Building2, value: stats.departments.toString(), label: "Departments" },
            { id: 3, icon: Clock3, value: stats.services.toString(), label: "Services" },
        ]
        : STATS;

    // Fetch doctors from backend
    const fetchDoctors = useCallback(async (page: number, search: string, specId: string, experience: number) => {
        setLoading(true);
        try {
            const result = await fetchDoctorsAPI({
                hospital_id: hospitalId,
                page,
                limit: ITEMS_PER_PAGE,
                search: search || undefined,
                specialisation_ids: specId || undefined,
                experience: experience > 0 ? experience : undefined,
            });

            if (Array.isArray(result)) {
                setDoctors(result);
                setTotalItems(result.length);
                setTotalPages(1);
            } else {
                const response = result as DoctorsResponseI;
                setDoctors(response.data ?? []);
                setTotalItems(response.meta?.totalItems ?? 0);
                setTotalPages(response.meta?.totalPages ?? 1);
            }
        } catch {
            setDoctors([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    // Trigger fetch when filters or page change
    useEffect(() => {
        if (isInitial) {
            setIsInitial(false);
            return;
        }
        fetchDoctors(currentPage, searchTerm, selectedSpecialisation, selectedExperience);
    }, [currentPage, searchTerm, selectedSpecialisation, selectedExperience, fetchDoctors, isInitial]);

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
        setIsInitial(false);
        fetchDoctors(1, searchTerm, selectedSpecialisation, selectedExperience);
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
                            <span className={styles.breadcrumbCurrent}>Doctors</span>
                        </nav>

                        <h1 className={styles.title}>
                            Meet Our <span className={styles.titleAccent}>Specialists</span>
                        </h1>

                        <p className={styles.description}>
                            Experienced doctors across multiple departments dedicated to
                            your health and well-being.
                        </p>

                        <div className={styles.statsGrid}>
                            {displayStats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.id} className={styles.statItem}>
                                        <span className={styles.statIcon}>
                                            <Icon size={20} strokeWidth={2} aria-hidden="true" />
                                        </span>
                                        <span className={styles.statText}>
                                            <span className={styles.statValue}>{stat.value}</span>
                                            <span className={styles.statLabel}>{stat.label}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* SEARCH FILTER SECTION */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.filterSection}>
                <form className={styles.filterCard} onSubmit={handleSearchSubmit}>
                    <div className={styles.filterGrid}>
                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel} htmlFor="search">
                                Search Doctor
                            </label>
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
                                    placeholder="Search doctor by name..."
                                    value={searchTerm}
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                    }}
                                    className={styles.searchInput}
                                    aria-label="Search doctor by name"
                                />
                            </div>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel} htmlFor="specialisation">
                                Specialisation
                            </label>
                            <select
                                id="specialisation"
                                className={styles.selectField}
                                value={selectedSpecialisation}
                                onChange={(event) => {
                                    setSelectedSpecialisation(event.target.value);
                                    setCurrentPage(1);
                                    setIsInitial(false);
                                }}
                            >
                                <option value="">All Specialisations</option>
                                {specialisations.map((spec) => (
                                    <option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel} htmlFor="experience">
                                Experience
                            </label>
                            <select
                                id="experience"
                                className={styles.selectField}
                                value={selectedExperience}
                                onChange={(event) => {
                                    setSelectedExperience(Number(event.target.value));
                                    setCurrentPage(1);
                                    setIsInitial(false);
                                }}
                            >
                                {EXPERIENCE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* DOCTORS GRID */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.doctorsSection}>
                <div className={styles.topBar}>
                    <p className={styles.resultsCount}>
                        {totalItems > 0
                            ? `Showing ${startItem}–${endItem} of ${totalItems} doctors`
                            : "No doctors found"}
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
                        <Loader2 size={32} className={styles.spinner} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : doctors.length === 0 ? (
                    <p className={styles.emptyState}>
                        No doctors match your search. Try a different keyword or filter.
                    </p>
                ) : (
                    <div className={styles.doctorsGrid}>
                        {doctors.map((doctor) => (
                            <article key={doctor.id} className={styles.doctorCard}>
                                <div className={styles.doctorImageWrap}>
                                    {doctor.profile_pic ? (
                                        <Image
                                            src={doctor.profile_pic}
                                            alt={doctor.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className={styles.doctorImage}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Users size={48} color="#0b8a53" opacity={0.5} />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.doctorContent}>
                                    <h3 className={styles.doctorName}>{doctor.name}</h3>
                                    <p className={styles.doctorDesignation}>
                                        {doctor.specialisations?.map(s => s.name).join(", ") || "Specialist"}
                                    </p>

                                    <div className={styles.divider} />

                                    <div className={styles.departmentRow}>
                                        <Building2 size={16} strokeWidth={2} aria-hidden="true" />
                                        <span>{doctor.specialisations?.[0]?.name || "Medical Department"}</span>
                                    </div>

                                    <Link
                                        href={hospitalSlug ? `/temp1/${hospitalSlug}/our-doctors/${doctor.slug || doctor.id}` : `/doctors/${doctor.id}`}
                                        className={styles.viewButton}
                                    >
                                        View Profile
                                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* PAGINATION */}
                {/* ------------------------------------------------------------- */}
                {totalPages > 1 && (
                    <nav className={styles.pagination} aria-label="Doctors pagination">
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
                            src="/images/doctors/help-doctor.png"
                            alt=""
                            width={96}
                            height={96}
                        />
                    </div>

                    <div className={styles.ctaText}>
                        <h2 className={styles.ctaTitle}>Need Help Finding a Doctor?</h2>
                        <p className={styles.ctaDescription}>
                            Our support team is here to help you find the right specialist.
                        </p>
                    </div>

                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className={styles.ctaButtonOutline}>
                            <Phone size={18} strokeWidth={2} aria-hidden="true" />
                            Contact Us
                        </Link>
                        <Link href="/appointments/new" className={styles.ctaButtonFilled}>
                            <Calendar size={18} strokeWidth={2} aria-hidden="true" />
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
