import React from 'react';
import { useFormContext } from '../context/FormContext';
import DateInput from './DateInput';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';
import FileUpload from './FileUpload';
import SubmitButton from './SubmitButton';
import { Calendar, Building2, Hash, Clock, Image, Upload } from 'lucide-react';

const FormContainer = () => {
  const { errors, isSubmitting } = useFormContext();

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Image Upload</h2>
        <p className="text-indigo-100 text-center text-sm">Fill in the details below to rename your image</p>
      </div>
      
      <div className="p-8">
        <div className="space-y-6">
          <DateInput 
            label="Select Date" 
            icon={<Calendar className="h-5 w-5 text-indigo-500" />} 
          />
          
          <TextInput 
            label="Company Name" 
            icon={<Building2 className="h-5 w-5 text-indigo-500" />} 
          />
          
          <NumberInput 
            label="Strike Number" 
            icon={<Hash className="h-5 w-5 text-indigo-500" />} 
          />
          
          <TimeInput 
            label="Time" 
            icon={<Clock className="h-5 w-5 text-indigo-500" />} 
          />
          
          <div className="border-t border-gray-100 pt-6">
            <FileUpload 
              label="Upload Image" 
              icon={<Image className="h-5 w-5 text-indigo-500" />} 
            />
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
              {errors.submit}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping mr-2"></span>
                  Processing...
                </span>
              ) : (
                'Your image will be renamed automatically'
              )}
            </p>
            <SubmitButton 
              label="Upload Image" 
              icon={<Upload className="h-5 w-5" />} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;