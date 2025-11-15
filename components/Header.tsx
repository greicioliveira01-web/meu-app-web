import React from 'react';

interface HeaderProps {
  onLogout?: () => void;
  onShowAnalytics?: () => void;
}

const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const AnalyticsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onLogout, onShowAnalytics }) => {
  return (
    <header className="relative w-full">
      {/* Buttons Container */}
      <div className="absolute top-0 left-0 right-0 w-full flex justify-between items-center px-2 sm:px-4 py-4">
        <div>
          {onShowAnalytics && (
            <button 
              onClick={onShowAnalytics}
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-300 bg-black/20 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-white transition-all duration-300"
              aria-label="Analytics"
            >
                <AnalyticsIcon />
                Analytics
            </button>
          )}
        </div>
        <div>
          {onLogout && (
              <button 
                onClick={onLogout}
                className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-300 bg-black/20 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-white transition-all duration-300"
                aria-label="Sair"
              >
                  <LogoutIcon />
                  Sair
              </button>
          )}
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="text-center pt-20 pb-4">
        <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 pb-2">
          NEXON
        </h1>
        <p className="mt-2 text-lg text-cyan-200/70 max-w-2xl mx-auto font-light tracking-wide">
          Assistente de Análise Gráfica
        </p>
      </div>
    </header>
  );
};