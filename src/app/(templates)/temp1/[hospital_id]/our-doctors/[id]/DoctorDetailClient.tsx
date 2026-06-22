"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Share2,
    BadgeCheck,
    Clock,
    IndianRupee,
    CalendarDays,
    Briefcase,
    ShieldCheck,
    Building2,
    Phone,
    Mail,
    ToggleRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Globe,
    Star,
    MessageSquare,
    Users,
    Stethoscope,
    ClipboardList,
    ExternalLink,
    Clock3,
} from "lucide-react";
import styles from "./page.module.css";
import { DoctorI, ReviewI, TimeSlotI } from "@/network/doctors/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getExperience(workStartDate: string | ""): string | null {
    if (!workStartDate) return null;
    const start = new Date(workStartDate);
    const now = new Date();
    const years = Math.floor(
        (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    if (years < 1) return "< 1 Year";
    return `${years}+ Years`;
}

function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
}

function formatJoiningDate(dateStr: string): string | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
}

function getTimePeriod(timeStr: string): "morning" | "afternoon" | "evening" {
    const hour = parseInt(timeStr.split(":")[0], 10);
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}

function formatPhoneNumber(phone: string): string {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabKey = "overview" | "specialisations" | "schedule" | "reviews";

interface DoctorDetailClientProps {
    doctor: DoctorI;
    timeslots: TimeSlotI | null;
    reviews: ReviewI[];
    hospitalSlug: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DoctorDetailClient({
    doctor,
    timeslots,
    reviews,
    hospitalSlug,
}: DoctorDetailClientProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activePeriod, setActivePeriod] = useState<
        "morning" | "afternoon" | "evening"
    >("morning");
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Compute which tabs to display
    const tabs: { key: TabKey; label: string }[] = useMemo(() => {
        const t: { key: TabKey; label: string }[] = [];
        t.push({ key: "overview", label: "Overview" });
        if (doctor.specialisations?.length > 0) {
            t.push({ key: "specialisations", label: "Specialisations" });
        }
        t.push({ key: "schedule", label: "Schedule" });
        if (reviews.length > 0) {
            t.push({ key: "reviews", label: "Reviews" });
        }
        return t;
    }, [doctor.specialisations, reviews.length]);

    // Experience
    const experience = getExperience(doctor.work_start_date ?? "");

    // Joining date
    const joiningDate = formatJoiningDate(doctor.work_start_date ?? "");

    // Specialisations text
    const specialisationsText =
        doctor.specialisations?.map((s) => s.name).join(", ") || null;

    // Time slots filtered by period
    const filteredSlots = useMemo(() => {
        if (!timeslots?.data) return [];
        return timeslots.data.filter(
            (slot) => getTimePeriod(slot.startTime) === activePeriod
        );
    }, [timeslots, activePeriod]);

    // Hospital info
    const hospital = doctor.hospital;
    const hospitalAddress = hospital?.address;
    const hospitalContact = hospital?.contact_details;

    // Navigate date
    const goToPrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        if (d >= new Date(new Date().toDateString())) {
            setSelectedDate(d);
        }
    };

    const goToNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d);
    };

    const isPrevDisabled =
        selectedDate.toDateString() === new Date().toDateString();

    // Share handler
    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: doctor.name,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <main className={styles.page}>
            {/* ----------------------------------------------------------------- */}
            {/* TOP BAR: Breadcrumb + Share */}
            {/* ----------------------------------------------------------------- */}
            <div className={styles.topBar}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link href={`/temp1/${hospitalSlug}`}>Home</Link>
                    <span>&gt;</span>
                    <Link href={`/temp1/${hospitalSlug}/our-doctors`}>
                        Doctors
                    </Link>
                    <span>&gt;</span>
                    <span className={styles.breadcrumbCurrent}>
                        {doctor.name}
                    </span>
                </nav>

                <button
                    type="button"
                    className={styles.shareButton}
                    onClick={handleShare}
                >
                    <Share2 size={15} strokeWidth={2} aria-hidden="true" />
                    Share Profile
                </button>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* PROFILE CARD */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.profileCard}>
                <div className={styles.profileCardInner}>
                    {/* Profile Image */}
                    <div className={styles.profileImageWrap}>
                        {doctor.profile_pic ? (
                            <Image
                                src={doctor.profile_pic}
                                alt={doctor.name}
                                fill
                                priority
                                sizes="180px"
                                className={styles.profileImage}
                            />
                        ) : (
                            <div className={styles.profileImagePlaceholder}>
                                <Users
                                    size={56}
                                    color="var(--primary-color, #0b8a53)"
                                    opacity={0.4}
                                />
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className={styles.profileInfo}>
                        <h1 className={styles.doctorName}>{doctor.name}</h1>

                        {specialisationsText && (
                            <div className={styles.doctorSpeciality}>
                                <span className={styles.doctorSpecialityIcon}>
                                    <BadgeCheck
                                        size={13}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                </span>
                                {specialisationsText}
                            </div>
                        )}

                        {/* Info chips */}
                        <div className={styles.infoChips}>
                            {experience && (
                                <div className={styles.infoChip}>
                                    <span className={styles.infoChipIcon}>
                                        <Briefcase
                                            size={16}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.infoChipText}>
                                        <span className={styles.infoChipLabel}>
                                            Experience
                                        </span>
                                        <span className={styles.infoChipValue}>
                                            {experience}
                                        </span>
                                    </span>
                                </div>
                            )}

                            {doctor.pricing && (
                                <div className={styles.infoChip}>
                                    <span className={styles.infoChipIcon}>
                                        <IndianRupee
                                            size={16}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.infoChipText}>
                                        <span className={styles.infoChipLabel}>
                                            Consultation Fee
                                        </span>
                                        <span className={styles.infoChipValue}>
                                            ₹
                                            {parseFloat(doctor.pricing).toFixed(
                                                0
                                            )}
                                        </span>
                                    </span>
                                </div>
                            )}

                            {doctor.consultation_duration && (
                                <div className={styles.infoChip}>
                                    <span className={styles.infoChipIcon}>
                                        <Clock
                                            size={16}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.infoChipText}>
                                        <span className={styles.infoChipLabel}>
                                            Consultation Duration
                                        </span>
                                        <span className={styles.infoChipValue}>
                                            {doctor.consultation_duration} mins
                                        </span>
                                    </span>
                                </div>
                            )}

                            {joiningDate && (
                                <div className={styles.infoChip}>
                                    <span className={styles.infoChipIcon}>
                                        <CalendarDays
                                            size={16}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.infoChipText}>
                                        <span className={styles.infoChipLabel}>
                                            Joining Date
                                        </span>
                                        <span className={styles.infoChipValue}>
                                            {joiningDate}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Availability badge */}
                        {doctor.status === "active" && (
                            <div className={styles.availabilityBadge}>
                                <span className={styles.availabilityDot} />
                                Available for Booking
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* CONTACT STRIP */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.contactStrip}>
                <div className={styles.contactStripInner}>
                    {hospital && (
                        <>
                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <Building2
                                        size={18}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className={styles.contactItemText}>
                                    <span className={styles.contactItemLabel}>
                                        Hospital
                                    </span>
                                    <span className={styles.contactItemValue}>
                                        {hospital.name}
                                        {hospital.location
                                            ? `, ${hospital.location}`
                                            : ""}
                                    </span>
                                </span>
                            </div>
                            <span className={styles.contactDivider} />
                        </>
                    )}

                    {doctor.phone_number && (
                        <>
                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <Phone
                                        size={18}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className={styles.contactItemText}>
                                    <span className={styles.contactItemLabel}>
                                        Phone
                                    </span>
                                    <span className={styles.contactItemValue}>
                                        {formatPhoneNumber(
                                            doctor.phone_number
                                        )}
                                    </span>
                                </span>
                            </div>
                            <span className={styles.contactDivider} />
                        </>
                    )}

                    {doctor.email && (
                        <>
                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <Mail
                                        size={18}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className={styles.contactItemText}>
                                    <span className={styles.contactItemLabel}>
                                        Email
                                    </span>
                                    <span className={styles.contactItemValue}>
                                        {doctor.email}
                                    </span>
                                </span>
                            </div>
                            <span className={styles.contactDivider} />
                        </>
                    )}

                    {doctor.auto_booking_enabled !== undefined && (
                        <div className={styles.contactItem}>
                            <span className={styles.contactItemIcon}>
                                <ToggleRight
                                    size={18}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            </span>
                            <span className={styles.contactItemText}>
                                <span className={styles.contactItemLabel}>
                                    Auto Booking
                                </span>
                                <span className={styles.contactItemValue}>
                                    {doctor.auto_booking_enabled
                                        ? "Enabled"
                                        : "Disabled"}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* BOOK APPOINTMENT CTA */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.bookingCta}>
                <div className={styles.bookingCtaInner}>
                    <div className={styles.bookingCtaLeft}>
                        <div className={styles.bookingCtaIconWrap}>
                            <Calendar
                                size={28}
                                color="var(--primary-color, #0b8a53)"
                                aria-hidden="true"
                            />
                        </div>
                        <div className={styles.bookingCtaText}>
                            <h3>Book an appointment</h3>
                            <p>
                                Select a convenient time slot and schedule your
                                visit.
                            </p>
                        </div>
                    </div>
                    <div className={styles.bookingCtaButtons}>
                        <button type="button" className={styles.bookAppointmentBtn}>
                            <CalendarDays
                                size={18}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                            Book Appointment
                        </button>
                        <button type="button" className={styles.enquiryBtn}>
                            <MessageSquare
                                size={18}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                            Enquiry Now
                        </button>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* TABS */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.tabsSection}>
                <div className={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`${styles.tab} ${
                                activeTab === tab.key ? styles.tabActive : ""
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* TAB CONTENT */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.tabContent}>
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <>
                        {/* About */}
                        <div className={styles.aboutSection}>
                            <h2 className={styles.sectionTitle}>
                                About Doctor
                            </h2>
                            <div className={styles.sectionDivider} />
                            <p className={styles.aboutText}>
                                {doctor.about || "No information available."}
                            </p>
                        </div>

                        {/* Specialisations + Departments row */}
                        {doctor.specialisations?.length > 0 && (
                            <div className={styles.specDeptGrid}>
                                <div>
                                    <h2 className={styles.sectionTitle}>
                                        Specialisation
                                    </h2>
                                    <div className={styles.sectionDivider} />
                                    {doctor.specialisations.map((spec) => (
                                        <div
                                            key={spec.id || spec.name}
                                            className={
                                                styles.specialisationItem
                                            }
                                        >
                                            <div className={styles.specIconWrap}>
                                                <Stethoscope
                                                    size={22}
                                                    strokeWidth={1.8}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className={styles.specInfo}>
                                                <h4>{spec.name}</h4>
                                                {spec.description && (
                                                    <p>{spec.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h2 className={styles.sectionTitle}>
                                        Departments
                                    </h2>
                                    <div className={styles.sectionDivider} />
                                    <div className={styles.departmentTags}>
                                        {doctor.specialisations.map((spec) => (
                                            <span
                                                key={spec.id || spec.name}
                                                className={
                                                    styles.departmentTag
                                                }
                                            >
                                                {spec.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Grid: Time Slots + Hospital Card */}
                        <div className={styles.bottomGrid}>
                            {/* Time Slots */}
                            <div className={styles.timeSlotsCard}>
                                <div className={styles.timeSlotsHeader}>
                                    <h3 className={styles.timeSlotsTitle}>
                                        Available Time Slots
                                    </h3>
                                </div>

                                {/* Date Navigator */}
                                <div className={styles.dateNavigator}>
                                    <button
                                        type="button"
                                        className={styles.dateNavArrow}
                                        onClick={goToPrevDay}
                                        disabled={isPrevDisabled}
                                        aria-label="Previous day"
                                    >
                                        <ChevronLeft
                                            size={16}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <span className={styles.dateText}>
                                        <CalendarDays
                                            size={16}
                                            className={styles.dateTextIcon}
                                            aria-hidden="true"
                                        />
                                        {formatDate(selectedDate)}
                                    </span>
                                    <button
                                        type="button"
                                        className={styles.dateNavArrow}
                                        onClick={goToNextDay}
                                        aria-label="Next day"
                                    >
                                        <ChevronRight
                                            size={16}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                {/* Period tabs */}
                                <div className={styles.periodTabs}>
                                    {(
                                        [
                                            "morning",
                                            "afternoon",
                                            "evening",
                                        ] as const
                                    ).map((period) => (
                                        <button
                                            key={period}
                                            type="button"
                                            className={`${styles.periodTab} ${
                                                activePeriod === period
                                                    ? styles.periodTabActive
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActivePeriod(period)
                                            }
                                        >
                                            {period.charAt(0).toUpperCase() +
                                                period.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Slots grid */}
                                {filteredSlots.length > 0 ? (
                                    <div className={styles.slotsGrid}>
                                        {filteredSlots.map((slot) => {
                                            const key = `${slot.startTime}-${slot.endTime}`;
                                            const isSelected =
                                                selectedSlot === key;
                                            const isDisabled =
                                                !slot.isAvailable;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={`${
                                                        styles.slotBtn
                                                    } ${
                                                        isSelected
                                                            ? styles.slotBtnSelected
                                                            : ""
                                                    } ${
                                                        isDisabled
                                                            ? styles.slotBtnDisabled
                                                            : ""
                                                    }`}
                                                    disabled={isDisabled}
                                                    onClick={() =>
                                                        setSelectedSlot(
                                                            isSelected
                                                                ? null
                                                                : key
                                                        )
                                                    }
                                                >
                                                    {formatTime(
                                                        slot.startTime
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className={styles.noSlots}>
                                        No time slots available for this period.
                                    </p>
                                )}

                                <div className={styles.slotsTimezone}>
                                    <Clock3
                                        size={13}
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                    All times are shown in local time
                                </div>
                            </div>

                            {/* Hospital Card */}
                            {hospital && (
                                <div className={styles.hospitalCard}>
                                    <h3 className={styles.hospitalCardTitle}>
                                        About Hospital
                                    </h3>

                                    <div className={styles.hospitalIdentity}>
                                        <div className={styles.hospitalLogo}>
                                            {hospital.logo ? (
                                                <Image
                                                    src={hospital.logo}
                                                    alt={hospital.name}
                                                    width={48}
                                                    height={48}
                                                    className={
                                                        styles.hospitalLogoImage
                                                    }
                                                />
                                            ) : (
                                                <Building2
                                                    size={24}
                                                    strokeWidth={1.5}
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>
                                        <div
                                            className={styles.hospitalNameText}
                                        >
                                            <h4>{hospital.name}</h4>
                                            {(hospitalAddress?.city ||
                                                hospitalAddress?.state) && (
                                                <p>
                                                    {[
                                                        hospitalAddress?.city,
                                                        hospitalAddress?.state,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.hospitalDetails}>
                                        {hospitalContact?.mobile && (
                                            <div
                                                className={
                                                    styles.hospitalDetailItem
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.hospitalDetailIcon
                                                    }
                                                >
                                                    <Phone
                                                        size={16}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        styles.hospitalDetailText
                                                    }
                                                >
                                                    {formatPhoneNumber(
                                                        hospitalContact.mobile
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {hospitalContact?.email && (
                                            <div
                                                className={
                                                    styles.hospitalDetailItem
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.hospitalDetailIcon
                                                    }
                                                >
                                                    <Mail
                                                        size={16}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        styles.hospitalDetailText
                                                    }
                                                >
                                                    {hospitalContact.email}
                                                </span>
                                            </div>
                                        )}

                                        {hospitalContact?.website && (
                                            <div
                                                className={
                                                    styles.hospitalDetailItem
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.hospitalDetailIcon
                                                    }
                                                >
                                                    <Globe
                                                        size={16}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        styles.hospitalDetailText
                                                    }
                                                >
                                                    {hospitalContact.website}
                                                </span>
                                            </div>
                                        )}

                                        {hospitalAddress && (
                                            <div
                                                className={
                                                    styles.hospitalDetailItem
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.hospitalDetailIcon
                                                    }
                                                >
                                                    <MapPin
                                                        size={16}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        styles.hospitalDetailText
                                                    }
                                                >
                                                    {[
                                                        hospitalAddress.lineOne,
                                                        hospitalAddress.city,
                                                        hospitalAddress.state,
                                                        hospitalAddress.pincode
                                                            ? `- ${hospitalAddress.pincode}`
                                                            : null,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {hospital.slug && (
                                        <Link
                                            href={`/temp1/${hospital.slug}`}
                                            className={styles.viewHospitalBtn}
                                        >
                                            View Hospital Profile
                                            <ExternalLink
                                                size={15}
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* SPECIALISATIONS TAB */}
                {activeTab === "specialisations" && (
                    <>
                        <h2 className={styles.sectionTitle}>Specialisations</h2>
                        <div className={styles.sectionDivider} />
                        {doctor.specialisations?.map((spec) => (
                            <div
                                key={spec.id || spec.name}
                                className={styles.specialisationItem}
                                style={{ marginBottom: 12 }}
                            >
                                <div className={styles.specIconWrap}>
                                    <Stethoscope
                                        size={22}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className={styles.specInfo}>
                                    <h4>{spec.name}</h4>
                                    {spec.description && (
                                        <p>{spec.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* SCHEDULE TAB */}
                {activeTab === "schedule" && (
                    <div className={styles.timeSlotsCard}>
                        <div className={styles.timeSlotsHeader}>
                            <h3 className={styles.timeSlotsTitle}>
                                Available Time Slots
                            </h3>
                        </div>

                        <div className={styles.dateNavigator}>
                            <button
                                type="button"
                                className={styles.dateNavArrow}
                                onClick={goToPrevDay}
                                disabled={isPrevDisabled}
                                aria-label="Previous day"
                            >
                                <ChevronLeft
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </button>
                            <span className={styles.dateText}>
                                <CalendarDays
                                    size={16}
                                    className={styles.dateTextIcon}
                                    aria-hidden="true"
                                />
                                {formatDate(selectedDate)}
                            </span>
                            <button
                                type="button"
                                className={styles.dateNavArrow}
                                onClick={goToNextDay}
                                aria-label="Next day"
                            >
                                <ChevronRight
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div className={styles.periodTabs}>
                            {(
                                ["morning", "afternoon", "evening"] as const
                            ).map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    className={`${styles.periodTab} ${
                                        activePeriod === period
                                            ? styles.periodTabActive
                                            : ""
                                    }`}
                                    onClick={() => setActivePeriod(period)}
                                >
                                    {period.charAt(0).toUpperCase() +
                                        period.slice(1)}
                                </button>
                            ))}
                        </div>

                        {filteredSlots.length > 0 ? (
                            <div className={styles.slotsGrid}>
                                {filteredSlots.map((slot) => {
                                    const key = `${slot.startTime}-${slot.endTime}`;
                                    const isSelected = selectedSlot === key;
                                    const isDisabled = !slot.isAvailable;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            className={`${styles.slotBtn} ${
                                                isSelected
                                                    ? styles.slotBtnSelected
                                                    : ""
                                            } ${
                                                isDisabled
                                                    ? styles.slotBtnDisabled
                                                    : ""
                                            }`}
                                            disabled={isDisabled}
                                            onClick={() =>
                                                setSelectedSlot(
                                                    isSelected ? null : key
                                                )
                                            }
                                        >
                                            {formatTime(slot.startTime)}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={styles.noSlots}>
                                No time slots available for this period.
                            </p>
                        )}

                        <div className={styles.slotsTimezone}>
                            <Clock3
                                size={13}
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                            All times are shown in local time
                        </div>
                    </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === "reviews" && (
                    <>
                        <h2 className={styles.sectionTitle}>Patient Reviews</h2>
                        <div className={styles.sectionDivider} />
                        {reviews.length > 0 ? (
                            <div className={styles.reviewsList}>
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className={styles.reviewCard}
                                    >
                                        <div className={styles.reviewHeader}>
                                            <div
                                                className={styles.reviewAvatar}
                                            >
                                                {review.user?.first_name?.[0]?.toUpperCase() ||
                                                    "U"}
                                            </div>
                                            <div>
                                                <p
                                                    className={
                                                        styles.reviewName
                                                    }
                                                >
                                                    {[
                                                        review.user?.first_name,
                                                        review.user?.last_name,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ") ||
                                                        "Anonymous"}
                                                </p>
                                                {review.rating && (
                                                    <div
                                                        className={
                                                            styles.reviewStars
                                                        }
                                                    >
                                                        {Array.from(
                                                            {
                                                                length: Math.round(
                                                                    parseFloat(
                                                                        review.rating
                                                                    )
                                                                ),
                                                            },
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    fill="#f59e0b"
                                                                    strokeWidth={
                                                                        0
                                                                    }
                                                                    aria-hidden="true"
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {review.review_note && (
                                            <p className={styles.reviewText}>
                                                {review.review_note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noReviews}>
                                No reviews yet.
                            </p>
                        )}
                    </>
                )}
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* TRUST BANNER */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.trustBanner}>
                <div className={styles.trustBannerInner}>
                    <span className={styles.trustIcon}>
                        <ShieldCheck
                            size={32}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>
                    <div className={styles.trustText}>
                        <h4>Your Health, Our Priority</h4>
                        <p>
                            Safe, secure and confidential consultations with
                            verified healthcare professionals.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
