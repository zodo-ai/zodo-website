import { apiCall } from "../api";
import { DepartmentI } from "./types";

export const fetchDepartmentDetail = async (
  departmentId: string
): Promise<DepartmentI> => {
  // Use departments/ not api/departments/ because BASE_URL includes /api/
  return await apiCall(
    `departments/${encodeURIComponent(departmentId)}`,
    "GET"
  );
};

export const fetchMultipleDepartments = async (
  departmentIds: string[]
): Promise<DepartmentI[]> => {
  const results = await Promise.allSettled(
    departmentIds.map((id) => fetchDepartmentDetail(id))
  );

  return results
    .filter(
      (result): result is PromiseFulfilledResult<DepartmentI> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
};
