"use client";

import { useState } from "react";
import { Search, Briefcase, GraduationCap } from "lucide-react";
import styles from "./SearchSection.module.css";

export function SearchSection() {
  const [activeTab, setActiveTab] = useState<"doctor" | "service">("doctor");

  return (
    <div className={styles.section}>
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "doctor" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("doctor")}
          >
            <div className={activeTab === "doctor" ? styles.iconWrapperActive : styles.iconWrapperInactive}>
              <GraduationCap size={18} className={activeTab === "doctor" ? styles.iconActive : styles.iconInactive} />
            </div>
            Find a Doctor
          </button>
          <button
            className={activeTab === "service" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("service")}
          >
            <div className={activeTab === "service" ? styles.iconWrapperActive : styles.iconWrapperInactive}>
              <Briefcase size={18} className={activeTab === "service" ? styles.iconActive : styles.iconInactive} />
            </div>
            Find a Service
          </button>
        </div>

        {/* Search Fields */}
        <div className={styles.fieldsContainer}>
          <div className={styles.searchField}>
            <div className={styles.inputWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={activeTab === "doctor" ? "Search by Doctor Name, Specialty..." : "Search by Service Name..."}
                className={styles.input}
              />
            </div>
          </div>

          {activeTab === "doctor" && (
            <>
              <div className={styles.selectField1}>
                <select className={styles.select} defaultValue="">
                  <option value="" disabled hidden>Select Specialty</option>
                  <option value="general">General Dentistry</option>
                  <option value="ortho">Orthodontics</option>
                  <option value="surgery">Oral Surgery</option>
                </select>
              </div>

              <div className={styles.selectField1}>
                <select className={styles.select} defaultValue="">
                  <option value="" disabled hidden>Select Experience</option>
                  <option value="1">1+ Years</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                </select>
              </div>
            </>
          )}

          <button className={styles.button}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
