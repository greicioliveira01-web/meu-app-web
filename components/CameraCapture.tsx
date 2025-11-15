import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Prefere a câmera traseira
        });
        activeStream = userMediaStream;
        setStream(userMediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userMediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
      }
    };
    enableCamera();
    
    // Função de limpeza para parar a câmera ao desmontar o componente
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      }, 'image/jpeg', 0.95);
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl bg-black/50 border border-cyan-500/30 rounded-2xl shadow-lg overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-400 h-96 flex flex-col justify-center items-center">
            <p className="font-bold text-lg mb-2">Erro na Câmera</p>
            <p>{error}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 rounded-full text-white bg-gray-700/80 hover:bg-gray-600/80 transition">
              Fechar
            </button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-around items-center">
          <button 
            onClick={onClose} 
            className="text-white font-semibold py-3 px-6 bg-black/30 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/10 transition"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleCapture} 
            disabled={!stream || !!error}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-black/50 ring-4 ring-white/50 ring-offset-black/50 ring-offset-2 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Tirar Foto"
          >
            <div className="w-16 h-16 rounded-full bg-white/80"></div>
          </button>
          
          <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
};
