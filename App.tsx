import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ActionButtons } from './components/ActionButtons';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { analyzeChartImage, AnalysisResult } from './services/geminiService';
import { TimeframeSelector } from './components/TimeframeSelector';
import { AuthPage } from './components/AuthPage';
import AnalyticsPage from './components/AnalyticsPage';
import { recordWin, recordLoss } from './utils/analytics';

export type Timeframe = 'M1' | 'M5' | 'M15';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('M5');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [resultRecorded, setResultRecorded] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setIsAuthenticated(true);
      setCurrentUser(loggedInUser);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('loggedInUser', username);
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    resetState();
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeChartImage(file, timeframe);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  const resetState = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setResultRecorded(false);
  };

  const handleRecordWin = () => {
    if (!currentUser) return;
    recordWin(currentUser);
    setResultRecorded(true);
  };

  const handleRecordLoss = () => {
    if (!currentUser) return;
    recordLoss(currentUser);
    setResultRecorded(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        <Header onLogout={handleLogout} onShowAnalytics={() => setShowAnalytics(true)} />
        <main className="mt-8 bg-black/30 rounded-3xl shadow-2xl p-6 md:p-8 border border-cyan-500/20 backdrop-blur-lg">
          {!previewUrl ? (
            <>
              <TimeframeSelector 
                selectedTimeframe={timeframe} 
                onTimeframeChange={setTimeframe} 
                disabled={isLoading}
              />
              <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full rounded-xl shadow-lg overflow-hidden border border-cyan-500/30">
                <img src={previewUrl} alt="Pré-visualização do gráfico" className="w-full h-auto object-contain" />
              </div>
              <button
                onClick={resetState}
                className="mt-8 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:from-fuchsia-500 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-cyan-500/20 transform hover:scale-105"
                disabled={isLoading}
              >
                Analisar Outro Gráfico
              </button>
            </div>
          )}

          {isLoading && <Loader />}
          {error && <ErrorDisplay message={error} />}
          
          {analysisResult && !isLoading && (
            <div className="mt-8">
              <AnalysisDisplay analysis={analysisResult.analysis} />
              <ActionButtons suggestion={analysisResult.suggestion} />
              
              {!resultRecorded && (
                <div className="mt-10 pt-6 border-t border-cyan-500/20 flex flex-col items-center gap-4">
                  <h3 className="text-lg font-semibold text-cyan-200/80">Qual foi o resultado da operação?</h3>
                  <div className="flex gap-4">
                    <button onClick={handleRecordWin} className="px-10 py-3 text-lg font-bold rounded-full bg-gradient-to-br from-teal-500 to-green-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)] transition transform hover:scale-105">
                      WIN
                    </button>
                    <button onClick={handleRecordLoss} className="px-10 py-3 text-lg font-bold rounded-full bg-gradient-to-br from-rose-600 to-red-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition transform hover:scale-105">
                      LOSS
                    </button>
                  </div>
                </div>
              )}

              {resultRecorded && (
                <p className="text-center mt-8 text-green-400 font-semibold animate-pulse">
                  Resultado registrado com sucesso!
                </p>
              )}
            </div>
          )}
        </main>
      </div>
      {showAnalytics && currentUser && (
        <AnalyticsPage username={currentUser} onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  );
};

export default App;