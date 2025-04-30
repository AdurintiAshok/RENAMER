import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';

interface SubmitButtonProps {
  label: string;
  icon?: ReactNode;
}

const SubmitButton = ({ label, icon }: SubmitButtonProps) => {
  const { handleSubmit, isSubmitting } = useFormContext();

  return (
    <button
      type="button"
      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-70 order-1 sm:order-2"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {isSubmitting ? 'Processing...' : label}
    </button>
  );
};

export default SubmitButton;