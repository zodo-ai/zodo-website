"use client";

import { useMemo, useState, type FormEvent } from "react";
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
} from "lucide-react";
import styles from "./page.module.css";
import { DoctorI } from "@/network/doctors/types";

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
    doctors: DoctorI[];
    hospitalSlug?: string;
}

// ---------------------------------------------------------------------------
// Mock Data for UI (Stats, Options)
// ---------------------------------------------------------------------------

const STATS: StatItem[] = [
    { id: 1, icon: Users, value: "3", label: "Doctors" },
    { id: 2, icon: Building2, value: "4", label: "Departments" },
    { id: 3, icon: Clock3, value: "Online", label: "Appointments" },
];

const SPECIALIZATION_OPTIONS = [
    "All Specializations",
    "Psychiatry",
    "Dentistry",
    "Orthodontics",
    "Root Canal",
    "Implants",
];

const DEPARTMENT_OPTIONS = [
    "All Departments",
    "Psychiatry",
    "Dental Care",
    "Cosmetic Dentistry",
    "Surgery",
];

const SORT_OPTIONS = ["Name A-Z", "Name Z-A", "Newest First", "Oldest First"];

const ITEMS_PER_PAGE = 4;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function DoctorsListingClient({ doctors, hospitalSlug }: DoctorsListingClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialization, setSpecialization] = useState(
        SPECIALIZATION_OPTIONS[0]
    );
    const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredDoctors = useMemo(() => {
        let result = doctors.filter((doctor) => {
            const matchesSearch = doctor.name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());

            // UI-only filtering. Since we don't have department info inside DoctorI directly
            // from the API response yet (or it's structured differently), we use this simple check
            // assuming specialisations is an array of objects.
            const doctorSpecializations = doctor.specialisations?.map(s => s.name).join(" ").toLowerCase() || "";

            const matchesSpecialization =
                specialization === "All Specializations" ||
                doctorSpecializations.includes(specialization.toLowerCase());

            // We skip department filter here as it might not be part of the doctor object directly
            const matchesDepartment = department === "All Departments";
            // || doctor.department === department; // If available

            return matchesSearch && matchesSpecialization && matchesDepartment;
        });

        if (sortBy === "Name A-Z") {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "Name Z-A") {
            result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "Newest First") {
            // result = [...result].sort((a, b) => b.id - a.id);
        } else {
            // result = [...result].sort((a, b) => a.id - b.id);
        }

        return result;
    }, [doctors, searchTerm, specialization, department, sortBy]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE)
    );

    const paginatedDoctors = filteredDoctors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
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
                            {STATS.map((stat) => {
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

                    <div className={styles.heroImage}>
                        <Image
                            src="/images/doctors/hero.jpg"
                            alt="Two smiling specialists from Apollo Dental Hospital"
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
                                        setCurrentPage(1);
                                    }}
                                    className={styles.searchInput}
                                    aria-label="Search doctor by name"
                                />
                            </div>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel} htmlFor="specialization">
                                Specialization
                            </label>
                            <select
                                id="specialization"
                                className={styles.selectField}
                                value={specialization}
                                onChange={(event) => {
                                    setSpecialization(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {SPECIALIZATION_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel} htmlFor="department">
                                Department
                            </label>
                            <select
                                id="department"
                                className={styles.selectField}
                                value={department}
                                onChange={(event) => {
                                    setDepartment(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {DEPARTMENT_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className={styles.searchButton}>
                            <Search size={18} strokeWidth={2} aria-hidden="true" />
                            Search
                        </button>
                    </div>
                </form>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* DOCTORS GRID */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.doctorsSection}>
                <div className={styles.topBar}>
                    <p className={styles.resultsCount}>
                        Showing {paginatedDoctors.length} of {filteredDoctors.length}{" "}
                        doctors
                    </p>

                    <div className={styles.sortWrapper}>
                        <span className={styles.sortLabel}>Sort by:</span>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(event) => {
                                setSortBy(event.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Sort doctors"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {paginatedDoctors.length === 0 ? (
                    <p className={styles.emptyState}>
                        No doctors match your search. Try a different keyword or filter.
                    </p>
                ) : (
                    <div className={styles.doctorsGrid}>
                        {paginatedDoctors.map((doctor) => (
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
