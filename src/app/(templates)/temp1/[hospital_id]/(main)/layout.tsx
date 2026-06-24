import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { fetchHospitalWebFull } from "@/network/hospital-web/get";
import { fetchHospitalServicesAPI } from "@/network/hospital-services/get";
import { HospitalServiceI } from "@/network/hospital-services/types";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ hospital_id: string }>;
}

export default async function HospitalLayout({
  children,
  params,
}: LayoutProps) {
  const { hospital_id } = await params;

  // Fetch hospital detail to get name and true UUID
  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  // Fetch hospital web settings for footer
  const hospitalWebData = await fetchHospitalWebFull(trueHospitalId).catch(
    () => null
  );

  const servicesData = await fetchHospitalServicesAPI({ hospital_id: trueHospitalId, limit: 4 }).catch(() => null);
  const services: HospitalServiceI[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as any)?.data ?? [];

  const settings = hospitalWebData?.settings ?? null;
  const hospitalName =
    hospitalDetail?.name ?? settings?.title ?? "Hospital";

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      "--primary-color": settings?.primary_color || "#1a8b5e"
    } as React.CSSProperties}>
      <Header hospitalName={hospitalName} logoImage={settings?.logo_image} hospitalSlug={hospital_id} />
      {children}
      <Footer settings={settings} hospitalName={hospitalName} services={services} hospitalSlug={hospital_id} />
    </div>
  );
}
