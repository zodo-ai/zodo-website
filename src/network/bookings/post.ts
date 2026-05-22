import { apiCall } from "../api";
import { BookingI, BookingMetaDataI } from "./types";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  const accessToken = localStorage.getItem("accessToken");

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {};
};

export interface CalculateBookingAmountPayload {
  doctor_id?: string;
  hospital_service_id?: string;
  is_fast_tag: boolean;
  coupon_id?: string;
}

export type CalculateBookingAmountResponse = Required<
  Pick<
    BookingMetaDataI,
    | "fee"
    | "platform_fee"
    | "total"
    | "discount"
    | "currency"
    | "coupon_code"
    | "coupon_id"
  >
>;

export interface BaseBookingPayload {
  hospital_id?: string | null;

  user_details: {
    name: string;
    age: number;
    gender: string;
  };

  appointmentDate: string;

  reason: string;

  is_service: boolean;

  amount: string;

  coupon_id?: string | null;

  meta_data: CalculateBookingAmountResponse;

  isWeb: true;

  successCallback: string;

  errorCallback: string;
}

/* Doctor Booking Payload */
export interface CreateDoctorBookingPayload
  extends BaseBookingPayload {

  doctor_id: string;

  is_online: false;
}

/* Hospital Service Booking Payload */
export interface CreateHospitalServiceBookingPayload
  extends BaseBookingPayload {

  hospital_service_id: string;
}

export interface CreateBookingResponse {
  status: boolean;
  message: string;
  data: {
    transaction_id: string;
    booking: BookingI;
    paymentOrder?: {
      payment_link?: string;
      link_status?: string;
      mode?: string;
      order_id?: string;
    };
  };
}

export const calculateBookingAmountAPI = async (
  payload: CalculateBookingAmountPayload
): Promise<CalculateBookingAmountResponse> => {
  return await apiCall("bookings/calculate-amount", "POST", {
    payload,
    headers: getAuthHeaders(),
  });
};

export const createBookingAPI = async (
  payload: CreateDoctorBookingPayload
): Promise<CreateBookingResponse> => {
  return await apiCall("bookings", "POST", {
    payload,
    headers: getAuthHeaders(),
  });
};

export const createHospitalServiceBookingAPI = async (
  payload: CreateHospitalServiceBookingPayload
): Promise<CreateBookingResponse> => {
  return await apiCall(
    "bookings/hospital-service",
    "POST",
    {
      payload,
      headers: getAuthHeaders(),
    }
  );
};
