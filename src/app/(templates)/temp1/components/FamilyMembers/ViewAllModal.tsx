"use client";

import { Edit3, Loader2, Plus, Trash2, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChildUser } from "@/types/child-user";
import { useEffect } from "react";

interface ViewAllModalProps {
  open: boolean;
  childUsers: ChildUser[];
  loading: boolean;
  deletingId: string | null;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (user: ChildUser) => void;
  onDelete: (user: ChildUser) => void;
}

const ViewAllModal = ({
  open,
  childUsers,
  loading,
  deletingId,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: ViewAllModalProps) => {
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
        aria-labelledby="view-all-family-title"
        style={{
          width: "min(90%, 500px)",
          height: "90dvh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid #DCE9E6",
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
            borderBottom: "1px solid #E6EEEC",
            backgroundColor: "white",
            padding: "16px 24px",
          }}
        >
          <div>
            <h2
              id="view-all-family-title"
              style={{ fontSize: "18px", fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)", margin: 0 }}
            >
              Family Members
            </h2>
            <p style={{ fontSize: "12px", color: "#7B8E92", marginTop: "2px" }}>
              {childUsers.length} member{childUsers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button
              size="sm"
              onClick={onAdd}
              className="gap-1.5 hover:opacity-90 text-xs h-8" style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            >
              <Plus size={14} />
              Add
            </Button>
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
                color: "#6B7C80",
              }}
            >
              <X size={20} />
            </button>
          </div>
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
          ) : childUsers.length === 0 ? (
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
              <p style={{ fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)" }}>No family members yet</p>
              <p style={{ marginTop: "4px", fontSize: "14px", color: "#6B7C80" }}>
                Add your family and friends for easier bookings.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {childUsers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderRadius: "12px",
                    border: "1px solid #E6EEEC",
                    backgroundColor: "white",
                    padding: "12px",
                  }}
                >
                  <Avatar className="h-12 w-12 shrink-0 border border-[color-mix(in_srgb,var(--primary-color)_20%,white)]">
                    {member.profile_picture && (
                      <AvatarImage src={member.profile_picture} alt={member.fullname} />
                    )}
                    <AvatarFallback className="bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] text-[var(--primary-color)] text-sm font-semibold">
                      {member.fullname
                        ? member.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                        : <UserRound size={18} />}
                    </AvatarFallback>
                  </Avatar>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "color-mix(in srgb, var(--primary-color) 80%, black)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {member.fullname}
                      </p>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--primary-color)", backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)", borderRadius: "4px", padding: "1px 4px" }}>
                        {member.relation}
                      </span>
                    </div>
                    <div style={{ marginTop: "4px", display: "flex", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#7B8E92" }}>{member.age} yrs</span>
                      <span style={{ fontSize: "12px", color: "#7B8E92", textTransform: "capitalize" }}>{member.gender}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                    <button
                      onClick={() => onEdit(member)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "32px", width: "32px", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", color: "#6B7C80" }}
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(member)}
                      disabled={deletingId === member.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "32px", width: "32px", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", color: "#6B7C80", opacity: deletingId === member.id ? 0.5 : 1 }}
                      title="Delete"
                    >
                      {deletingId === member.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllModal;