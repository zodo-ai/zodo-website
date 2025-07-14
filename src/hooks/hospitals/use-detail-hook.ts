import { useState, useEffect } from 'react';
import { fetchHospitalDetailAPI } from '@/network/hospitals/get';
import { HospitalsI } from '@/network/hospitals/types';
import { showToast } from '@/lib/toast';
import { UseHospitalDetailReturn } from './types';

const useHospitalDetail = (hospitalId: string): UseHospitalDetailReturn => {
    const [hospital, setHospital] = useState<HospitalsI | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHospitalDetail = async () => {
        if (!hospitalId) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await fetchHospitalDetailAPI(hospitalId);
            setHospital(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospital details';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching hospital details:', err);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchHospitalDetail();
    };

    useEffect(() => {
        fetchHospitalDetail();
    }, [hospitalId]);

    return {
        hospital,
        loading,
        error,
        refresh,
    };
};

export default useHospitalDetail;
