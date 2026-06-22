import { fetchHospitalServiceDetailAPI } from "@/network/hospital-services/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import ServiceDetailClient from "./ServiceDetailClient";

interface PageProps {
  params: Promise<{ hospital_id: string; id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { hospital_id, id } = await params;

  // Fetch service detail by ID
  const service = await fetchHospitalServiceDetailAPI(id).catch(() => null);

  if (!service) {
    return (
      <main style={{ padding: "80px 24px", textAlign: "center", minHeight: "60vh" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#102a43", marginBottom: 8 }}>
          Service not found
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          The service you are looking for does not exist or has been removed.
        </p>
      </main>
    );
  }

  // Fetch hospital detail for the info strip
  const hospital = await fetchHospitalByIdAPI(hospital_id).catch(() => null);

  return (
    <ServiceDetailClient
      service={service}
      hospital={hospital}
      hospitalSlug={hospital_id}
    />
  );
}
