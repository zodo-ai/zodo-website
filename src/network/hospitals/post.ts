import { apiCall } from "../api";

export interface CreateHospitalPayload {
  name: string;
  logo: string;
  location: string;
  address: {
    lineOne: string;
    lineTwo: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    street: string;
  };
  billing_address: {
    lineOne: string;
    lineTwo: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    street: string;
  };
  admin: {
    name: string;
    email: string;
    password: string;
  };
  fastTag: {
    enabled: boolean;
    count: number;
    price: number;
  };
  bank_details: {
    account_number: string;
    account_holder: string;
    ifsc: string;
    bank_name: string;
    upi_id: string;
  };
  contact_details: {
    email: string;
    mobile: string;
    website: string;
  };
  gst: string;
  documents: any[];
  status: string;
  from_web: boolean;
}

export interface CreateHospitalResponse {
  message: string;
  data?: any;
}

export const createHospitalAPI = async (
  payload: CreateHospitalPayload
): Promise<CreateHospitalResponse> => {
  return await apiCall("hospitals", "POST", { payload });
};