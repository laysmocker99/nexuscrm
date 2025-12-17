import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Lock, User, Mail, Shield, Zap, Globe, BarChart, Sparkles, Play } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(() => {
        onLogin();
    }, 500);
  };

  const handleDemoAccess = () => {
      // Direct access for demo
      onLogin();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto w-full">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">N</div>
            <span className="font-bold text-xl tracking-tight">NexusGrowth</span>
         </div>
         <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500 items-center">
             <a href="#" className="hover:text-black transition-colors">Fonctionnalités</a>
             <a href="#" className="hover:text-black transition-colors">Solutions</a>
             <button onClick={handleDemoAccess} className="text-black hover:text-[#7ab848] transition-colors flex items-center gap-1">
                 <Play className="w-3 h-3 fill-current" /> Démo
             </button>
         </div>
         <button 
            onClick={() => setIsLogin(true)} 
            className="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full transition-colors"
         >
            Se connecter
         </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 max-w-7xl mx-auto px-6 md:px-8 pt-10 pb-20 grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Left: Copy */}
        <div className="animate-slide-in">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B4F481]/20 border border-[#B4F481] rounded-full text-xs font-bold text-green-800 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Nouvelle version 2.0 disponible
             </div>
             <h1 className="text-6xl md:text-7xl font-medium tracking-tighter leading-[1.1] mb-6">
                Le CRM qui <span className="text-gray-400">réfléchit</span> <br />à votre place.
             </h1>
             <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                Automatisez votre pipeline, qualifiez vos leads avec l'IA et générez des devis en quelques secondes. Concentrez-vous sur la clôture, Nexus gère le reste.
             </p>
             
             <div className="flex items-center gap-6">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${['bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-gray-800'][i-1]}`}>
                            {['JD', 'AL', 'MR', '+'][i-1]}
                        </div>
                    ))}
                 </div>
                 <div className="text-sm font-medium text-gray-600">
                    <span className="font-bold text-black">2,000+</span> agences nous font confiance
                 </div>
             </div>
        </div>

        {/* Right: Auth Card */}
        <div className="relative animate-slide-in" style={{ animationDelay: '0.1s' }}>
            {/* Decor Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B4F481] rounded-full blur-[60px] opacity-40 pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

            <div className="bg-[#f2f2f2] p-3 rounded-[40px] relative">
                <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-white">
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-medium mb-2">{isLogin ? 'Bon retour 👋' : 'Créer votre compte'}</h2>
                        <p className="text-gray-400 text-sm">Accédez à votre espace de travail intelligent</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email professionnel</label>
                            <div className="bg-gray-50 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-black focus-within:bg-white transition-all group">
                                <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nom@entreprise.com"
                                    className="bg-transparent outline-none w-full text-sm font-medium text-gray-800 placeholder-gray-300" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mot de passe</label>
                             <div className="bg-gray-50 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-black focus-within:bg-white transition-all group">
                                <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-transparent outline-none w-full text-sm font-medium text-gray-800 placeholder-gray-300" 
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                <span className="text-xs text-gray-500">J'accepte les <a href="#" className="underline text-black">Conditions d'utilisation</a></span>
                            </div>
                        )}

                        <button className="w-full bg-black text-white rounded-xl py-4 font-bold text-sm hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group mt-4">
                            {isLogin ? 'Se connecter' : "Commencer l'essai gratuit"} 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">Ou essayer</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={handleDemoAccess}
                            className="w-full bg-[#B4F481] text-black rounded-xl py-4 font-bold text-sm hover:bg-[#a3e665] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                            Accès Démo Instantané
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs text-gray-500 hover:text-black font-medium transition-colors"
                        >
                            {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Value Props / Journey Strip */}
      <div className="bg-[#121212] text-white py-24 rounded-t-[60px] mt-auto">
          <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-light mb-4">Votre parcours vers la croissance</h2>
                  <p className="text-gray-400">Une suite d'outils interconnectés pour accélérer votre business.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                  {/* Connector Line */}
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 z-0"></div>

                  <div className="relative z-10 bg-[#1a1a1a] p-8 rounded-[32px] border border-white/5 hover:border-[#B4F481]/50 transition-colors group">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#B4F481] group-hover:text-black transition-all">
                          <Globe className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">1. Connectez</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Centralisez toutes vos sources de leads (Site Web, LinkedIn, Ads) en un seul endroit sécurisé.</p>
                  </div>

                   <div className="relative z-10 bg-[#1a1a1a] p-8 rounded-[32px] border border-white/5 hover:border-[#B4F481]/50 transition-colors group">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#B4F481] group-hover:text-black transition-all">
                          <BarChart className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">2. Analysez</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Laissez notre IA scorer vos prospects et détecter les meilleures opportunités en temps réel.</p>
                  </div>

                   <div className="relative z-10 bg-[#1a1a1a] p-8 rounded-[32px] border border-white/5 hover:border-[#B4F481]/50 transition-colors group">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#B4F481] group-hover:text-black transition-all">
                          <Zap className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">3. Convertissez</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Générez des devis parfaits et suivez les signatures. Transformez l'intérêt en revenu.</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};