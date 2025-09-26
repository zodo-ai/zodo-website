export type HospitalDataI = {
  data: HospitalsI[];
  meta: MetaI;
  links: LinksI;
};

type LinksI = {
  current: string;
};

type MetaI = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
};

export type HospitalsI = {
  id: string;
  name: string;
  logo: string;
  location: string;
  address: AddressI;
  contact_details: ContactDetailsI;
  billing_address: AddressI;
  gst: string;
  website: null;
  ratings: null;
  feedbacks: null;
  parent_id: null;
  fastTag: FastTagI;
  departments: null;
  status: string;
  isDisabled: boolean;
  from_web: boolean;
  slug: null | string;
  isDeactivated: boolean;
  district_id: null;
  is_fast_tag_enabled: null;
  auto_booking_enabled: boolean;
  bank_details: BankDetailsI;
  total_rating: string;
  avg_rating: string;
  rating_count: number;
  created_at: string;
  about: string;
};

// Hospital detail response type
export interface HospitalDetailResponseI {
  data: HospitalsI;
}

type BankDetailsI = {
  ifsc: string;
  upi_id: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
};

type FastTagI = {
  count: number;
  price: number;
  enabled: boolean;
};

type ContactDetailsI = {
  email: string;
  mobile: string;
  website: string;
};

type AddressI = {
  city: string;
  state: string;
  street: string;
  lineOne: string;
  lineTwo: string;
  pincode: string;
  district: string;
};