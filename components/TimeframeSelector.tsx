import React from 'react';
import { Timeframe } from '../App';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  disabled: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ selectedTimeframe, onTimeframeChange, disabled }) => {
  const timeframes: Timeframe[] = ['M1', 'M5', 'M15'];

  const getButtonClass = (timeframe: Timeframe) => {
    const baseClass = "px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed";
    if (timeframe === selectedTimeframe) {
      return `${baseClass} bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 scale-105`;
    }
    return `${baseClass} bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white`;
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <h3 className="text-lg font-medium text-cyan-200/70 mb-4">Selecione o Timeframe da Análise:</h3>
      <div className="flex justify-center items-center space-x-3 sm:space-x-4 p-2 bg-black/20 rounded-full border border-cyan-500/20">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={getButtonClass(tf)}
            disabled={disabled}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};