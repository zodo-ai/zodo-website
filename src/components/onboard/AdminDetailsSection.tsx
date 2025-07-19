import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface AdminDetailsSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
}

const AdminDetailsSection = ({ register, errors }: AdminDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            id="adminName"
            label="Admin Name"
            placeholder="Admin full name"
            required
            register={register}
            errors={errors}
          />
          
          <FormField
            id="adminEmail"
            label="Admin Email"
            placeholder="admin@hospital.com"
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
            id="adminPassword"
            label="Admin Password"
            placeholder="Enter secure password"
            type="password"
            required
            register={register}
            errors={errors}
            validation={{
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDetailsSection;