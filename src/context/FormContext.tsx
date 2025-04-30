import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  date: string;
  companyName: string;
  strikeNumber: number;
  time: string;
  image: File | null;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
  imagePreview: string | null;
  resetForm: () => void;
}

const today = new Date().toISOString().split('T')[0];

const initialFormData: FormData = {
  date: today,
  companyName: 'Acme Corp',
  strikeNumber: 1025,
  time: '',
  image: null,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    }

    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.strikeNumber) {
      newErrors.strikeNumber = 'Strike number is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else {
      const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(formData.time)) {
        newErrors.time = 'Invalid time format. Use HH:MM (e.g., 21:30 or 3:30)';
      }
    }

    if (!formData.image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        if (formData.image) {
          const formattedDate = formatDate(formData.date);
          const newFileName = `${formattedDate} ${formData.companyName} ${formData.strikeNumber} ${formData.time}.jpg`;

          // Create a download link for the renamed image
          const url = URL.createObjectURL(formData.image);
          const link = document.createElement('a');
          link.href = url;
          link.download = newFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setErrors({
          submit: 'There was an error processing your file. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setImagePreview(null);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        errors,
        setErrors,
        isSubmitting,
        setIsSubmitting,
        handleSubmit,
        imagePreview,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};