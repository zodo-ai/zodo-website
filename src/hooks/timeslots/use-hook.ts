import { useState, useEffect, useCallback } from 'react';
import { fetchTimeSlotsAPI, FetchTimeSlotsParams } from '@/network/timeslots/get';
import { TimeSlotI } from '@/network/timeslots/types';
import { showToast } from '@/lib/toast';

export interface UseTimeSlotsReturn {
    timeSlots: TimeSlotI[];
    loading: boolean;
    error: string | null;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    refresh: () => void;
}

export interface UseTimeSlotsOptions {
    doctorId?: string;
    hospitalId?: string;
    autoFetch?: boolean;
}

const useTimeSlots = (options: UseTimeSlotsOptions = {}): UseTimeSlotsReturn => {
    const { doctorId, hospitalId, autoFetch = false } = options;
    
    const [timeSlots, setTimeSlots] = useState<TimeSlotI[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const fetchTimeSlots = useCallback(async (date: Date) => {
        try {
            setLoading(true);
            setError(null);
            
            // Format date as YYYY-MM-DD string
            const appointmentDate = date.toISOString().split('T')[0];
            
            const params: FetchTimeSlotsParams = {
                appointmentDate,
                ...(doctorId && { doctorId }),
                ...(hospitalId && { hospitalId })
            };
            
            const response = await fetchTimeSlotsAPI(params);
            setTimeSlots(response.data || []);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch time slots';
            setError(errorMessage);
            showToast({
                type: "error",
                message: errorMessage
            });
            console.error('Error fetching time slots:', err);
        } finally {
            setLoading(false);
        }
    }, [doctorId, hospitalId]);

    const handleDateChange = useCallback((date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            fetchTimeSlots(date);
        } else {
            setTimeSlots([]);
        }
    }, [fetchTimeSlots]);

    const refresh = useCallback(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        }
    }, [selectedDate, fetchTimeSlots]);

    useEffect(() => {
        if (autoFetch && selectedDate) {
            fetchTimeSlots(selectedDate);
        }
    }, [autoFetch, selectedDate, fetchTimeSlots]);

    return {
        timeSlots,
        loading,
        error,
        selectedDate,
        setSelectedDate: handleDateChange,
        refresh,
    };
};

export default useTimeSlots;
