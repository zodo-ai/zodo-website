export interface DistrictI {
    id: string;
    name: string;
    state?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DistrictsResponseI {
    data: DistrictI[];
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}
