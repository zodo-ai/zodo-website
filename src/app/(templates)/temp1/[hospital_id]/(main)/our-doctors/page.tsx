import { Suspense } from "react";
import { fetchDoctorsAPI } from "@/network/doctors/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { fetchHospitalStats } from "@/network/hospital-web/get";
import { fetchSpecialisationsAPI } from "@/network/specialisations/get";
import { DoctorI, DoctorsResponseI, SpecialisationI } from "@/network/doctors/types";
import { SpecialisationsResponseI } from "@/network/specialisations/types";
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

  // Fetch initial doctors (page 1)
  const doctorsData = await fetchDoctorsAPI({
    hospital_id: trueHospitalId,
    limit: 10,
    page: 1,
  }).catch(() => null);

  // Normalize doctors data
  const doctors: DoctorI[] = Array.isArray(doctorsData)
    ? doctorsData
    : (doctorsData as DoctorsResponseI)?.data ?? [];

  const meta = !Array.isArray(doctorsData)
    ? (doctorsData as DoctorsResponseI)?.meta
    : undefined;

  // Fetch specialisations for the dropdown
  const specData = await fetchSpecialisationsAPI({ limit: 100 }).catch(() => null);
  const specialisations: SpecialisationI[] = Array.isArray(specData)
    ? specData
    : (specData as SpecialisationsResponseI)?.data ?? [];

  const stats = await fetchHospitalStats(hospital_id).catch(() => undefined);

  return (
    <Suspense>
      <DoctorsListingClient
        initialDoctors={doctors}
        initialMeta={meta}
        hospitalSlug={hospital_id}
        hospitalId={trueHospitalId}
        specialisations={specialisations}
        stats={stats}
      />
    </Suspense>
  );
}
