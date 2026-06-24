import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { fetchHospitalWebFull } from "@/network/hospital-web/get";
import Temp1AuthClient from "./Temp1AuthClient";

interface PageProps {
  params: Promise<{ hospital_id: string }>;
}

export default async function Temp1AuthPage({ params }: PageProps) {
  const { hospital_id } = await params;

  // Fetch hospital detail to get name and true UUID
  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  // Fetch hospital web settings
  const hospitalWebData = await fetchHospitalWebFull(trueHospitalId).catch(
    () => null
  );

  const settings = hospitalWebData?.settings ?? null;
  const hospitalName = hospitalDetail?.name ?? settings?.title ?? "Hospital";

  return (
    <Temp1AuthClient
      hospitalName={hospitalName}
      logoImage={settings?.logo_image}
      primaryColor={settings?.primary_color || "#1a8b5e"}
      hospitalSlug={hospital_id}
    />
  );
}
