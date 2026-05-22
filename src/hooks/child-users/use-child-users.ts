import { useCallback, useEffect, useState } from "react";
import {
  fetchChildUsersAPI,
  createChildUserAPI,
  updateChildUserAPI,
  deleteChildUserAPI,
} from "@/network/child-users";
import {
  ChildUser,
  CreateChildUserPayload,
  UpdateChildUserPayload,
} from "@/types/child-user";
import { showToast } from "@/lib/toast";

interface UseChildUsersOptions {
  userId: string | undefined;
  autoFetch?: boolean;
}

interface UseChildUsersReturn {
  childUsers: ChildUser[];
  loading: boolean;
  totalItems: number;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  refresh: () => void;
  createChildUser: (payload: CreateChildUserPayload) => Promise<boolean>;
  updateChildUser: (
    childUserId: string,
    payload: UpdateChildUserPayload
  ) => Promise<boolean>;
  deleteChildUser: (childUserId: string) => Promise<boolean>;
}

const useChildUsers = ({
  userId,
  autoFetch = true,
}: UseChildUsersOptions): UseChildUsersReturn => {
  const [childUsers, setChildUsers] = useState<ChildUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchChildUsers = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetchChildUsersAPI(userId, 50);
      setChildUsers(response.data || []);
      setTotalItems(response.meta?.totalItems || 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch family members";
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refresh = useCallback(() => {
    fetchChildUsers();
  }, [fetchChildUsers]);

  const createChildUser = useCallback(
    async (payload: CreateChildUserPayload): Promise<boolean> => {
      if (!userId) return false;

      try {
        setCreating(true);
        await createChildUserAPI(userId, payload);
        showToast({
          type: "success",
          message: "Family member added successfully",
        });
        await fetchChildUsers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add family member";
        showToast({
          type: "error",
          message: errorMessage,
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [userId, fetchChildUsers]
  );

  const updateChildUser = useCallback(
    async (
      childUserId: string,
      payload: UpdateChildUserPayload
    ): Promise<boolean> => {
      try {
        setUpdating(true);
        await updateChildUserAPI(childUserId, payload);
        showToast({
          type: "success",
          message: "Family member updated successfully",
        });
        await fetchChildUsers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update family member";
        showToast({
          type: "error",
          message: errorMessage,
        });
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchChildUsers]
  );

  const deleteChildUser = useCallback(
    async (childUserId: string): Promise<boolean> => {
      try {
        setDeleting(true);
        await deleteChildUserAPI(childUserId);
        showToast({
          type: "success",
          message: "Family member removed successfully",
        });
        await fetchChildUsers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to remove family member";
        showToast({
          type: "error",
          message: errorMessage,
        });
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [fetchChildUsers]
  );

  useEffect(() => {
    if (autoFetch && userId) {
      fetchChildUsers();
    }
  }, [autoFetch, userId, fetchChildUsers]);

  return {
    childUsers,
    loading,
    totalItems,
    creating,
    updating,
    deleting,
    refresh,
    createChildUser,
    updateChildUser,
    deleteChildUser,
  };
};

export default useChildUsers;
