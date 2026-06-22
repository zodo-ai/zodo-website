"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Users,
    Building2,
    HeartHandshake,
    ShieldCheck,
    LayoutGrid,
    List,
    ArrowRight,
    Phone,
} from "lucide-react";
import styles from "./page.module.css";
import { DepartmentI } from "@/network/departments/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
    id: number;
    icon: typeof Users;
    title: string;
    description: string;
}

type ViewMode = "grid" | "list";

interface DepartmentsListingClientProps {
    departments: DepartmentI[];
}

// ---------------------------------------------------------------------------
// Mock Data for UI
// ---------------------------------------------------------------------------

const HERO_FEATURES: FeatureItem[] = [
    {
        id: 1,
        icon: Users,
        title: "Expert Specialists",
        description: "Experienced doctors across all departments",
    },
    {
        id: 2,
        icon: Building2,
        title: "Advanced Care",
        description: "Modern equipment for accurate diagnosis",
    },
    {
        id: 3,
        icon: HeartHandshake,
        title: "Patient First",
        description: "Your health and comfort are our priority",
    },
    {
        id: 4,
        icon: ShieldCheck,
        title: "Quality Assured",
        description: "High standards of care and safety",
    },
];

const WHY_CHOOSE_FEATURES: FeatureItem[] = [
    {
        id: 1,
        icon: Users,
        title: "Integrated Care",
        description: "Departments collaborate for better outcomes",
    },
    {
        id: 2,
        icon: HeartHandshake,
        title: "Expert Team",
        description: "Experienced professionals across all specialties",
    },
    {
        id: 3,
        icon: ShieldCheck,
        title: "Advanced Facilities",
        description: "Modern technology for accurate treatment",
    },
];

const DEPARTMENT_OPTIONS = [
    "All Departments",
    "Oncology",
    "Pediatrics",
    "Psychiatry",
    "Physician",
    "Dentistry",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "ENT",
];

