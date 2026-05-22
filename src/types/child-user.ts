export interface ChildUser {
  id: string;
  fullname: string;
  profile_picture: string;
  gender: string;
  age: number;
  relation: string;
  appointment_details: unknown | null;
  files: unknown | null;
  user_id: string;
}

export interface CreateChildUserPayload {
  fullname: string;
  gender: string;
  age: number;
  relation: string;
  profile_picture: string;
}

export interface UpdateChildUserPayload {
  fullname: string;
  gender: string;
  age: number;
  relation: string;
  profile_picture: string;
}

export interface ChildUserMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [string, string][];
}

export interface FetchChildUsersResponse {
  data: ChildUser[];
  meta: ChildUserMeta;
  links: {
    current: string;
  };
}

export interface CreateChildUserResponse {
  status: string;
  message: string;
  data: ChildUser;
}

export interface UpdateChildUserResponse {
  status: boolean;
  message: string;
  data: ChildUser;
}

export interface DeleteChildUserResponse {
  status: boolean;
  message: string;
}

export interface GetChildUserByIdResponse {
  status: boolean;
  message: string;
  data: ChildUser;
}
