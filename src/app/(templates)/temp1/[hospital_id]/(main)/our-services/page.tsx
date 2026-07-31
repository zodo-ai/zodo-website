import { Suspense } from "react";
import { fetchHospitalServicesAPI } from "@/network/hospital-services/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { HospitalServiceI, HospitalServicesResponseI } from "@/network/hospital-services/types";
import ServicesListingClient from "./ServicesListingClient";

interface PageProps {
  params: Promise<{ hospital_id: string }>;
}

export default async function OurServicesPage({ params }: PageProps) {
  const { hospital_id } = await params;

  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  // Fetch initial services (page 1)
  const servicesData = await fetchHospitalServicesAPI({
    hospital_id: trueHospitalId,
    limit: 10,
    page: 1,
  }).catch(() => null);

  // Normalize services data
  const services: HospitalServiceI[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as HospitalServicesResponseI)?.data ?? [];

  const meta = !Array.isArray(servicesData)
    ? (servicesData as HospitalServicesResponseI)?.meta
    : undefined;

  return (
    <Suspense>
      <ServicesListingClient
        initialServices={services}
        initialMeta={meta}
        hospitalSlug={hospital_id}
        hospitalId={trueHospitalId}
      />
    </Suspense>
  );
}
