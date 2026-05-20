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
  doctor_id: string;
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

export interface CreateBookingPayload {
  doctor_id: string;
  hospital_id?: string | null;
  user_details: {
    name: string;
    age: number;
    gender: string;
  };
  appointmentDate: string;
  reason: string;
  is_online: false;
  is_service: false;
  amount: string;
  coupon_id?: string | null;
  meta_data: CalculateBookingAmountResponse;
  isWeb: true;
  successCallback: string;
  errorCallback: string;
}

export interface CreateBookingResponse {
  status: boolean;
  message: string;
  data: {
    transaction_id: string;
    booking: BookingI;
    paymentOrder?: {
      checkout_url?: string;
      payment_session_id?: string;
      order_id?: string;
      order_amount?: number;
      order_currency?: string;
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
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> => {
  return await apiCall("bookings", "POST", {
    payload,
    headers: getAuthHeaders(),
  });
};
