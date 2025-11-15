
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="my-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">
      <p className="font-semibold">Erro</p>
      <p>{message}</p>
    </div>
  );
};
