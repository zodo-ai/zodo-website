"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Building2,
    MapPin,
    Phone,
    CalendarDays,
    ShieldPlus,
} from "lucide-react";
import styles from "./page.module.css";
import { HospitalServiceI } from "@/network/hospital-services/types";
import { HospitalsI } from "@/network/hospitals/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPhoneNumber(phone: string): string {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

function getDiscountPercent(
    price: string,
    strikePrice: string
): number | null {
    const p = parseFloat(price);
    const sp = parseFloat(strikePrice);
    if (!sp || !p || sp <= p) return null;
    return Math.round(((sp - p) / sp) * 100);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ServiceDetailClientProps {
    service: HospitalServiceI;
    hospital: HospitalsI | null;
    hospitalSlug: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ServiceDetailClient({
    service,
    hospital,
    hospitalSlug,
}: ServiceDetailClientProps) {
    const discount = getDiscountPercent(
        service.price,
        service.strike_through_price
    );

    const hospitalName = hospital?.name;
    const hospitalLocation = hospital?.location;
    const hospitalCity = hospital?.address?.city;
    const hospitalState = hospital?.address?.state;
    const hospitalMobile = hospital?.contact_details?.mobile;

    return (
        <main className={styles.page}>
            {/* ----------------------------------------------------------------- */}
            {/* BREADCRUMB */}
            {/* ----------------------------------------------------------------- */}
            <div className={styles.breadcrumbBar}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link href={`/temp1/${hospitalSlug}`}>Home</Link>
                    <span>&gt;</span>
                    <Link href={`/temp1/${hospitalSlug}/our-services`}>
                        Services
                    </Link>
                    <span>&gt;</span>
                    <span className={styles.breadcrumbCurrent}>
                        {service.name}
                    </span>
                </nav>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* HERO CARD */}
            {/* ----------------------------------------------------------------- */}
            <section className={styles.heroCard}>
                <div className={styles.heroCardInner}>
                    {/* Image */}
                    <div className={styles.heroImageWrap}>
                        {service.image ? (
                            <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                priority
                                sizes="(max-width: 992px) 100vw, 52vw"
                                className={styles.heroImage}
                            />
                        ) : (
                            <div className={styles.heroImagePlaceholder}>
                                <ShieldPlus
                                    size={64}
                                    color="var(--primary-color, #0b8a53)"
                                    opacity={0.3}
                                />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className={styles.heroInfo}>
                        <h1 className={styles.serviceName}>{service.name}</h1>

                        {service.description && (
                            <p className={styles.serviceDesc}>
                                {service.description}
                            </p>
                        )}

                        {/* Price */}
                        <div className={styles.priceRow}>
                            <span className={styles.price}>
                                ₹{parseFloat(service.price).toFixed(2)}
                            </span>
                            {service.strike_through_price && (
                                <span className={styles.strikePrice}>
                                    ₹
                                    {parseFloat(
                                        service.strike_through_price
                                    ).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {discount && (
                            <span className={styles.discountBadge}>
                                {discount}% OFF
                            </span>
                        )}

                        {/* Daily booking count */}
                        {service.daily_booking_count > 0 && (
                            <div className={styles.bookingInfo}>
                                <span className={styles.bookingInfoIcon}>
                                    <CalendarDays
                                        size={20}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className={styles.bookingInfoText}>
                                    <span className={styles.bookingInfoLabel}>
                                        Daily Booking Count
                                    </span>
                                    <span className={styles.bookingInfoValue}>
                                        {service.daily_booking_count}
                                    </span>
                                </span>
                            </div>
                        )}

                        {/* Book Now */}
                        <Link href={`/temp1/${hospitalSlug}/booking/create?type=service&serviceId=${service.id}`} className={styles.bookNowBtn}>
                            Book Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* HOSPITAL INFO STRIP */}
            {/* ----------------------------------------------------------------- */}
            {hospital && (
                <section className={styles.hospitalStrip}>
                    <div className={styles.hospitalStripInner}>
                        {/* Hospital name */}
                        {hospitalName && (
                            <>
                                <div className={styles.hospitalStripItem}>
                                    <span className={styles.hospitalStripIcon}>
                                        <Building2
                                            size={22}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.hospitalStripText}>
                                        <span
                                            className={
                                                styles.hospitalStripLabel
                                            }
                                        >
                                            Hospital
                                        </span>
                                        <span
                                            className={
                                                styles.hospitalStripValue
                                            }
                                        >
                                            {hospitalName}
                                        </span>
                                        {hospitalLocation && (
                                            <span
                                                className={
                                                    styles.hospitalStripSubValue
                                                }
                                            >
                                                {hospitalLocation}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <span className={styles.hospitalStripDivider} />
                            </>
                        )}

                        {/* Location */}
                        {(hospitalCity || hospitalState) && (
                            <>
                                <div className={styles.hospitalStripItem}>
                                    <span className={styles.hospitalStripIcon}>
                                        <MapPin
                                            size={22}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className={styles.hospitalStripText}>
                                        <span
                                            className={
                                                styles.hospitalStripLabel
                                            }
                                        >
                                            Location
                                        </span>
                                        <span
                                            className={
                                                styles.hospitalStripValue
                                            }
                                        >
                                            {hospitalCity || hospitalLocation}
                                        </span>
                                        {hospitalState && (
                                            <span
                                                className={
                                                    styles.hospitalStripSubValue
                                                }
                                            >
                                                {hospitalState}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <span className={styles.hospitalStripDivider} />
                            </>
                        )}

                        {/* Contact */}
                        {hospitalMobile && (
                            <div className={styles.hospitalStripItem}>
                                <span className={styles.hospitalStripIcon}>
                                    <Phone
                                        size={22}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className={styles.hospitalStripText}>
                                    <span
                                        className={styles.hospitalStripLabel}
                                    >
                                        Contact
                                    </span>
                                    <span
                                        className={styles.hospitalStripValue}
                                    >
                                        {formatPhoneNumber(hospitalMobile)}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* ABOUT SERVICE */}
            {/* ----------------------------------------------------------------- */}
            {service.description && (
                <section className={styles.aboutSection}>
                    <div className={styles.aboutCard}>
                        <h2 className={styles.aboutTitle}>About Service</h2>
                        <div className={styles.aboutDivider} />
                        <p className={styles.aboutText}>
                            {service.description}
                        </p>
                    </div>
                </section>
            )}
        </main>
    );
}
