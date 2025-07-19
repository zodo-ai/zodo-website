import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/forms/FormField";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch,
} from "react-hook-form";
import { HospitalFormInputs } from "@/types/onboard";

interface FastTagSectionProps {
  register: UseFormRegister<HospitalFormInputs>;
  errors: FieldErrors<HospitalFormInputs>;
  control: Control<HospitalFormInputs>;
}

const FastTagSection = ({ register, errors, control }: FastTagSectionProps) => {
  const fastTagEnabled = useWatch({
    control,
    name: "fastTagEnabled",
    defaultValue: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>FastTag Configuration</span>
          <div className="flex items-center space-x-2">
            <label
              htmlFor="fastTagEnabled"
              className="text-sm font-medium cursor-pointer"
            >
              Enable FastTag
            </label>
            <label htmlFor="fastTagEnabled" className="relative cursor-pointer">
              <input
                type="checkbox"
                id="fastTagEnabled"
                {...register("fastTagEnabled")}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full border-2 border-transparent shadow-sm transition-colors ${
                  fastTagEnabled ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${
                    fastTagEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="fasttagCount"
            label="FastTag Count"
            placeholder="Enter count"
            type="number"
            required={fastTagEnabled}
            register={register}
            errors={errors}
            validation={
              fastTagEnabled
                ? {
                    required:
                      "FastTag count is required when FastTag is enabled",
                    min: { value: 1, message: "Count must be at least 1" },
                  }
                : {}
            }
            className={`space-y-2 ${
              !fastTagEnabled ? "opacity-50 pointer-events-none" : ""
            }`}
          />

          <FormField
            id="fasttagPrice"
            label="FastTag Price"
            placeholder="Enter price"
            type="number"
            required={fastTagEnabled}
            register={register}
            errors={errors}
            validation={
              fastTagEnabled
                ? {
                    required:
                      "FastTag price is required when FastTag is enabled",
                    min: {
                      value: 0.01,
                      message: "Price must be greater than 0",
                    },
                  }
                : {}
            }
            className={`space-y-2 ${
              !fastTagEnabled ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FastTagSection;
