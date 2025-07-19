import { useState } from 'react';
import { createHospitalAPI, CreateHospitalPayload } from '@/network/hospitals/post';
import { showToast } from '@/lib/toast';

export interface UseCreateHospitalReturn {
  createHospital: (data: CreateHospitalPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useCreateHospital = (): UseCreateHospitalReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHospital = async (data: CreateHospitalPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createHospitalAPI(data);
      
      const message = response?.message || "Hospital created successfully";
      showToast({
        type: "success",
        message,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to create hospital. Please try again.';
      setError(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      console.error('Error creating hospital:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createHospital,
    loading,
    error,
  };
};

export default useCreateHospital;