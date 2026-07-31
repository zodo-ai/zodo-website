export interface BookingMetaDataI {
  fee?: number;
  total?: number;
  currency?: string;
  discount?: number;
  coupon_id?: string | null;
  coupon_code?: string | null;
  platform_fee?: number;
}

export interface BookingUserDetailsI {
  age?: number | null;
  name?: string | null;
  gender?: string | null;
}

export interface BookingDoctorI {
  id: string;
  profile_pic?: string | null;
  name?: string | null;
  about?: string | null;
  email?: string | null;
  city?: string | null;
  slug?: string | null;
  status?: string | null;
  registration_details?: {
    council_name?: string | null;
    qualification?: string | null;
    registration_number?: string | null;
  } | null;
  address?: string | null;
  hospital_id?: string | null;
  user_id?: string | null;
  phone_number?: string | null;
  pricing?: string | null;
  work_start_date?: string | null;
  total_rating?: string | null;
  avg_rating?: string | null;
  rating_count?: number;
  auto_booking_enabled?: boolean;
  consultation_duration?: number | null;
  from_web?: boolean;
}

export interface BookingHospitalServiceI {
  id: string;

  name?: string | null;

  description?: string | null;

  image?: string | null;

  price?: string | null;

  strike_through_price?: string | null;

  hospital_id?: string | null;
}

export interface BookingI {
  id: string;
  booking_id: string;
  meta_data?: BookingMetaDataI | null;
  created_by?: string | null;
  appointmentDate: string;
  completed_at?: string | null;
  timeSlot?: string | null;
  hospital_id?: string | null;
  doctor_id?: string | null;
  hospital_service_id?: string | null;
  patient_note?: string | null;
  user_id?: string | null;
  child_user_id?: string | null;
  user_details?: BookingUserDetailsI | null;
  status?: string | null;
  prescriptionUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  type?: string | null;
  is_fast_tag?: boolean;
  reason?: string | null;
  amount?: string | null;
  is_online?: boolean;
  token_number?: number | null;
  payment_type?: string | null;
  hospital?: unknown;
  doctor?: BookingDoctorI | null;
  hospitalService?: BookingHospitalServiceI | null;
}

export interface BookingsMetaI {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: string[][];
}

export interface BookingsLinksI {
  current?: string;
  next?: string;
  last?: string;
  previous?: string;
}

export interface MyBookingsResponseI {
  data: BookingI[];
  meta: BookingsMetaI;
  links?: BookingsLinksI;
}
