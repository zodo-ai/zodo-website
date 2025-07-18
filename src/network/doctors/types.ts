export interface SpecialisationI{
    name: string
}

export interface DoctorI {
    id: string;
    slug?: string | null;
    profile_pic: string | null;
    name: string;
    email: string;
    city: string | null;
    registration_details: any | null;
    address: any | null;
    bank_details: any | null;
    documents: any | null;
    hospital_id: string | null;
    user_id: string;
    phone_number: string;
    pricing: string | null;
    avg_rating: number | 0;
    specialisations : SpecialisationI[];
    about:string | null;
    work_start_date: string | null;
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

// For cases where API returns array directly
export type DoctorsDataI = DoctorI[] | DoctorsResponseI;
