import { useState, useEffect } from 'react';
import { fetchDistrictsAPI } from '@/network/districts/get';
import { DistrictI } from '@/network/districts/types';
import { showToast } from '@/lib/toast';

export interface UseDistrictsReturn {
    districts: DistrictI[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

const useDistricts = (): UseDistrictsReturn => {
    const [districts, setDistricts] = useState<DistrictI[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDistricts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchDistrictsAPI();
            setDistricts(response.data || response as any); // Handle different response formats
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch districts';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching districts:', err);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchDistricts();
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    return {
        districts,
        loading,
        error,
        refresh,
    };
};

export default useDistricts;
