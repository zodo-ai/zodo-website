import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface BillingAddressSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
}

const BillingAddressSection = ({ register, errors }: BillingAddressSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            id="billingAccountHolder"
            label="Billing Account Holder"
            placeholder="Billing Account Holder"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="billingLocation"
            label="Billing Location"
            placeholder="Billing Location"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="billingAddress"
            label="Billing Address"
            placeholder="Billing Address"
            required
            register={register}
            errors={errors}
            className="space-y-2 md:col-span-2 lg:col-span-1"
          />
          
          <FormField
            id="billingTown"
            label="Billing Town"
            placeholder="Billing Town"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="billingDistrict"
            label="Billing District"
            placeholder="Billing District"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="billingState"
            label="Billing State"
            placeholder="Billing State"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="billingPincode"
            label="Billing Pincode"
            placeholder="Billing Pincode"
            required
            register={register}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingAddressSection;