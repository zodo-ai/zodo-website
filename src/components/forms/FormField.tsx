import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, FieldPath } from "react-hook-form";

interface FormFieldProps<T extends Record<string, any>> {
  id: FieldPath<T>;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: object;
  className?: string;
}

const FormField = <T extends Record<string, any>>({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  register,
  errors,
  validation = {},
  className = "space-y-2"
}: FormFieldProps<T>) => {
  const defaultValidation = required ? { required: `${label} is required` } : {};
  const finalValidation = { ...defaultValidation, ...validation };

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && "*"}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, finalValidation)}
      />
      {errors[id] && (
        <span className="text-sm text-red-500">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormField;