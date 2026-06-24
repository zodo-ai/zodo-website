"use client";

import { useEffect } from "react";
import { Check, Loader2, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PatientOption {
  id: string;
  name: string;
  age: number;
  gender: string;
  relation: string;
  profile_picture?: string;
}

interface SwitchPatientModalProps {
  open: boolean;
  onClose: () => void;
  patients: PatientOption[];
  selectedPatientId?: string;
  onSelect: (patient: PatientOption) => void;
  loading?: boolean;
}

const SwitchPatientModal = ({
  open,
  onClose,
  patients,
  selectedPatientId,
  onSelect,
  loading,
}: SwitchPatientModalProps) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/45"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="switch-patient-title"
        style={{
          width: "min(90%, 450px)",
          height: "90dvh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid color-mix(in srgb, var(--primary-color) 20%, white)",
          backgroundColor: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header — never scrolls */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid color-mix(in srgb, var(--primary-color) 15%, white)",
            backgroundColor: "white",
            padding: "16px 24px",
          }}
        >
          <div>
            <h2
              id="switch-patient-title"
              style={{ fontSize: "18px", fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)", margin: 0 }}
            >
              Switch Patient
            </h2>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              Select who you are booking for
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "32px",
              width: "32px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px 40px",
            minHeight: 0,
          }}
        >
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <Loader2 size={28} className="animate-spin text-[var(--primary-color)]" />
            </div>
          ) : patients.length === 0 ? (
            <div
              style={{
                borderRadius: "8px",
                border: "1px dashed color-mix(in srgb, var(--primary-color) 25%, white)",
                backgroundColor: "color-mix(in srgb, var(--primary-color) 5%, white)",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  margin: "0 auto 12px",
                  display: "flex",
                  height: "48px",
                  width: "48px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)",
                }}
              >
                <UserRound size={24} color="var(--primary-color)" />
              </div>
              <p style={{ fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)" }}>No patients found</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {patients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                return (
                  <div
                    key={patient.id}
                    onClick={() => onSelect(patient)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      border: `1px solid ${isSelected ? "var(--primary-color)" : "color-mix(in srgb, var(--primary-color) 15%, white)"}`,
                      backgroundColor: isSelected ? "color-mix(in srgb, var(--primary-color) 8%, white)" : "white",
                      padding: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Avatar className="h-12 w-12 shrink-0 border border-[color-mix(in srgb, var(--primary-color) 20%, white)]">
                      {patient.profile_picture && (
                        <AvatarImage src={patient.profile_picture} alt={patient.name} />
                      )}
                      <AvatarFallback className="bg-[color-mix(in srgb, var(--primary-color) 10%, white)] text-[var(--primary-color)] text-sm font-semibold">
                        {patient.name
                          ? patient.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                          : <UserRound size={18} />}
                      </AvatarFallback>
                    </Avatar>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {patient.name}
                        </p>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--primary-color)", backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)", borderRadius: "4px", padding: "1px 4px" }}>
                          {patient.relation}
                        </span>
                      </div>
                      <div style={{ marginTop: "4px", display: "flex", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>{patient.age} yrs</span>
                        <span style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize" }}>{patient.gender}</span>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0, paddingLeft: "8px" }}>
                      <div
                        style={{
                          height: "24px",
                          width: "24px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "var(--primary-color)" : "color-mix(in srgb, var(--primary-color) 25%, white)"}`,
                          backgroundColor: isSelected ? "var(--primary-color)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && <Check size={14} color="white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwitchPatientModal;