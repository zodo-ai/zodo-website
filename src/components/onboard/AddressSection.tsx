import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface AddressSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
}

const AddressSection = ({ register, errors }: AddressSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            id="location"
            label="Location"
            placeholder="Street/Area"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="address"
            label="Address"
            placeholder="Complete address"
            required
            register={register}
            errors={errors}
            className="space-y-2 md:col-span-2"
          />
          
          <FormField
            id="town"
            label="Town"
            placeholder="Town"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="district"
            label="District"
            placeholder="District"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="state"
            label="State"
            placeholder="State"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="pincode"
            label="Pincode"
            placeholder="Pincode"
            required
            register={register}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSection;