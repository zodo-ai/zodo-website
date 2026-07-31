import { fetchHospitalWebFull } from "@/network/hospital-web/get";
import { fetchMultipleDepartments } from "@/network/departments/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { DepartmentI } from "@/network/departments/types";
import DepartmentsListingClient from "./DepartmentsListingClient";

interface PageProps {
  params: Promise<{ hospital_id: string }>;
}

export default async function OurDepartmentsPage({ params }: PageProps) {
  const { hospital_id } = await params;

  // First fetch hospital detail to get the true UUID
  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  // Fetch hospital web settings to get the list of available department IDs
  const hospitalWebData = await fetchHospitalWebFull(trueHospitalId).catch(
    () => null
  );

  // Resolve department details from IDs
  const departmentIds =
    hospitalWebData?.settings?.available_departments ?? [];
  const departmentsData =
    departmentIds.length > 0
      ? await fetchMultipleDepartments(departmentIds)
      : [];

  const departments: DepartmentI[] = Array.isArray(departmentsData)
    ? departmentsData
    : [];

  return <DepartmentsListingClient departments={departments} />;
}
