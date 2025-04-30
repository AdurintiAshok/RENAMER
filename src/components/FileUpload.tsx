import React, { ReactNode, useRef } from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  icon?: ReactNode;
}

const FileUpload = ({ label, icon }: FileUploadProps) => {
  const { updateFormData, errors, imagePreview } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('image', file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormField label={label} error={errors.image} icon={icon}>
      <div className="mt-1 flex flex-col items-center">
        <input
          type="file"
          id="image"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div 
          onClick={handleClick}
          className={`w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 ${
            errors.image ? 'border-red-500' : imagePreview ? 'border-indigo-500' : 'border-gray-300'
          }`}
        >
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-contain p-2" 
              />
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF files</p>
            </>
          )}
        </div>
      </div>
    </FormField>
  );
};

export default FileUpload;