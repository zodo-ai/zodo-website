import { fetchDoctorsAPI } from "@/network/doctors/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { DoctorI, DoctorsResponseI } from "@/network/doctors/types";
import DoctorsListingClient from "./DoctorsListingClient";

interface PageProps {
  params: Promise<{ hospital_id: string }>;
}

export default async function OurDoctorsPage({ params }: PageProps) {
  const { hospital_id } = await params;

  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  const doctorsData = await fetchDoctorsAPI({
    hospital_id: trueHospitalId,
    limit: 100,
  }).catch(() => null);

  // Normalize doctors data (API may return array or { data: [] })
  const doctors: DoctorI[] = Array.isArray(doctorsData)
    ? doctorsData
    : (doctorsData as DoctorsResponseI)?.data ?? [];

  return <DoctorsListingClient doctors={doctors} hospitalSlug={hospital_id} />;
}
