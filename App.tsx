import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  Kanban, 
  Users, 
  Settings, 
  BarChart2,
  Menu,
  Plus,
  Receipt,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  User,
  Bell,
  Lock,
  Globe
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Pipeline } from './components/Pipeline';
import { LeadDetail } from './components/LeadDetail';
import { AnalyticsView } from './components/AnalyticsView';
import { QuotesView } from './components/QuotesView';
import { MOCK_LEADS } from './constants';
import { Lead, LeadStatus, Quote } from './types';

// Router Types
type View = 'dashboard' | 'pipeline' | 'leads' | 'analytics' | 'quotes' | 'settings';
type SortKey = 'name' | 'value' | 'status' | 'channel';
type SortDirection = 'asc' | 'desc';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetailInitialTab, setLeadDetailInitialTab] = useState<'email' | 'quote'>('email');

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'value', direction: 'desc' });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
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

  const sortedLeads = useMemo(() => {
      let sorted = [...leads];
      sorted.sort((a, b) => {
          let aValue: any = '';
          let bValue: any = '';

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
      return sorted;
  }, [leads, sortConfig]);

  const SortIcon = ({ column }: { column: SortKey }) => {
      if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />;
      return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-black" /> : <ChevronDown className="w-3 h-3 text-black" />;
  };

  const NavItem = ({ view, icon: Icon }: { view: View; icon: any }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all mb-4 ${
        currentView === view 
          ? 'bg-black text-white shadow-lg scale-110' 
          : 'text-gray-400 hover:bg-white hover:text-black hover:shadow-sm'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex p-4 gap-4 overflow-hidden font-sans">
      
      {/* Floating Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 bg-[#F2F2F2]">
        <div className="mb-8">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl">
                N
            </div>
        </div>

        <nav className="flex-1 flex flex-col items-center">
          <NavItem view="dashboard" icon={LayoutGrid} />
          <NavItem view="pipeline" icon={Kanban} />
          <NavItem view="leads" icon={Users} />
          <NavItem view="analytics" icon={BarChart2} />
          <NavItem view="quotes" icon={Receipt} />
          <NavItem view="settings" icon={Settings} />
        </nav>

        <div className="mt-auto">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-black shadow-sm">
                <Menu className="w-5 h-5" />
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 rounded-[32px] bg-white/50 backdrop-blur-3xl shadow-sm border border-white/60 relative overflow-hidden flex flex-col">
        {/* Top Decorative Background for visual depth */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scroll p-8">
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
                <div className="h-full flex flex-col animate-slide-in">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-light tracking-tight text-black mb-1">Pipeline</h1>
                            <p className="text-gray-400">Gérez votre flux d'affaires</p>
                        </div>
                        <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center transition-all shadow-lg hover:shadow-xl">
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
                <div className="animate-slide-in">
                     <h1 className="text-4xl font-light tracking-tight text-black mb-8">Tous les Leads</h1>
                     <div className="bg-white rounded-[32px] border border-gray-100 p-2 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase text-gray-400 font-medium border-b border-gray-50">
                                <tr>
                                    <th 
                                        onClick={() => handleSort('name')}
                                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">Lead <SortIcon column="name" /></div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('status')}
                                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">Statut <SortIcon column="status" /></div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('value')}
                                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">Valeur <SortIcon column="value" /></div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('channel')}
                                        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">Source <SortIcon column="channel" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLeads.map(lead => (
                                    <tr 
                                        key={lead.id} 
                                        onClick={() => { setSelectedLead(lead); setLeadDetailInitialTab('email'); }}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</div>
                                            <div className="text-xs text-gray-400">{lead.company}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {lead.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-medium">€{lead.value.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-gray-400 text-sm">{lead.channel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {currentView === 'settings' && (
                <div className="animate-slide-in max-w-3xl">
                     <h1 className="text-4xl font-light tracking-tight text-black mb-8">Paramètres</h1>
                     
                     <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
                        
                        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <User className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Profil</h3>
                                    <p className="text-sm text-gray-400">Gérez vos informations personnelles</p>
                                </div>
                            </div>
                            <button className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Modifier</button>
                        </div>

                        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <Bell className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Notifications</h3>
                                    <p className="text-sm text-gray-400">Alertes emails et push</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-[#B4F481] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <Globe className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Langue</h3>
                                    <p className="text-sm text-gray-400">Langue de l'interface et de l'IA</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold bg-gray-50 px-3 py-1 rounded-lg">Français (FR)</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <Lock className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Sécurité</h3>
                                    <p className="text-sm text-gray-400">Mot de passe et 2FA</p>
                                </div>
                            </div>
                            <button className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Configurer</button>
                        </div>

                     </div>
                     
                     <div className="mt-6 text-center text-xs text-gray-400">
                         NexusGrowth CRM v1.2.0 • Build 2024
                     </div>
                </div>
            )}
        </div>
      </main>

      {/* Lead Detail Modal */}
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

export default App;