import React, { useState, useEffect } from 'react';
import { getAnalyticsData, AnalyticsData } from '../utils/analytics';

interface AnalyticsPageProps {
  username: string;
  onClose: () => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ username, onClose }) => {
  const [stats, setStats] = useState<AnalyticsData>({ wins: 0, losses: 0 });

  useEffect(() => {
    setStats(getAnalyticsData(username));
  }, [username]);

  const totalTrades = stats.wins + stats.losses;
  const winRate = totalTrades > 0 ? ((stats.wins / totalTrades) * 100).toFixed(1) : '0.0';
  const winPercentage = totalTrades > 0 ? (stats.wins / totalTrades) * 100 : 0;
  const lossPercentage = totalTrades > 0 ? (stats.losses / totalTrades) * 100 : 0;

  // Function to handle clicks outside the modal content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-lg bg-black/40 border border-cyan-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white transition-transform transform scale-95 duration-300 animate-fade-in"
        style={{ animation: 'fade-in 0.3s ease-out forwards' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform hover:scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
          Analytics de Desempenho
        </h2>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-8">
          <div>
            <p className="text-4xl font-bold text-green-400">{stats.wins}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">WINs</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-400">{stats.losses}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">LOSSes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-cyan-400">{winRate}%</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Assertividade</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-center text-gray-300">Distribuição de Resultados</h3>
          <div className="w-full bg-black/30 rounded-full h-8 flex overflow-hidden border border-cyan-500/20">
            {stats.wins > 0 && (
              <div 
                className="bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center h-full text-sm font-bold transition-all duration-500"
                style={{ width: `${winPercentage}%` }}
              >
                {winPercentage >= 15 && `${winPercentage.toFixed(0)}%`}
              </div>
            )}
            {stats.losses > 0 && (
              <div 
                className="bg-gradient-to-r from-rose-600 to-red-500 flex items-center justify-center h-full text-sm font-bold transition-all duration-500"
                style={{ width: `${lossPercentage}%` }}
              >
                {lossPercentage >= 15 && `${lossPercentage.toFixed(0)}%`}
              </div>
            )}
            {totalTrades === 0 && (
                <div className="w-full flex items-center justify-center text-sm text-gray-400">Nenhum dado registrado</div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-8 italic text-center">
            Resultados para o usuário <span className="font-bold text-cyan-400">{username}</span>. Salvo localmente.
        </p>

      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;