import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500"></div>
      <p className="mt-4 text-gray-400">Analisando o gráfico...</p>
    </div>
  );
};