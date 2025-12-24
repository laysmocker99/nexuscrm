import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid, BarChart2, Zap, Users, Shield, Globe,
  ArrowRight, CheckCircle2, Menu, X
} from 'lucide-react';
import { isDemoMode } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#B4F481] selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg">N</div>
            <span className="font-bold text-xl tracking-tight">NexusGrowth</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytique</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 group"
            >
              Démarrer {isDemoMode ? '(Démo)' : ''}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a href="#features" onClick={toggleMenu}>Fonctionnalités</a>
            <a href="#analytics" onClick={toggleMenu}>Analytique</a>
            <a href="#pricing" onClick={toggleMenu}>Tarifs</a>
            <hr className="border-white/10" />
            <button onClick={() => navigate('/login')} className="text-left">Se connecter</button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-black px-5 py-3 rounded-xl text-center font-bold"
            >
              Démarrer maintenant
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#B4F481] mb-6">
              <Zap className="w-3 h-3" />
              <span>Nouvelle version 2.0 disponible</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Le CRM intelligent pour<br />les équipes modernes.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Centralisez vos leads, optimisez votre pipeline et analysez vos performances.
              NexusGrowth transforme vos données en croissance, sans la complexité.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all">
                Voir la démo
              </button>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-6xl"
          >
            <div className="rounded-xl bg-[#121212] border border-white/10 p-2 shadow-2xl">
              <div className="rounded-lg overflow-hidden bg-[#1E1E1E] aspect-video relative flex items-center justify-center">
                 {/* Abstract representation of the dashboard */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-50"></div>
                 <div className="z-10 text-center">
                    <LayoutGrid className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono text-sm">NexusGrowth Dashboard Interface</p>
                 </div>

                 {/* Overlay Grid lines for tech feel */}
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
              </div>
            </div>
            {/* Glow effect under the image */}
            <div className="absolute -inset-4 bg-gradient-to-t from-blue-500/20 to-purple-500/20 blur-2xl -z-10 rounded-full opacity-40"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Tout ce dont vous avez besoin.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une suite complète d'outils pour gérer votre relation client, de la prospection à la facturation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des Leads</h3>
              <p className="text-gray-400 leading-relaxed">
                Centralisez vos contacts, suivez les interactions et ne perdez plus jamais une opportunité commerciale.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytique Avancée</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualisez vos KPIs en temps réel. Taux de conversion, revenus prévisionnels et performance par canal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sécurité & Données</h3>
              <p className="text-gray-400 leading-relaxed">
                Vos données sont cryptées et stockées en toute sécurité. Exportez vos informations à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">Ils font confiance à NexusGrowth</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale">
            {/* Logos placeholders */}
            <div className="flex items-center gap-2 text-xl font-bold"><Globe className="w-6 h-6" /> TechFlow</div>
            <div className="flex items-center gap-2 text-xl font-bold"><Zap className="w-6 h-6" /> BoltShift</div>
            <div className="flex items-center gap-2 text-xl font-bold"><LayoutGrid className="w-6 h-6" /> GridLock</div>
            <div className="flex items-center gap-2 text-xl font-bold"><Users className="w-6 h-6" /> CrowdSource</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#111]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Prêt à accélérer votre croissance ?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Rejoignez les centaines d'entreprises qui utilisent NexusGrowth pour structurer leur activité commerciale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#B4F481] text-black rounded-full font-bold text-lg hover:bg-[#a0e070] transition-all w-full sm:w-auto"
            >
              Commencer maintenant
            </button>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#B4F481]" /> Pas de carte requise</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#B4F481]" /> 14 jours gratuits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-6 h-6 bg-white text-black rounded flex items-center justify-center font-bold text-xs">N</div>
              <span className="font-bold text-lg tracking-tight">NexusGrowth</span>
            </div>
            <p className="max-w-xs">
              La plateforme CRM conçue pour la simplicité et la performance.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Produit</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white">Tarifs</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">À propos</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 NexusGrowth Inc. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Confidentialité</a>
            <a href="#" className="hover:text-white">CGU</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
