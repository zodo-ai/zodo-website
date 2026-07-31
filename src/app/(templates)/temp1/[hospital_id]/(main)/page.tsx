import { HeroSection } from "../../components/HeroSection";
import { SearchSection } from "../../components/SearchSection";
import { StatsSection } from "../../components/StatsSection";
import { AboutSection } from "../../components/AboutSection";
import { DoctorsSection } from "../../components/DoctorsSection";
import { DirectorMessage } from "../../components/DirectorMessage";
import { DepartmentsSection } from "../../components/DepartmentsSection";
import { ServicesSection } from "../../components/ServicesSection";
import { TestimonialsSection } from "../../components/TestimonialsSection";
import { GallerySection } from "../../components/GallerySection";

import { fetchHospitalWebFull } from "@/network/hospital-web/get";
import { fetchDoctorsAPI } from "@/network/doctors/get";
import { fetchHospitalServicesAPI } from "@/network/hospital-services/get";
import { fetchMultipleDepartments } from "@/network/departments/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { fetchSpecialisationsAPI } from "@/network/specialisations/get";
import { DoctorI, SpecialisationI } from "@/network/doctors/types";
import { SpecialisationsResponseI } from "@/network/specialisations/types";
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
  const [hospitalWebData, doctorsData, servicesData, specData] = await Promise.all([
    fetchHospitalWebFull(trueHospitalId).catch(() => null),
    fetchDoctorsAPI({ hospital_id: trueHospitalId, limit: 10 }).catch(
      () => null
    ),
    fetchHospitalServicesAPI({ hospital_id: trueHospitalId, limit: 10 }).catch(
      () => null
    ),
    fetchSpecialisationsAPI({ limit: 100 }).catch(() => null),
  ]);

  // Normalize specialisations data
  const specialisations: SpecialisationI[] = Array.isArray(specData)
    ? specData
    : (specData as SpecialisationsResponseI)?.data ?? [];

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
  const gallery = hospitalWebData?.gallery ?? [];
  const testimonials = hospitalWebData?.testimonials ?? [];

  // Use hospital detail name, fallback to settings title
  const hospitalName =
    hospitalDetail?.name ?? settings?.title ?? "Hospital";

  return (
    <main>
      <HeroSection
        title={settings?.title ?? "Welcome"}
        description={settings?.description ?? ""}
        banners={banners}
      />
      <SearchSection hospitalSlug={hospital_id} specialisations={specialisations} />
      <StatsSection />
      <AboutSection
        hospitalName={hospitalName}
        aboutUs={settings?.about_us ?? ""}
        aboutUsImage={settings?.about_us_image ?? ""}
      />
      <DoctorsSection doctors={doctors} hospitalId={hospital_id} />
      <DirectorMessage
        directorName={settings?.director_name}
        directorTitle={settings?.director_title}
        directorMessage={settings?.director_message}
        directorImage={settings?.director_image}
      />
      <DepartmentsSection departments={departments} hospitalId={hospital_id} />
      <ServicesSection services={services} hospitalId={hospital_id} />
      <GallerySection gallery={gallery} hospitalName={hospitalName} />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
