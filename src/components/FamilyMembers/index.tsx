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
      <Card className="rounded-lg border-[#E0ECE9] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-[#173F3A]">
              <Users size={22} />
              Family
            </CardTitle>
            <p className="mt-2 text-sm text-[#6B7C80]">
              Manage family members and friends for bookings.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 bg-[#1D453F] hover:bg-[#173A35] shrink-0"
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
            <div className="rounded-lg border border-dashed border-[#C9DCD8] bg-[#F8FBFA] p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF5F2]">
                <Users size={26} className="text-[#347D73]" />
              </div>
              <p className="font-semibold text-[#173F3A]">
                No family members yet
              </p>
              <p className="mt-1.5 text-sm text-[#6B7C80]">
                Add your family and friends for easier bookings.
              </p>
              <Button
                onClick={handleOpenAdd}
                className="mt-5 gap-2 bg-[#1D453F] hover:bg-[#173A35]"
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
                  className="group flex items-center gap-3 rounded-lg border border-[#E6EEEC] bg-white p-3 transition-all hover:border-[#B7D5D0] hover:shadow-sm"
                >
                  <Avatar className="h-12 w-12 shrink-0 border border-[#DCE9E6]">
                    {member.profile_picture && (
                      <AvatarImage
                        src={member.profile_picture}
                        alt={member.fullname}
                      />
                    )}
                    <AvatarFallback className="bg-[#EAF5F2] text-[#1D453F] text-xs font-semibold">
                      {member.fullname ? (
                        getInitials(member.fullname)
                      ) : (
                        <UserRound size={16} />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-[#173F3A]">
                        {member.fullname}
                      </p>
                      <span className="inline-flex items-center rounded-sm bg-[#EAF5F2] px-1 py-0.5 text-xs font-medium text-[#1D453F]">
                        {member.relation}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-xs text-[#7B8E92]">
                        {member.age} yrs
                      </span>
                      <span className="text-xs text-[#7B8E92] capitalize">
                        {member.gender}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0 items-center transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#1D453F] cursor-pointer transition-all disabled:opacity-50"
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
                  className="mt-1 w-full border-[#B7D5D0] text-[#1D453F] hover:bg-[#F4F8F7]"
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
