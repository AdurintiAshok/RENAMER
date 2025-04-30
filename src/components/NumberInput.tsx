import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';

interface NumberInputProps {
  label: string;
  icon?: ReactNode;
}

const NumberInput = ({ label, icon }: NumberInputProps) => {
  const { formData, updateFormData, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('strikeNumber', parseInt(e.target.value) || 0);
  };

  return (
    <FormField label={label} error={errors.strikeNumber} icon={icon}>
      <input
        type="number"
        id="strikeNumber"
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors.strikeNumber ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData.strikeNumber || ''}
        onChange={handleChange}
        placeholder="Enter strike number"
      />
    </FormField>
  );
};

export default NumberInput;