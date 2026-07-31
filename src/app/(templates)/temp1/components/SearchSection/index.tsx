"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, GraduationCap } from "lucide-react";
import styles from "./SearchSection.module.css";
import { SpecialisationI } from "@/network/doctors/types";

interface SearchSectionProps {
  hospitalSlug: string;
  specialisations?: SpecialisationI[];
}

const EXPERIENCE_OPTIONS = [
  { label: "Select Experience", value: "" },
  { label: "1+ Years", value: "1" },
  { label: "2+ Years", value: "2" },
  { label: "3+ Years", value: "3" },
  { label: "4+ Years", value: "4" },
  { label: "5+ Years", value: "5" },
];

export function SearchSection({
  hospitalSlug,
  specialisations = [],
}: SearchSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"doctor" | "service">("doctor");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialisation, setSelectedSpecialisation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (activeTab === "doctor") {
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (selectedSpecialisation) params.set("specialisation", selectedSpecialisation);
      if (selectedExperience) params.set("experience", selectedExperience);

      const queryString = params.toString();
      router.push(
        `/temp1/${hospitalSlug}/our-doctors${queryString ? `?${queryString}` : ""}`
      );
    } else {
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const queryString = params.toString();
      router.push(
        `/temp1/${hospitalSlug}/our-services${queryString ? `?${queryString}` : ""}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Search type">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "doctor"}
            className={activeTab === "doctor" ? styles.tabActive : styles.tabInactive}
            onClick={() => {
              setActiveTab("doctor");
              setSearchTerm("");
            }}
          >
            <span
              className={
                activeTab === "doctor" ? styles.iconWrapperActive : styles.iconWrapperInactive
              }
            >
              <GraduationCap
                className={activeTab === "doctor" ? styles.iconActive : styles.iconInactive}
                aria-hidden="true"
              />
            </span>
            Find a Doctor
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "service"}
            className={activeTab === "service" ? styles.tabActive : styles.tabInactive}
            onClick={() => {
              setActiveTab("service");
              setSearchTerm("");
            }}
          >
            <span
              className={
                activeTab === "service" ? styles.iconWrapperActive : styles.iconWrapperInactive
              }
            >
              <Briefcase
                className={activeTab === "service" ? styles.iconActive : styles.iconInactive}
                aria-hidden="true"
              />
            </span>
            Find a Service
          </button>
        </div>

        {/* Search Fields */}
        <div className={styles.fieldsContainer}>
          <div className={styles.searchField}>
            <div className={styles.inputWrapper}>
              <Search className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                placeholder={
                  activeTab === "doctor"
                    ? "Search by Doctor Name, Specialty..."
                    : "Search by Service Name..."
                }
                className={styles.input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search"
              />
            </div>
          </div>

          {activeTab === "doctor" && (
            <div className={styles.selectsRow}>
              <div className={styles.selectField}>
                <select
                  className={styles.select}
                  value={selectedSpecialisation}
                  onChange={(e) => setSelectedSpecialisation(e.target.value)}
                  aria-label="Filter by specialisation"
                >
                  <option value="">All Specialisations</option>
                  {specialisations.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.selectField}>
                <select
                  className={styles.select}
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  aria-label="Filter by experience"
                >
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button type="button" className={styles.button} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}