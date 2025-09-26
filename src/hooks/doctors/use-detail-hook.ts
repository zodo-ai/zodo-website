import { useState, useEffect } from 'react';
import { fetchDoctorDetailAPI } from '@/network/doctors/get';
import { DoctorI } from '@/network/doctors/types';
import { showToast } from '@/lib/toast';

export interface UseDoctorDetailReturn {
    doctor: DoctorI | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

const useDoctorDetail = (doctorId: string): UseDoctorDetailReturn => {
    const [doctor, setDoctor] = useState<DoctorI | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctorDetail = async () => {
        if (!doctorId) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await fetchDoctorDetailAPI(doctorId);
            setDoctor(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor details';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching doctor details:', err);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchDoctorDetail();
    };

    useEffect(() => {
        fetchDoctorDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctorId]);

    return {
        doctor,
        loading,
        error,
        refresh,
    };
};

export default useDoctorDetail;
