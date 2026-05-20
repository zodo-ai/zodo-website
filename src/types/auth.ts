export interface LoginPhonePayload {
  phone_number: string;
}

export type Gender = 'male' | 'female' | 'other';

export interface AuthUser {
  id: string;
  phone_number?: string | null;
  phone?: string | null;
  user_type: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  profile_picture?: string | null;
  district_id?: string | null;
  gender?: Gender | null;
  age?: number | null;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string;
  email: string | null;
  phone: string | null;
  password: string | null;
  is_active: boolean;
  hospital_id: string | null;
  district_id: string | null;
  job_title: string | null;
  profile_picture: string | null;
  otp_secret: string | null;
  otp_secret_forgot_password: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  gender: Gender | null;
  age: number | null;
}

export interface GetUserProfileResponse {
  status: boolean;
  message: string;
  data: {
    data?: UserProfile;
  } & Partial<UserProfile>;
}

export interface LoginPhoneResponse {
  status: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export interface VerifyOTPPayload {
  user_id: string;
  otp: string;
}

export interface VerifyOTPResponse {
  status: boolean;
  message: string;
  data: {
    new_user: boolean;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: AuthUser;
  };
}

export interface UpdateUserPayload {
  age: number;
  first_name: string;
  last_name: string;
  district_id: string;
  gender: Gender;
  profile_picture?: string;
}

export interface UpdateUserResponse {
  status: boolean;
  message: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (phoneNumber: string) => Promise<void>;
  verifyOTP: (userId: string, otp: string) => Promise<void>;
  updateUserProfile: (userId: string, data: UpdateUserPayload) => Promise<void>;
  logout: () => void;
}
