import { fetchDoctorDetailAPI, fetchDoctorTimeslotsAPI, fetchReviewsAPI } from "@/network/doctors/get";
import { fetchHospitalByIdAPI } from "@/network/hospitals/get";
import { DoctorI, ReviewI, ReviewResponseI, TimeSlotI } from "@/network/doctors/types";
import DoctorDetailClient from "./DoctorDetailClient";

interface PageProps {
  params: Promise<{ hospital_id: string; id: string }>;
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { hospital_id, id } = await params;

  // Fetch doctor detail by slug (id param is the slug)
  const doctor: DoctorI | null = await fetchDoctorDetailAPI(id).catch(() => null);

  if (!doctor) {
    return (
      <main style={{ padding: "80px 24px", textAlign: "center", minHeight: "60vh" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#102a43", marginBottom: 8 }}>
          Doctor not found
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          The doctor profile you are looking for does not exist or has been removed.
        </p>
      </main>
    );
  }

  // Fetch timeslots and reviews in parallel
  const [timeslots, reviewsData] = await Promise.all([
    fetchDoctorTimeslotsAPI(doctor.id).catch(() => null),
    fetchReviewsAPI({ doctor_id: doctor.id, limit: 50 }).catch(() => null),
  ]);

  // Normalize reviews data (API may return array or { data: [] })
  const reviews: ReviewI[] = Array.isArray(reviewsData)
    ? reviewsData
    : (reviewsData as ReviewResponseI)?.data ?? [];

  return (
    <DoctorDetailClient
      doctor={doctor}
      timeslots={timeslots}
      reviews={reviews}
      hospitalSlug={hospital_id}
    />
  );
}