// Helper to generate a consistent gradient color based on department name length or ID string
const getDepartmentColor = (idStr: string) => {
    const colors = [
        "linear-gradient(135deg, #F3E8FF, #E9D8FD)",
        "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
        "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
        "linear-gradient(135deg, #FEF9C3, #FDE68A)",
        "linear-gradient(135deg, #FCE7F3, #FBCFE8)",
        "linear-gradient(135deg, #FFE4E6, #FECDD3)",
        "linear-gradient(135deg, #E0E7FF, #C7D2FE)",
        "linear-gradient(135deg, #FFEDD5, #FED7AA)",
        "linear-gradient(135deg, #CCFBF1, #99F6E4)",
        "linear-gradient(135deg, #D1FAE5, #A7F3D0)"
    ];
    // Simple hash to pick a color consistently
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function DepartmentsListingClient({ departments }: DepartmentsListingClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState(DEPARTMENT_OPTIONS[0]);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const filteredDepartments = useMemo(() => {
        return departments.filter((dept) => {
            const matchesSearch = dept.name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            const matchesDepartment =
                departmentFilter === "All Departments" || dept.name === departmentFilter;
            return matchesSearch && matchesDepartment;
        });
    }, [departments, searchTerm, departmentFilter]);

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
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
                            <span className={styles.breadcrumbCurrent}>Departments</span>
                        </nav>

                        <h1 className={styles.title}>
                            Our <span className={styles.titleAccent}>Departments</span>
                        </h1>

                        <p className={styles.description}>
                            Comprehensive care across multiple specialties for you and your
                            family.
                        </p>

                        <div className={styles.featureGrid}>
                            {HERO_FEATURES.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={feature.id} className={styles.featureItem}>
                                        <span className={styles.featureIcon}>
                                            <Icon size={18} strokeWidth={2} aria-hidden="true" />
                                        </span>
                                        <span className={styles.featureText}>
                                            <span className={styles.featureTitle}>
                                                {feature.title}
                                            </span>
                                            <span className={styles.featureDescription}>
                                                {feature.description}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.heroImage}>
                        <Image
                            src="/images/departments/hero.jpg"
                            alt="Two specialists from Apollo Dental Hospital"
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
                                placeholder="Search departments..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className={styles.searchInput}
                                aria-label="Search departments"
                            />
                        </div>

                        <select
                            className={styles.selectField}
                            value={departmentFilter}
                            onChange={(event) => setDepartmentFilter(event.target.value)}
                            aria-label="Filter by department"
                        >
                            {DEPARTMENT_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* DEPARTMENTS GRID / LIST */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.departmentsSection}>
                <div className={styles.topBar}>
                    <p className={styles.resultsCount}>
                        Showing {filteredDepartments.length} departments
                    </p>

                    <div className={styles.viewToggle}>
                        <button
                            type="button"
                            className={`${styles.viewToggleButton} ${viewMode === "grid" ? styles.viewToggleButtonActive : ""
                                }`}
                            onClick={() => setViewMode("grid")}
                            aria-pressed={viewMode === "grid"}
                        >
                            <LayoutGrid size={16} strokeWidth={2} aria-hidden="true" />
                            Grid View
                        </button>
                        <button
                            type="button"
                            className={`${styles.viewToggleButton} ${viewMode === "list" ? styles.viewToggleButtonActive : ""
                                }`}
                            onClick={() => setViewMode("list")}
                            aria-pressed={viewMode === "list"}
                        >
                            <List size={16} strokeWidth={2} aria-hidden="true" />
                            List View
                        </button>
                    </div>
                </div>

                {filteredDepartments.length === 0 ? (
                    <p className={styles.emptyState}>
                        No departments match your search. Try a different keyword or
                        filter.
                    </p>
                ) : viewMode === "grid" ? (
                    <div className={styles.departmentsGrid}>
                        {filteredDepartments.map((dept) => (
                            <article key={dept.id} className={styles.departmentCard}>
                                <div
                                    className={styles.cardHeader}
                                    style={{ background: getDepartmentColor(dept.id || dept.name) }}
                                />
                                <div className={styles.cardContent}>
                                    <h3 className={styles.departmentName}>{dept.name}</h3>
                                    <p className={styles.departmentDescription}>
                                        {dept.description || "Medical Department"}
                                    </p>
                                    <Link
                                        href={`/departments/${dept.id}`}
                                        className={styles.viewDetailsButton}
                                    >
                                        View Details
                                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.departmentsList}>
                        {filteredDepartments.map((dept) => (
                            <article key={dept.id} className={styles.departmentListCard}>
                                <div
                                    className={styles.listCardHeader}
                                    style={{ background: getDepartmentColor(dept.id || dept.name) }}
                                />
                                <div className={styles.listCardContent}>
                                    <div className={styles.listCardText}>
                                        <h3 className={styles.departmentName}>{dept.name}</h3>
                                        <p className={styles.departmentDescription}>
                                            {dept.description || "Medical Department"}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/departments/${dept.id}`}
                                        className={styles.viewDetailsButton}
                                    >
                                        View Details
                                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* WHY CHOOSE OUR DEPARTMENTS */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.whyChooseSection}>
                <div className={styles.whyChooseContent}>
                    <div className={styles.whyChooseImage}>
                        <Image
                            src="/images/departments/why-choose.jpg"
                            alt="Calm, modern hospital lounge"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.whyChooseImageEl}
                        />
                    </div>

                    <div className={styles.whyChooseText}>
                        <h2 className={styles.whyChooseTitle}>
                            Why Choose Our Departments?
                        </h2>
                        <p className={styles.whyChooseDescription}>
                            Our departments work together to provide coordinated,
                            comprehensive care with the highest standards of safety and
                            quality.
                        </p>

                        <div className={styles.whyChooseFeatures}>
                            {WHY_CHOOSE_FEATURES.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={feature.id} className={styles.whyChooseFeature}>
                                        <span className={styles.whyChooseFeatureIcon}>
                                            <Icon size={18} strokeWidth={2} aria-hidden="true" />
                                        </span>
                                        <span className={styles.featureText}>
                                            <span className={styles.featureTitle}>
                                                {feature.title}
                                            </span>
                                            <span className={styles.featureDescription}>
                                                {feature.description}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* CTA BANNER */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <div className={styles.ctaImage}>
                        <Image
                            src="/images/departments/cta-doctor.png"
                            alt="Friendly Apollo doctor"
                            fill
                            sizes="92px"
                            className={styles.ctaImageEl}
                        />
                    </div>

                    <div className={styles.ctaText}>
                        <h2 className={styles.ctaTitle}>
                            Need Help Finding the Right Department?
                        </h2>
                        <p className={styles.ctaDescription}>
                            Our care team is here to help you find the right specialist for
                            your needs.
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
