import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { Upload, Download, Clock, X, Image as ImageIcon, Calendar, Building2, Hash } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  newName?: string;
}

const ImageRenamer = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [startTime, setStartTime] = useState('09:30');
  const [date, setDate] = useState('2025-04-30');
  const [companyCode, setCompanyCode] = useState('TEST');
  const [strikeNumber, setStrikeNumber] = useState('298432');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 100).map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(newFiles);
    
  }, [date, companyCode, strikeNumber, startTime]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });
  useEffect(() => {
    generateNewNames(files);
  }, [date, startTime]);
  
  const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
  };

  const formatTime = (hours: number, minutes: number): string => {
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    return `${hourStr}.${minuteStr}`; 
  };

  const generateNewNames = (filesToRename: FileWithPreview[]) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const formattedDate = formatDate(date);
    const updatedFiles = filesToRename.map((file, index) => {
      const totalMinutes = hours * 60 + minutes + (index * 5);
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      const timeString = formatTime(newHours, newMinutes);
   
      const newName = `${formattedDate} ${companyCode} ${strikeNumber} ${timeString}`;
      return Object.assign(file, { newName });
    });

    setFiles(updatedFiles);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    generateNewNames(files);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    generateNewNames(files);
  };

  const handleCompanyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyCode(e.target.value.toUpperCase());
    generateNewNames(files);
  };

  const handleStrikeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrikeNumber(e.target.value);
    generateNewNames(files);
  };

  const downloadAll = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const zip = new JSZip();

    try {
      for (const file of files) {
        const blob = await fetch(file.preview!).then(r => r.blob());
        zip.file(`${file.newName}.${file.name.split('.').pop()}`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'renamed_screenshots.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files => {
      const newFiles = [...files];
      URL.revokeObjectURL(newFiles[index].preview!);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 sm:px-8">
  <h1 className="text-2xl font-bold text-white text-center">
    RENAMER
  </h1>
  <p className="mt-2 text-sm text-indigo-100 text-center">
    — Upload up to 100 screenshots
  </p>
</div>



      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Name
            </label>
            <input
              type="text"
              value={companyCode}
              onChange={handleCompanyCodeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Number"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
               Number
            </label>
            <input
              type="text"
              value={strikeNumber}
              onChange={handleStrikeNumberChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter  number"
              pattern="[0-9]*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
               Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={handleTimeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Drag & drop screenshots here, or click to select files</p>
          <p className="text-sm text-gray-500 mt-2">Supports PNG and JPG files</p>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview ({files.length} files)</h2>
              <button
                onClick={downloadAll}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{file.name}</p>
                      <p className="text-sm font-medium text-indigo-600">{file.newName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageRenamer;