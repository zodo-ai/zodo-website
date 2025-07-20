export type HospitalFormInputs = {
  // Hospital Details
  hospitalname: string;
  email: string;
  phone: string;
  website?: string;
  gstNumber?: string;
  
  // Admin Details
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  
  // FastTag Details
  fastTagEnabled: boolean;
  fasttagCount: string;
  fasttagPrice: string;
  
  // Address Details
  location: string;
  address: string;
  town: string;
  district: string;
  state: string;
  pincode: string;
  
  // Bank Details
  accountnumber: string;
  verifyAccountnumber: string;
  accountHoldername: string;
  bankName: string;
  ifsc: string;
  upiId: string;
  
  // Billing Address
  billingAccountHolder: string;
  billingLocation: string;
  billingAddress: string;
  billingTown: string;
  billingDistrict: string;
  billingState: string;
  billingPincode: string;
};
