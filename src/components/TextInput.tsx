import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';

interface TextInputProps {
  label: string;
  icon?: ReactNode;
}

const TextInput = ({ label, icon }: TextInputProps) => {
  const { formData, updateFormData, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('companyName', e.target.value);
  };

  return (
    <FormField label={label} error={errors.companyName} icon={icon}>
      <input
        type="text"
        id="companyName"
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors.companyName ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Enter company name"
      />
    </FormField>
  );
};

export default TextInput;