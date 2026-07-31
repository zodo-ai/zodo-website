"use client";

import { useState } from "react";
import {
  Edit3,
  Loader2,
  Plus,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmModal from "@/components/ConfirmModal";
import ChildUserFormModal from "./ChildUserFormModal";
import ViewAllModal from "./ViewAllModal";
import useChildUsers from "@/hooks/child-users/use-child-users";
import { ChildUser, CreateChildUserPayload, UpdateChildUserPayload } from "@/types/child-user";

interface FamilyMembersCardProps {
  userId: string | undefined;
  isAuthenticated: boolean;
}

const FamilyMembersCard = ({
  userId,
  isAuthenticated,
}: FamilyMembersCardProps) => {
  const {
    childUsers,
    loading,
    totalItems,
    creating,
    updating,
    deleting,
    createChildUser,
    updateChildUser,
    deleteChildUser,
  } = useChildUsers({
    userId,
    autoFetch: isAuthenticated,
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingUser, setEditingUser] = useState<ChildUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ChildUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const displayedUsers = childUsers.slice(0, 3);
  const hasMore = totalItems > 3;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (user: ChildUser) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (
    data: CreateChildUserPayload
  ) => {
    let success = false;

    if (editingUser) {
      success = await updateChildUser(editingUser.id, data as UpdateChildUserPayload);
    } else {
      success = await createChildUser(data);
    }

    if (success) {
      handleCloseForm();
    }
  };

  const handleDeleteClick = (user: ChildUser) => {
    setDeletingUser(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    setDeletingId(deletingUser.id);
    const success = await deleteChildUser(deletingUser.id);

    if (success) {
      setShowDeleteConfirm(false);
      setDeletingUser(null);
    }
    setDeletingId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingUser(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Card className="rounded-lg border-[color-mix(in_srgb,var(--primary-color)_15%,white)] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">
              <Users size={22} />
              Family
            </CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              Manage family members and friends for bookings.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 hover:opacity-90 shrink-0" style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-[72px] rounded-xl" />
              <Skeleton className="h-[72px] rounded-xl" />
              <Skeleton className="h-[72px] rounded-xl" />
            </div>
          ) : childUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[color-mix(in_srgb,var(--primary-color)_25%,white)] bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary-color)_10%,white)]">
                <Users size={26} className="text-[var(--primary-color)]" />
              </div>
              <p className="font-semibold text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">
                No family members yet
              </p>
              <p className="mt-1.5 text-sm text-gray-500">
                Add your family and friends for easier bookings.
              </p>
              <Button
                onClick={handleOpenAdd}
                className="mt-5 gap-2 hover:opacity-90" style={{ backgroundColor: "var(--primary-color)", color: "white" }}
              >
                <Plus size={16} />
                Add Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedUsers.map((member) => (
                <div
                  key={member.id}
                  className="group flex items-center gap-3 rounded-lg border border-[color-mix(in_srgb,var(--primary-color)_15%,white)] bg-white p-3 transition-all hover:border-[color-mix(in_srgb,var(--primary-color)_30%,white)] hover:shadow-sm"
                >
                  <Avatar className="h-12 w-12 shrink-0 border border-[color-mix(in_srgb,var(--primary-color)_20%,white)]">
                    {member.profile_picture && (
                      <AvatarImage
                        src={member.profile_picture}
                        alt={member.fullname}
                      />
                    )}
                    <AvatarFallback className="bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] text-[var(--primary-color)] text-xs font-semibold">
                      {member.fullname ? (
                        getInitials(member.fullname)
                      ) : (
                        <UserRound size={16} />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">
                        {member.fullname}
                      </p>
                      <span className="inline-flex items-center rounded-sm bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] px-1 py-0.5 text-xs font-medium text-[var(--primary-color)]">
                        {member.relation}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">
                        {member.age} yrs
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {member.gender}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0 items-center transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--primary-color)] cursor-pointer transition-all disabled:opacity-50"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(member)}
                      disabled={deletingId === member.id}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 cursor-pointer transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === member.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {hasMore && (
                <Button
                  variant="outline"
                  className="mt-1 w-full hover:opacity-80"
                  style={{ borderColor: "color-mix(in srgb, var(--primary-color) 30%, white)", color: "var(--primary-color)" }}
                  onClick={() => setShowViewAllModal(true)}
                >
                  View All ({totalItems})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal (Create/Edit) */}
      <ChildUserFormModal
        open={showFormModal}
        editingUser={editingUser}
        saving={creating || updating}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* View All Modal */}
      <ViewAllModal
        open={showViewAllModal}
        childUsers={childUsers}
        loading={loading}
        deletingId={deletingId}
        onClose={() => setShowViewAllModal(false)}
        onAdd={() => {
          setShowViewAllModal(false);
          handleOpenAdd();
        }}
        onEdit={(user) => {
          setShowViewAllModal(false);
          handleOpenEdit(user);
        }}
        onDelete={(user) => {
          setShowViewAllModal(false);
          handleDeleteClick(user);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteConfirm}
        title="Remove Family Member?"
        description={`Are you sure you want to remove ${deletingUser?.fullname || "this member"}? This action cannot be undone.`}
        confirmText="Remove"
        destructive
        loading={deleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default FamilyMembersCard;
