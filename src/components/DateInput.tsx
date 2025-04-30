import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';

interface DateInputProps {
  label: string;
  icon?: ReactNode;
}

const DateInput = ({ label, icon }: DateInputProps) => {
  const { formData, updateFormData, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('date', e.target.value);
  };

  return (
    <FormField label={label} error={errors.date} icon={icon}>
      <input
        type="date"
        id="date"
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors.date ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData.date}
        onChange={handleChange}
      />
    </FormField>
  );
};

export default DateInput;