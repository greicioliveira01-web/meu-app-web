import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: (username: string) => void;
}

// Helper functions for more robust localStorage access
const getUsersFromStorage = (): { [key: string]: string } => {
  try {
    const usersJson = localStorage.getItem('users');
    // Ensure we have a non-empty string before parsing
    if (usersJson && usersJson.length > 0) {
      return JSON.parse(usersJson);
    }
  } catch (error) {
    console.error('Failed to parse users from localStorage:', error);
    // If data is corrupted, it's safer to start fresh.
  }
  return {};
};

const saveUsersToStorage = (users: { [key: string]: string }) => {
  try {
    const usersJson = JSON.stringify(users);
    localStorage.setItem('users', usersJson);
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
};


export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isLoginView) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const storedUsers = getUsersFromStorage();
    if (storedUsers[username] && storedUsers[username] === password) {
      onLoginSuccess(username);
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleRegister = () => {
    if (!username || !password) {
      setError('Usuário e senha são obrigatórios.');
      return;
    }
    
    const storedUsers = getUsersFromStorage();
    if (storedUsers[username]) {
      setError('Este nome de usuário já existe.');
    } else {
      const newUsers = { ...storedUsers, [username]: password };
      saveUsersToStorage(newUsers);
      setSuccess('Cadastro realizado com sucesso! Faça o login.');
      setIsLoginView(true);
      setUsername('');
      setPassword('');
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setSuccess(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 pb-2">
                NEXON
            </h1>
            <p className="text-cyan-200/70 font-light mt-2 tracking-wide">
                {isLoginView ? 'Faça login no seu Assistente de Análise Gráfica' : 'Crie sua conta para começar'}
            </p>
        </div>

        <div className="bg-black/30 rounded-3xl shadow-2xl p-8 border border-cyan-500/20 backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-400">Usuário</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full bg-black/20 border-b-2 border-cyan-500/30 rounded-t-md shadow-sm py-3 px-4 text-gray-200 focus:outline-none focus:ring-0 focus:border-cyan-400 transition"
                placeholder="seu.usuario"
              />
            </div>
            <div>
              <label htmlFor="password"  className="text-sm font-medium text-gray-400">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full bg-black/20 border-b-2 border-cyan-500/30 rounded-t-md shadow-sm py-3 px-4 text-gray-200 focus:outline-none focus:ring-0 focus:border-cyan-400 transition"
                placeholder="********"
              />
            </div>
            
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            {success && <p className="text-sm text-green-400 text-center">{success}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105"
              >
                {isLoginView ? 'Entrar' : 'Cadastrar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleView} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};