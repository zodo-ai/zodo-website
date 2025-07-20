import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface BankDetailsSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
  accountNumber: string;
}

const BankDetailsSection = ({ register, errors, accountNumber }: BankDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="accountnumber"
            label="Account Number"
            placeholder="Account Number"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="verifyAccountnumber"
            label="Verify Account Number"
            placeholder="Re-enter account number"
            required
            register={register}
            errors={errors}
            validation={{
              validate: (value: string) => value === accountNumber || "Account numbers do not match"
            }}
          />
          
          <FormField
            id="accountHoldername"
            label="Account Holder Name"
            placeholder="Account Holder Name"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="bankName"
            label="Bank Name"
            placeholder="Bank Name"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="ifsc"
            label="IFSC Code"
            placeholder="IFSC Code"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="upiId"
            label="UPI ID"
            placeholder="example@upi"
            required
            register={register}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsSection;