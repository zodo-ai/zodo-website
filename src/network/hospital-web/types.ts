export interface HospitalWebSettings {
  id: string;
  hospital_id: string;
  title: string;
  description: string;
  about_us: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  available_departments: string[];
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalWebBanner {
  id: string;
  hospital_id: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  hospital_id: string;
  image: string;
  caption: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface TestimonialItem {
  id: string;
  hospital_id: string;
  patient_name: string;
  patient_image: string;
  rating: string;
  message: string;
  designation: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface HospitalWebFullResponse {
  settings: HospitalWebSettings;
  banners: HospitalWebBanner[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
}
