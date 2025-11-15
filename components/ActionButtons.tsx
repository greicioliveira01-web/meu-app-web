import React from 'react';

interface ActionButtonsProps {
  suggestion: 'CALL' | 'PUT' | 'NEUTRAL';
}

const CallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const PutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const ActionButtons: React.FC<ActionButtonsProps> = ({ suggestion }) => {
  const baseButtonClass = "flex items-center justify-center w-48 h-16 text-white font-bold text-xl rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4";
  
  const CallButton = () => (
    <button className={`${baseButtonClass} bg-gradient-to-br from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 shadow-[0_0_15px_rgba(20,184,166,0.4)] focus:ring-teal-500/50`}>
      <CallIcon /> CALL
    </button>
  );

  const PutButton = () => (
    <button className={`${baseButtonClass} bg-gradient-to-br from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-[0_0_15px_rgba(225,29,72,0.4)] focus:ring-rose-500/50`}>
      <PutIcon /> PUT
    </button>
  );

  const renderButtons = () => {
    switch (suggestion) {
      case 'CALL':
        return <CallButton />;
      case 'PUT':
        return <PutButton />;
      case 'NEUTRAL':
        return (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <CallButton />
            <PutButton />
          </div>
        );
      default:
        return null;
    }
  };

  const getSuggestionText = () => {
    switch (suggestion) {
      case 'CALL':
      case 'PUT':
        return 'Sugestão com base na análise:';
      case 'NEUTRAL':
        return 'A análise indica um cenário neutro. Ambas as opções estão disponíveis:';
      default:
        return 'Com base na análise, qual sua decisão?';
    }
  };

  return (
    <div className="mt-8 flex flex-col justify-center items-center gap-4">
      <p className="text-cyan-200/70 text-center mb-2">{getSuggestionText()}</p>
      <div className="flex justify-center items-center">
        {renderButtons()}
      </div>
      <p className="text-xs text-gray-500 mt-6 italic text-center max-w-md">
        *A sugestão é baseada puramente na análise técnica visual e não constitui uma recomendação financeira.
      </p>
    </div>
  );
};