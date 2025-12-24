import React, { useState } from 'react';
import { Lock, Mail, User, Loader, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/supabase-api';
import { useToast } from './Toast';
import { isDemoMode } from '../lib/supabase';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await authAPI.login(email, password);
        showToast('Connexion réussie !', 'success');
      } else {
        await authAPI.register(email, password, { firstName, lastName });
        showToast('Compte créé avec succès !', 'success');
      }
      onLoginSuccess();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl font-bold text-black">N</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">NexusGrowth</h1>
          <p className="text-gray-400 text-sm">CRM Intelligence Platform</p>
        </div>

        {isDemoMode && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="text-yellow-500 font-bold text-sm">Mode Démo Actif</h3>
              <p className="text-yellow-200/80 text-xs mt-1">
                L'application fonctionne en mode démonstration locale. Entrez n'importe quel email/mot de passe pour tester. Les données sont sauvegardées temporairement dans votre navigateur.
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-full">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                !isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 mb-1 block font-medium">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/30 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300 mb-1 block font-medium">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/30 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/30 outline-none transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/30 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <span>{isLogin ? 'Se connecter' : "S'inscrire"}</span>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                {isDemoMode ? (
                  <>Utilisez n'importe quel email et mot de passe pour tester.</>
                ) : (
                  <>Compte de test : <span className="text-white font-mono">admin@nexuscrm.com</span> / <span className="text-white font-mono">admin123</span></>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secured by NexusGrowth • v2.0</p>
        </div>
      </div>
    </div>
  );
};
