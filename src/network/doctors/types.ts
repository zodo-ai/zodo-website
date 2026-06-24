export interface SpecialisationI {
  id?: string;
  name: string;
  image?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorHospitalI {
  id: string;
  name: string;
  logo: string;
  location: string;
  address?: {
    city?: string;
    state?: string;
    street?: string;
    lineOne?: string;
    lineTwo?: string;
    pincode?: string;
    district?: string;
  } | null;
  contact_details?: {
    email?: string;
    mobile?: string;
    website?: string;
  } | null;
  slug?: string | null;
  about?: string;
  status?: string;
  total_rating?: string;
  avg_rating?: string;
  rating_count?: number;
}

export interface DoctorI {
  id: string;
  slug?: string | null;
  profile_pic: string | null;
  name: string;
  email: string;
  city: string | null;
  registration_details: unknown | null;
  address: unknown | null;
  bank_details: unknown | null;
  documents: unknown | null;
  hospital_id: string | null;
  user_id: string;
  phone_number: string;
  pricing: string | null;
  avg_rating: number | 0;
  total_rating?: string;
  rating_count?: number;
  specialisations: SpecialisationI[];
  about: string | null;
  work_start_date: string | "";
  status?: string;
  consultation_duration?: number | null;
  auto_booking_enabled?: boolean;
  hospital?: DoctorHospitalI | null;
  appointment_type?: string;
}
export interface UserI {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface ReviewI {
  id: string;
  slug?: string | null;
  rating: string | null;
  review_note: string | null;
  user: UserI;
}

interface TimeSlotDataI {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  // Add unknown other properties that each individual time slot object has
}

export interface TimeSlotI {
  data: TimeSlotDataI[];
  message: string;
  profile_picture: string;
  time: string
}

export interface DoctorsResponseI {
  data?: DoctorI[];
  meta?: {
    itemsPerPage?: number;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    sortBy?: string[][];
  };
  links?: {
    current?: string;
  };
}

export interface TimeSlotResponseI {
  data?: TimeSlotI[];
  message?: string | "";
}

export interface ReviewResponseI {
  data?: ReviewI[];
  meta?: {
    itemsPerPage?: number;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    sortBy?: string[][];
  };
  links?: {
    current?: string;
  };
}

// For cases where API returns array directly
export type DoctorsDataI = DoctorI[] | DoctorsResponseI;
export type ReviewsDataI = ReviewI[] | ReviewResponseI;