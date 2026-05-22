export interface HospitalServiceI {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    strike_through_price: string;
    hospital_id: string;
    district_id: string;
    daily_booking_count: number;
}

export interface HospitalServicesResponseI {
    data?: HospitalServiceI[];
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

export interface HospitalServiceDetailResponseI {
    status: boolean;

    message: string;

    data: HospitalServiceI;
}

export type HospitalServicesDataI =
    | HospitalServiceI[]
    | HospitalServicesResponseI;