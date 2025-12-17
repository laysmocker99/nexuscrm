import React, { useState } from 'react';
import { Lead, Quote } from '../types';
import { FileText, Download, Send, CheckCircle, Clock, Plus, X, Search } from 'lucide-react';

interface QuotesViewProps {
  leads: Lead[];
  onCreateQuoteRequest: (lead: Lead) => void;
}

// Helper to flatten quotes from leads
const getAllQuotes = (leads: Lead[]) => {
    const quotes: (Quote & { leadName: string; company: string })[] = [];
    leads.forEach(lead => {
        if (lead.quotes) {
            lead.quotes.forEach(quote => {
                quotes.push({
                    ...quote,
                    leadName: `${lead.firstName} ${lead.lastName}`,
                    company: lead.company
                });
            });
        }
    });
    return quotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'ACCEPTED':
            return <span className="px-3 py-1 bg-[#B4F481] text-black rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Signé</span>;
        case 'SENT':
            return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Send className="w-3 h-3" /> Envoyé</span>;
        default:
            return <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Brouillon</span>;
    }
};

export const QuotesView: React.FC<QuotesViewProps> = ({ leads, onCreateQuoteRequest }) => {
    const [isSelectingClient, setIsSelectingClient] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const allQuotes = getAllQuotes(leads);
    const totalValue = allQuotes.reduce((acc, q) => acc + q.totalAmount, 0);
    const signedValue = allQuotes.filter(q => q.status === 'ACCEPTED').reduce((acc, q) => acc + q.totalAmount, 0);

    const filteredLeads = leads.filter(l => 
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-slide-in relative pb-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-1">Gestion des Devis</h1>
                    <p className="text-gray-400">Suivi des propositions commerciales et facturation</p>
                </div>
                <button 
                    onClick={() => setIsSelectingClient(true)}
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center transition-all shadow-lg hover:shadow-xl w-full md:w-auto justify-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un Devis
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between transition-colors">
                    <div>
                        <div className="text-3xl font-light mb-1 dark:text-white">€{totalValue.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Pipeline Devis</div>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/10 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
                <div className="bg-[#B4F481] p-6 rounded-[32px] shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-light mb-1 text-black">€{signedValue.toLocaleString()}</div>
                        <div className="text-xs text-black/60 uppercase tracking-wider font-bold">Revenu Signé</div>
                    </div>
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-black" />
                    </div>
                </div>
                <div className="bg-black dark:bg-black text-white p-6 rounded-[32px] shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-light mb-1">{allQuotes.length}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Devis Générés</div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Send className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[32px] border border-gray-100 dark:border-white/10 p-2 shadow-sm overflow-x-auto transition-colors">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="text-xs uppercase text-gray-400 font-medium border-b border-gray-50 dark:border-white/5">
                        <tr>
                            <th className="px-6 py-4">Référence</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Montant HT</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allQuotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-5 font-medium text-gray-900 dark:text-white">{quote.id}</td>
                                <td className="px-6 py-5">
                                    <div className="font-medium text-gray-900 dark:text-white">{quote.company}</div>
                                    <div className="text-xs text-gray-400">{quote.leadName}</div>
                                </td>
                                <td className="px-6 py-5 text-gray-500 dark:text-gray-400 text-sm">{quote.date}</td>
                                <td className="px-6 py-5 font-medium text-lg dark:text-white">€{quote.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-5">
                                    <StatusBadge status={quote.status} />
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors" title="Télécharger PDF">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-black dark:bg-white dark:text-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md" title="Envoyer">
                                            <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {allQuotes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    Aucun devis généré pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Client Selection Modal */}
            {isSelectingClient && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-slide-in transition-colors">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-medium text-lg text-black dark:text-white">Sélectionner un Client</h3>
                            <button onClick={() => setIsSelectingClient(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-white/5">
                            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2 flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher..." 
                                    className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scroll">
                            {filteredLeads.map(lead => (
                                <div 
                                    key={lead.id} 
                                    onClick={() => {
                                        onCreateQuoteRequest(lead);
                                        setIsSelectingClient(false);
                                    }}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-50 dark:border-white/5 transition-colors flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{lead.company}</div>
                                        <div className="text-xs text-gray-400">{lead.firstName} {lead.lastName}</div>
                                    </div>
                                    <Plus className="w-4 h-4 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};