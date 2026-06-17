import { Search, Briefcase, GraduationCap } from "lucide-react";
import styles from "./SearchSection.module.css";

export function SearchSection() {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={styles.tabActive}>
            <div className={styles.iconWrapperActive}>
              <GraduationCap size={18} className={styles.iconActive} />
            </div>
            Find a Doctor
          </button>
          <button className={styles.tabInactive}>
            <div className={styles.iconWrapperInactive}>
              <Briefcase size={18} className={styles.iconInactive} />
            </div>
            Find a Service
          </button>
        </div>

        {/* Search Fields */}
        <div className={styles.fieldsContainer}>
          <div className={styles.searchField}>
            <div className={styles.inputWrapper}>
              <Search
                size={18}
                className={styles.searchIcon}
              />
              <input
                type="text"
                placeholder="Search by Doctor Name, Specialty..."
                className={styles.input}
              />
            </div>
          </div>

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

          <div className={styles.selectField2}>
            <select className={styles.select} defaultValue="">
              <option value="" disabled hidden>Select Gender</option>
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button className={styles.button}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
