import { z } from 'zod';

// Phone number validation
export const phoneNumberSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Phone number contains invalid characters')
  .refine(
    (value) => {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Check if it has at least 10 digits
      return digitsOnly.length >= 10;
    },
    'Phone number must contain at least 10 digits'
  );

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email address');

// OTP validation
export const otpSchema = z
  .string()
  .length(4, 'OTP must be 4 digits')
  .regex(/^\d+$/, 'OTP must be numeric');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes');

// Age validation
export const ageSchema = z
  .number()
  .int('Age must be a whole number')
  .min(1, 'Age must be at least 1')
  .max(150, 'Please enter a valid age');

// Gender validation
export const genderSchema = z.enum(['male', 'female', 'other']);

// Password validation (for future use)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Utility function to format phone number for display
export const formatPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+91 ${digitsOnly.slice(2, 7)} ${digitsOnly.slice(7)}`;
  }
  return phoneNumber;
};

// Utility function to normalize phone number for API calls
export const normalizePhoneNumber = (phoneNumber: string): string => {
  let digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // If it's 10 digits, assume it's for India
  if (digitsOnly.length === 10) {
    digitsOnly = '91' + digitsOnly;
  }
  
  // Ensure it starts with +
  if (!phoneNumber.includes('+')) {
    return `+${digitsOnly}`;
  }
  
  return `+${digitsOnly}`;
};
