import { useState, useEffect } from 'react';
import {  fetchDoctorTimeslotsAPI } from '@/network/doctors/get';
import { TimeSlotI } from '@/network/doctors/types';
import { showToast } from '@/lib/toast';

export interface UseTimeSlotDetailReturn {
    timeSlots: TimeSlotI | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

const useDoctorTimeslot = (doctorId: string): UseTimeSlotDetailReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeSlots,setTimeSlots] = useState<TimeSlotI | null>(null);
    const fetchTimeslotDetail = async () => {
        if (!doctorId) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await fetchDoctorTimeslotsAPI(doctorId);
            setTimeSlots(response);
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
        fetchTimeslotDetail();
    };

    useEffect(() => {
        fetchTimeslotDetail();
    }, [doctorId]);

    return {
        timeSlots,
        loading,
        error,
        refresh,
    };
};

export default useDoctorTimeslot;
