import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { SearchSection } from "../components/SearchSection";
import { StatsSection } from "../components/StatsSection";
import { AboutSection } from "../components/AboutSection";
import { DoctorsSection } from "../components/DoctorsSection";
import { DirectorMessage } from "../components/DirectorMessage";
import { DepartmentsSection } from "../components/DepartmentsSection";
import { ServicesSection } from "../components/ServicesSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { Footer } from "../components/Footer";

import { fetchHospitalWebFull } from "@/network/hospital-web/get";
import { fetchDoctorsAPI } from "@/network/doctors/get";
import { fetchHospitalServicesAPI } from "@/network/hospital-services/get";
import { fetchMultipleDepartments } from "@/network/departments/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { DoctorI } from "@/network/doctors/types";
import { HospitalServiceI } from "@/network/hospital-services/types";

interface PageProps {
  params: Promise<{ hospital_id: string }>;
}

export default async function HospitalPage({ params }: PageProps) {
  const { hospital_id } = await params;

  // First fetch hospital detail by slug (or ID) to get the true UUID
  const hospitalDetail = await fetchHospitalByIdAPI(hospital_id).catch(
    () => null
  );

  // If no hospital detail found, maybe fallback or return 404. We'll proceed with the provided ID just in case.
  const trueHospitalId = hospitalDetail?.id || hospital_id;

  // Fetch all other data using the true UUID
  const [hospitalWebData, doctorsData, servicesData] = await Promise.all([
    fetchHospitalWebFull(trueHospitalId).catch(() => null),
    fetchDoctorsAPI({ hospital_id: trueHospitalId, limit: 10 }).catch(
      () => null
    ),
    fetchHospitalServicesAPI({ hospital_id: trueHospitalId, limit: 10 }).catch(
      () => null
    ),
  ]);

  // Resolve department details from IDs
  const departmentIds =
    hospitalWebData?.settings?.available_departments ?? [];
  const departments =
    departmentIds.length > 0
      ? await fetchMultipleDepartments(departmentIds)
      : [];

  // Normalize doctors data (API may return array or { data: [] })
  const doctors: DoctorI[] = Array.isArray(doctorsData)
    ? doctorsData
    : (doctorsData as { data?: DoctorI[] })?.data ?? [];

  // Normalize services data
  const services: HospitalServiceI[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as { data?: HospitalServiceI[] })?.data ?? [];

  const settings = hospitalWebData?.settings;
  const banners = hospitalWebData?.banners ?? [];
  const testimonials = hospitalWebData?.testimonials ?? [];

  // Use hospital detail name, fallback to settings title
  const hospitalName =
    hospitalDetail?.name ?? settings?.title ?? "Hospital";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Header hospitalName={hospitalName} />

      <main>
        <HeroSection
          title={settings?.title ?? "Welcome"}
          description={settings?.description ?? ""}
          banners={banners}
        />
        <SearchSection />
        <StatsSection />
        <AboutSection
          hospitalName={hospitalName}
          aboutUs={settings?.about_us ?? ""}
        />
        <DoctorsSection doctors={doctors} />
        <DirectorMessage />
        <DepartmentsSection departments={departments} />
        <ServicesSection services={services} />
        <TestimonialsSection testimonials={testimonials} />
      </main>

      <Footer settings={settings ?? null} hospitalName={hospitalName} />
    </div>
  );
}
