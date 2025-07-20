import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface HospitalInfoSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
}

const HospitalInfoSection = ({ register, errors }: HospitalInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            id="hospitalname"
            label="Hospital Name"
            placeholder="Enter hospital name"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="email"
            label="Contact Email"
            placeholder="hospital@example.com"
            type="email"
            required
            register={register}
            errors={errors}
            validation={{
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address"
              }
            }}
          />
          
          <FormField
            id="phone"
            label="Contact Number"
            placeholder="+91 XXXXXXXXXX"
            type="tel"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="website"
            label="Website"
            placeholder="https://www.hospital.com"
            type="url"
            register={register}
            errors={errors}
          />
          
          <FormField
            id="gstNumber"
            label="GST Number"
            placeholder="GST Number"
            register={register}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalInfoSection;