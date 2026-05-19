export interface ValidateCouponPayload {
  coupon_code: string;
  user_id: string;
  amount: number;
}

export interface CouponI {
  id: string;
  coupon_code: string;
  discount_type?: string;
  valid_untill?: string;
  minimum_cart_amount?: string;
  minimum_discount_allowed?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
  usage_count?: number;
  hospital_id?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ValidateCouponResponse {
  is_valid: boolean;
  message: string;
  discount?: unknown;
  coupon?: CouponI;
  status?: boolean;
  validationErrors?: string;
}
