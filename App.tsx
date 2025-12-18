import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutGrid, Kanban, Users, Settings, BarChart2, Plus, Receipt,
  ArrowUpDown, ChevronDown, ChevronUp, Filter, Search, X, LogOut, Moon, Sun
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Pipeline } from './components/Pipeline';
import { LeadDetail } from './components/LeadDetail';
import { AnalyticsView } from './components/AnalyticsView';
import { QuotesView } from './components/QuotesView';
import { LoginPage } from './components/LoginPage';
import { ToastProvider, useToast } from './components/Toast';
import { authAPI, leadsAPI } from './services/supabase-api';
import { Lead, LeadStatus, Quote, AcquisitionChannel } from './types';

type View = 'dashboard' | 'pipeline' | 'leads' | 'analytics' | 'quotes' | 'settings';
type SortKey = 'name' | 'value' | 'status' | 'channel';
type SortDirection = 'asc' | 'desc';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetailInitialTab, setLeadDetailInitialTab] = useState<'email' | 'quote'>('email');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');
  const [filterChannel, setFilterChannel] = useState<AcquisitionChannel | 'ALL'>('ALL');
  const [filterMinVal, setFilterMinVal] = useState<string>('');
  const [filterMaxVal, setFilterMaxVal] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'value', direction: 'desc' });

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load leads from API
  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsAPI.getAll();
      setLeads(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await leadsAPI.updateStatus(leadId, newStatus);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      showToast('Statut mis à jour', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleSaveQuote = (leadId: string, newQuote: Quote) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, quotes: [...(l.quotes || []), newQuote] };
      }
      return l;
    }));
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('ALL');
    setFilterChannel('ALL');
    setFilterMinVal('');
    setFilterMaxVal('');
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setLeads([]);
    showToast('Déconnexion réussie', 'info');
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = leads.filter(lead => {
      const searchString = `${lead.firstName} ${lead.lastName} ${lead.company}`.toLowerCase();
      if (searchTerm && !searchString.includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== 'ALL' && lead.status !== filterStatus) return false;
      if (filterChannel !== 'ALL' && lead.channel !== filterChannel) return false;
      if (filterMinVal && lead.value < parseFloat(filterMinVal)) return false;
      if (filterMaxVal && lead.value > parseFloat(filterMaxVal)) return false;
      return true;
    });

    result.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortConfig.key) {
        case 'name':
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'channel':
          aValue = a.channel;
          bValue = b.channel;
          break;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [leads, sortConfig, searchTerm, filterStatus, filterChannel, filterMinVal, filterMaxVal]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 dark:text-gray-500" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-black dark:text-white" /> : <ChevronDown className="w-3 h-3 text-black dark:text-white" />;
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`
          relative group flex items-center transition-all duration-300
          md:justify-center md:w-12 md:h-12 md:rounded-2xl
          lg:justify-start lg:w-full lg:h-auto lg:px-4 lg:py-3.5 lg:rounded-xl
          ${isActive
            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg lg:shadow-xl lg:translate-x-1'
            : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1a1a1a] hover:text-black dark:hover:text-white hover:shadow-sm'
          }
        `}
      >
        <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white dark:text-black' : ''}`} />
        <span className={`hidden lg:block ml-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'text-white dark:text-black' : ''}`}>
          {label}
        </span>
        <div className="hidden md:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-medium px-2 py-1 rounded opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-white"></div>
        </div>
        {isActive && (
          <div className="hidden lg:block absolute right-3 w-1.5 h-1.5 rounded-full bg-[#B4F481] dark:bg-black"></div>
        )}
      </button>
    );
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#121212] flex flex-col md:flex-row p-0 md:p-4 gap-0 md:gap-4 overflow-hidden font-sans transition-colors duration-300">

      <aside className="hidden md:flex flex-col py-6 bg-[#F2F2F2] dark:bg-[#121212] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        md:w-20 lg:w-72 h-screen sticky top-0 z-30 border-r border-gray-200/50 dark:border-white/5 lg:border-none lg:bg-transparent lg:pl-4">

        <div className="mb-10 flex items-center md:justify-center lg:justify-start lg:px-4">
          <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0 cursor-pointer hover:scale-105 transition-transform">
            N
          </div>
          <div className="hidden lg:block ml-3">
            <h1 className="font-bold text-lg tracking-tight leading-tight dark:text-white">NexusGrowth</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Workspace</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col md:items-center lg:items-stretch gap-3 lg:px-2">
          <NavItem view="dashboard" icon={LayoutGrid} label="Tableau de bord" />
          <NavItem view="pipeline" icon={Kanban} label="Pipeline" />
          <NavItem view="leads" icon={Users} label="Mes Leads" />
          <NavItem view="analytics" icon={BarChart2} label="Analytique" />
          <NavItem view="quotes" icon={Receipt} label="Devis & Factures" />
          <div className="my-2 md:hidden lg:block border-t border-gray-200/60 dark:border-white/10 mx-4"></div>
          <NavItem view="settings" icon={Settings} label="Paramètres" />
        </nav>

        <div className="mt-auto flex flex-col md:items-center lg:items-stretch lg:px-2 gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-[#1a1a1a] hover:shadow-sm transition-all text-gray-500 dark:text-gray-400"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm shrink-0 group-hover:text-[#B4F481] transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Mode {isDarkMode ? 'Clair' : 'Sombre'}</p>
              <p className="text-[10px] text-gray-400">Apparence</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-[#1a1a1a] hover:shadow-sm transition-all text-gray-500 hover:text-red-500 dark:hover:text-red-400"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm shrink-0 group-hover:border-red-100 transition-colors">
              <LogOut className="w-4 h-4 ml-0.5" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">Déconnexion</p>
              <p className="text-[10px] text-gray-400">Session sécurisée</p>
            </div>
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full md:rounded-[32px] bg-white/50 dark:bg-[#1a1a1a] backdrop-blur-3xl shadow-sm border-0 md:border border-white/60 dark:border-white/5 relative overflow-hidden flex flex-col h-screen md:h-auto transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent dark:from-white/5 dark:to-transparent opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex-1 overflow-y-auto custom-scroll p-4 md:p-8 mb-16 md:mb-0">
          {currentView === 'dashboard' && <Dashboard onOpenLead={(l) => { setSelectedLead(l); setLeadDetailInitialTab('email'); }} />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'quotes' && (
            <QuotesView
              leads={leads}
              onCreateQuoteRequest={(l) => {
                setSelectedLead(l);
                setLeadDetailInitialTab('quote');
              }}
            />
          )}

          {currentView === 'pipeline' && (
            <div className="h-full flex flex-col animate-slide-in pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-1">Pipeline</h1>
                  <p className="text-gray-400">Gérez votre flux d'affaires</p>
                </div>
                <button className="bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center transition-all shadow-lg hover:shadow-xl w-full md:w-auto justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Affaire
                </button>
              </div>
              <Pipeline
                leads={leads}
                onLeadClick={(l) => { setSelectedLead(l); setLeadDetailInitialTab('email'); }}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}

          {currentView === 'leads' && (
            <div className="animate-slide-in pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-1">Base Leads</h1>
                  <p className="text-gray-400">Filtrage et analyse de la base de données</p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto ${showFilters ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-300 hover:shadow-md'}`}
                >
                  <Filter className="w-3 h-3" /> Filtres Avancés
                </button>
              </div>

              {showFilters && (
                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-[24px] border border-gray-100 dark:border-white/10 shadow-sm mb-6 animate-slide-in transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Recherche</label>
                      <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2 border border-transparent focus-within:border-black dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-[#252525] transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Nom, entreprise..."
                          className="bg-transparent outline-none w-full text-sm dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Statut</label>
                      <div className="relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'ALL')}
                          className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl px-3 py-2 text-sm appearance-none outline-none border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#252525] transition-all cursor-pointer"
                        >
                          <option value="ALL">Tous les statuts</option>
                          {Object.values(LeadStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Canal</label>
                      <div className="relative">
                        <select
                          value={filterChannel}
                          onChange={(e) => setFilterChannel(e.target.value as AcquisitionChannel | 'ALL')}
                          className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl px-3 py-2 text-sm appearance-none outline-none border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#252525] transition-all cursor-pointer"
                        >
                          <option value="ALL">Toutes les sources</option>
                          {Object.values(AcquisitionChannel).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Valeur (€)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filterMinVal}
                          onChange={(e) => setFilterMinVal(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#252525] transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filterMaxVal}
                          onChange={(e) => setFilterMaxVal(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#252525] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                    <button
                      onClick={resetFilters}
                      className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-[#1E1E1E] rounded-[32px] border border-gray-100 dark:border-white/10 p-2 shadow-sm overflow-x-auto transition-colors">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="text-xs uppercase text-gray-400 font-medium border-b border-gray-50 dark:border-white/5">
                    <tr>
                      <th
                        onClick={() => handleSort('name')}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2">Lead <SortIcon column="name" /></div>
                      </th>
                      <th
                        onClick={() => handleSort('status')}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2">Statut <SortIcon column="status" /></div>
                      </th>
                      <th
                        onClick={() => handleSort('value')}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2">Valeur <SortIcon column="value" /></div>
                      </th>
                      <th
                        onClick={() => handleSort('channel')}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2">Source <SortIcon column="channel" /></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLeads.length > 0 ? (
                      filteredAndSortedLeads.map(lead => (
                        <tr
                          key={lead.id}
                          onClick={() => { setSelectedLead(lead); setLeadDetailInitialTab('email'); }}
                          className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="font-semibold text-gray-900 dark:text-white">{lead.firstName} {lead.lastName}</div>
                            <div className="text-xs text-gray-400">{lead.company}</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-black/50 group-hover:shadow-sm transition-all whitespace-nowrap">
                              {lead.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-medium dark:text-gray-200">€{lead.value.toLocaleString()}</td>
                          <td className="px-6 py-5 text-gray-400 text-sm">{lead.channel}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                          {loading ? 'Chargement...' : 'Aucun lead ne correspond à vos critères de recherche.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-right px-4">
                {filteredAndSortedLeads.length} lead(s) affiché(s) sur {leads.length}
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="animate-slide-in max-w-3xl pb-4">
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-6 md:mb-8">Paramètres</h1>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-[32px] border border-gray-100 dark:border-white/10 p-6 md:p-8 shadow-sm space-y-6 md:space-y-8 transition-colors">
                <div className="text-center text-sm text-gray-400">
                  Paramètres de l'application (à venir)
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-400">
                NexusGrowth CRM v2.0.0 • Build 2025
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 py-3 px-6 flex justify-between items-center z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-black dark:text-white' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-full transition-all ${currentView === 'dashboard' ? 'bg-black dark:bg-white text-white dark:text-black' : ''}`}>
            <LayoutGrid className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setCurrentView('pipeline')}
          className={`flex flex-col items-center gap-1 ${currentView === 'pipeline' ? 'text-black dark:text-white' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-full transition-all ${currentView === 'pipeline' ? 'bg-black dark:bg-white text-white dark:text-black' : ''}`}>
            <Kanban className="w-5 h-5" />
          </div>
        </button>

        <div className="-mt-8">
          <button
            onClick={() => setCurrentView('leads')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${currentView === 'leads' ? 'bg-[#B4F481] text-black ring-4 ring-white dark:ring-[#121212]' : 'bg-black dark:bg-white text-white dark:text-black'}`}
          >
            <Users className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center gap-1 ${currentView === 'analytics' ? 'text-black dark:text-white' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-full transition-all ${currentView === 'analytics' ? 'bg-black dark:bg-white text-white dark:text-black' : ''}`}>
            <BarChart2 className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setCurrentView('quotes')}
          className={`flex flex-col items-center gap-1 ${currentView === 'quotes' ? 'text-black dark:text-white' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-full transition-all ${currentView === 'quotes' ? 'bg-black dark:bg-white text-white dark:text-black' : ''}`}>
            <Receipt className="w-5 h-5" />
          </div>
        </button>
      </nav>

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          initialTab={leadDetailInitialTab}
          onClose={() => setSelectedLead(null)}
          onSaveQuote={handleSaveQuote}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
