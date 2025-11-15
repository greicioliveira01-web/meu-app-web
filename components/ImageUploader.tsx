import React, { useCallback, useState, useRef } from 'react';
import { CameraCapture } from './CameraCapture';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);
  
  const handlePhotoTaken = (file: File) => {
    onImageUpload(file);
    setShowCamera(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };


  return (
    <>
      <div 
        className={`w-full p-6 border border-cyan-500/20 rounded-2xl bg-black/20 transition-all duration-300 ${isDragging ? 'bg-cyan-500/10 scale-105' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="mb-4 text-base text-gray-400">
             Arraste e solte o print do gráfico aqui, ou
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={triggerFileSelect}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 font-bold text-white bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-full shadow-lg shadow-cyan-500/20 transform transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <UploadIcon />
              Enviar Print
            </button>
            <input 
              ref={fileInputRef}
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleFileChange} 
              disabled={isLoading}
            />
             <button
              onClick={() => setShowCamera(true)}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 font-bold bg-black/30 text-cyan-300 border border-cyan-500/50 rounded-full transform transition-all duration-300 hover:bg-cyan-500/20 hover:text-white disabled:opacity-50"
            >
              <CameraIcon />
              Usar a Câmera
            </button>
          </div>
        </div>
      </div>
      
      {showCamera && (
        <CameraCapture 
          onCapture={handlePhotoTaken} 
          onClose={() => setShowCamera(false)} 
        />
      )}
    </>
  );
};