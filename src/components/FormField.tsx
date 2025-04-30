import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  icon?: ReactNode;
}

const FormField = ({ label, children, error, icon }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;