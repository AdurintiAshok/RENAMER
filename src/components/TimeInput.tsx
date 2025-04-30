import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';

interface TimeInputProps {
  label: string;
  icon?: ReactNode;
}

const TimeInput = ({ label, icon }: TimeInputProps) => {
  const { formData, updateFormData, errors } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters except colon
    value = value.replace(/[^\d:]/g, '');
    
    // Handle automatic colon insertion
    if (value.length === 2 && !value.includes(':')) {
      value = value + ':';
    }
    
    // Ensure only one colon
    if (value.split(':').length > 2) {
      value = value.substring(0, value.lastIndexOf(':'));
    }
    
    // Limit total length to 5 characters (HH:MM)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    updateFormData('time', value);
  };

  return (
    <FormField label={label} error={errors.time} icon={icon}>
      <input
        type="text"
        id="time"
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors.time ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData.time}
        onChange={handleChange}
        placeholder="HH:MM (e.g., 21:30)"
        maxLength={5}
        pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
      />
    </FormField>
  );
};

export default TimeInput;