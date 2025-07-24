import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip, { file } from 'jszip';
import { Upload, Download, Clock, X, Image as ImageIcon, Calendar, Building2, Hash } from 'lucide-react';
import { db } from '../utils/firebase'; // Adjust path as needed

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
interface FileWithPreview extends File {
  preview?: string;
  newName?: string;
  customTime?: string | null;
}

const ScreenshotTimeScribe = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [startTime, setStartTime] = useState('09:30');
  const [date, setDate] = useState('2025-04-30');
  const [companyCode, setCompanyCode] = useState('');
  const [strikeNumber, setStrikeNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });
const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };
function getDeviceId() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  return id;
}

async function getLocationFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    return await response.json(); // contains city, country, etc.
  } catch (e) {
    return { error: "location_fetch_failed" };
  }
}

async function trackDevice() {
  const deviceId = getDeviceId();
  const location = await getLocationFromIP();

  const docRef = doc(db, "device_hits", deviceId);
  await setDoc(docRef, {
    lastSeen: serverTimestamp(),
    location,
    userAgent: navigator.userAgent,
  }, { merge: true });
}
const onDrop = useCallback((acceptedFiles: File[]) => {
  if (acceptedFiles.length === 0) return;

  const newFiles: FileWithPreview[] = acceptedFiles.slice(0, 100).map(file => {
    const originalName = file.name;
    // Added a more robust fallback for filename extraction and ensured it ends with an extension
    const fallbackName = (file as any).path?.split('/').pop()?.split('\\').pop() || `untitled_screenshot_${Date.now()}.png`;

    const finalFileName = originalName || fallbackName;

    // Create a new File object with the desired name.
    // This is crucial because the original File's 'name' property is a getter.
    const renamedFile = new File([file], finalFileName, { type: file.type, lastModified: file.lastModified });

    // Explicitly create the FileWithPreview object ensuring 'name' is always present.
    // We combine the properties from the 'renamedFile' and our custom ones.
    const fileWithCustomProps: FileWithPreview = {
      // Copy properties from the newly created 'renamedFile'
      // This includes 'name', 'size', 'type', 'lastModified'
      // We can't use spread syntax like { ...renamedFile } for all properties
      // if 'renamedFile' is a complex Blob/File object that might have non-enumerable properties.
      // So let's build it carefully.
      name: renamedFile.name, // Explicitly set the name here
      size: renamedFile.size,
      type: renamedFile.type,
      lastModified: renamedFile.lastModified,
      arrayBuffer: renamedFile.arrayBuffer.bind(renamedFile), // Keep methods if needed
      text: renamedFile.text.bind(renamedFile),
      slice: renamedFile.slice.bind(renamedFile),
      // Add your custom properties
      preview: URL.createObjectURL(file), // Use original 'file' for preview to be safe
      customTime: null,
      webkitRelativePath: '',
      bytes: function (): Promise<Uint8Array> {
        throw new Error('Function not implemented.');
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error('Function not implemented.');
      }
    };

    return fileWithCustomProps;
  });

  setFiles(prev => {
    const updated = [...prev, ...newFiles];
    // Generate new names immediately after state update
    // This will use the 'name' property we just ensured is on the object.
    setTimeout(() => generateNewNames(updated), 0);
    return updated;
  });

  showNotification(`Added ${newFiles.length} screenshot${newFiles.length !== 1 ? 's' : ''} successfully!`);
}, [date, companyCode, strikeNumber, startTime]); // Dependencies seem correct

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true,
    maxFiles: 100
  });

  useEffect(() => {
    trackDevice()
    if (files.length > 0) {
      generateNewNames(files);
    }
  }, [date, startTime, companyCode, strikeNumber]);

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
    let [hours, minutes] = startTime.split(':').map(Number);
    const formattedDate = formatDate(date);

    const updatedFiles = filesToRename.map((file, index) => {
      let currentCustomTime = file.customTime;
      if (!currentCustomTime) {
        currentCustomTime = formatTime(hours, minutes).replace('.', ':');
        minutes += 5;
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
      }

      const timeString = currentCustomTime.replace(':', '.');
      const newName = `${formattedDate} ${companyCode} ${strikeNumber} ${timeString}`;
      return { ...file, newName };
    });

    setFiles(updatedFiles);
  }

  const handleCustomTimeChange = (index: number, value: string) => {
    const updatedFiles = [...files];
    updatedFiles[index].customTime = value || null;
    setFiles(updatedFiles);
    generateNewNames(updatedFiles);
  };

  const downloadAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();

      for (const file of files) {
        // The console.log was for debugging; you can remove it now or keep it for final checks
        // console.log(file); // This log is what showed the missing 'name'

        // This check should now always pass if onDrop is correctly modified
        if (!file.name || !file.newName) {
          console.warn('Skipping file due to missing data (name or newName missing):', file);
          continue;
        }

        const extension = file.name.split('.').pop() || 'jpg'; // Use file.name, which is now guaranteed to exist
        
        // **Crucial Modification Here:** Read the file content as an ArrayBuffer
        const fileContent = await file.arrayBuffer(); 
        zip.file(`${file.newName}.${extension}`, fileContent); // Pass the content, not the File object
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'renamed_screenshots.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(`Successfully downloaded ${files.length} renamed screenshots! 🎉`);
    } catch (error) {
      console.error('Error creating zip:', error);
      showNotification('Failed to create download. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ... (rest of your component, removeFile, clearAll functions and JSX)



  const removeFile = (index: number) => {
    setFiles(files => {
      const newFiles = [...files];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAll = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    showNotification('All files cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="relative z-20 text-center py-4">
  <p className="text-sm text-gray-400">
    Created by <span className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300">Ashok Adurinti</span>
  </p>
</div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        } transform ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">

          {/* Main Container */}
          <div className="glass-strong rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Configuration Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Building2 className="w-5 h-5 mr-2 text-cyan-400" />
                  Company Code
                </label>
                <input
                  type="text"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Hash className="w-5 h-5 mr-2 text-pink-400" />
                  Strike Number
                </label>
                <input
                  type="text"
                  value={strikeNumber}
                  onChange={(e) => setStrikeNumber(e.target.value)}
                  placeholder="150"
                  pattern="[0-9]*"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500 mb-10 ${
                isDragActive
                  ? 'border-purple-400 bg-purple-500/10 scale-105'
                  : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center transition-all duration-500 ${
                  isDragActive ? 'scale-110 shadow-2xl shadow-purple-500/50' : 'shadow-xl'
                }`}>
                  <Upload className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isDragActive ? 'Drop Your Screenshots Here!' : 'Upload Screenshots'}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Drag & drop up to 100 PNG or JPG files, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Each screenshot will be automatically timestamped with 5-minute intervals
                  </p>
                </div>
              </div>
            </div>

            {/* Files Preview */}
            {files.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-white">Preview</h3>
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full border border-purple-500/30">
                      <span className="text-purple-300 font-semibold text-sm">
                        {files.length} file{files.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={clearAll}
                      className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={downloadAll}
                      disabled={isProcessing}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Download className="w-5 h-5 mr-2" />
                          Download All
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-custom pr-2">
                  {files.map((file:any, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:from-slate-700/50 hover:to-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Serial Number */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm sm:text-base">#{index + 1}</span>
                            </div>
<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-slate-600">
  <img
    src={file.preview}
    alt={`Preview ${index + 1}`}
    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-all duration-200"
    onClick={() => setSelectedPreview(file.preview)}
  />
</div>




                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-400 truncate">{file.name}</p>
                              <p className="text-white font-semibold text-sm sm:text-base truncate">{file.newName}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Manual Time Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">Manual Time:</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            <input
                              type="time"
                              className="w-full sm:w-32 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                              placeholder="Custom time"
                              value={file.customTime ?? ''}
                              onChange={(e) => handleCustomTimeChange(index, e.target.value)}
                            />
                            <span className="text-xs text-gray-500 hidden sm:block">Override auto-generated time</span>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(index)}
                          className="self-end sm:self-center opacity-70 sm:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedPreview && (
  <div
    className="fixed inset-0  flex items-center justify-center p-6"
    onClick={() => setSelectedPreview(null)}
  >
    <div
      className="relative bg-slate-900 rounded-xl p-4 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedPreview(null)}
        className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full shadow-lg transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* File name */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-300 font-semibold">
          {
            // Find the matching file name by preview URL
            files.find(f => f.preview === selectedPreview)?.name || 'Screenshot'
          }
        </p>
      </div>

      {/* Image */}
      <img
        src={selectedPreview}
        alt="Full Preview"
        className="w-full h-auto rounded-lg object-contain"
      />
    </div>
  </div>
)}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ScreenshotTimeScribe;