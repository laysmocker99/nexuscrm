import React, { useState, useEffect } from 'react';
import { Lead, QuoteItem, Quote } from '../types';
import { X, Sparkles, Send, Brain, ArrowRight, Receipt, FileText, Mail, Save } from 'lucide-react';
import { analyzeLead, LeadAnalysis, generateQuoteSuggestion, generateQuote } from '../services/gemini';

interface LeadDetailProps {
  lead: Lead;
  initialTab?: 'email' | 'quote';
  onClose: () => void;
  onSaveQuote: (leadId: string, quote: Quote) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, initialTab = 'email', onClose, onSaveQuote }) => {
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Tabs: 'email' or 'quote'
  const [activeTab, setActiveTab] = useState<'email' | 'quote'>(initialTab);
  
  const [emailDraft, setEmailDraft] = useState<string>("");
  const [generatingEmail, setGeneratingEmail] = useState(false);

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [generatingQuote, setGeneratingQuote] = useState(false);

  useEffect(() => {
    const runAnalysis = async () => {
      setLoading(true);
      const result = await analyzeLead(lead);
      setAnalysis(result);
      setLoading(false);
    };
    runAnalysis();
  }, [lead]);

  const handleGenerateEmail = async () => {
      setGeneratingEmail(true);
      const draft = await generateQuoteSuggestion(lead);
      setEmailDraft(draft);
      setGeneratingEmail(false);
  }

  const handleGenerateQuote = async () => {
      setGeneratingQuote(true);
      const items = await generateQuote(lead);
      setQuoteItems(items);
      setGeneratingQuote(false);
  }

  const handleSaveQuoteToCRM = () => {
      if (quoteItems.length === 0) return;

      const totalAmount = quoteItems.reduce((acc, item) => acc + item.total, 0);
      const newQuote: Quote = {
          id: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString().split('T')[0],
          status: 'DRAFT',
          totalAmount: totalAmount,
          items: quoteItems
      };

      onSaveQuote(lead.id, newQuote);
      alert("Devis enregistré avec succès !");
  };

  const quoteTotal = quoteItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex animate-slide-in relative">
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/50 backdrop-blur hover:bg-white rounded-full flex items-center justify-center transition-all"
        >
            <X className="w-5 h-5 text-black" />
        </button>

        {/* Left: AI & Dark Mode Insights */}
        <div className="w-2/5 bg-[#121212] text-white p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F481] rounded-full blur-[100px] opacity-10"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#B4F481] rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-xl font-medium tracking-wide">Nexus AI</h2>
                </div>

                <div className="mb-8">
                    <div className="text-6xl font-light mb-2">{loading ? '...' : analysis?.score || 0}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Score du Lead</div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-6 flex-1">
                    <h3 className="text-xs text-[#B4F481] uppercase tracking-wider mb-3">Analyse Comportementale</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                        {loading ? 'Analyse des interactions du lead...' : analysis?.summary || "Aucune analyse disponible."}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Probabilité de signature</span>
                            <span className="font-bold text-white">{analysis?.dealProbability || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Action Recommandée</div>
                    <div className="bg-[#B4F481] text-black p-4 rounded-2xl font-medium flex justify-between items-center cursor-pointer hover:bg-[#a3e665] transition-colors">
                        {loading ? 'Calcul en cours...' : analysis?.nextAction || "À revoir"}
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Lead Details & Content */}
        <div className="w-3/5 p-10 bg-white overflow-y-auto custom-scroll flex flex-col">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-medium text-black">{lead.firstName} {lead.lastName}</h1>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500 font-medium">{lead.channel}</span>
                </div>
                <p className="text-gray-400">{lead.position} chez <span className="text-black font-medium">{lead.company}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="text-xs text-gray-400 mb-1">Intérêts (Pages Vues)</div>
                    <div className="flex flex-wrap gap-1">
                        {lead.gaData.pagesVisited.map((page, i) => (
                            <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md">{page}</span>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="text-xs text-gray-400 mb-1">Budget Estimé</div>
                    <div className="text-lg font-medium">€{lead.value.toLocaleString()}</div>
                </div>
            </div>

            {/* AI Generator Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-full w-fit">
                <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'email' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    <Mail className="w-3 h-3" /> Email
                </button>
                <button 
                    onClick={() => setActiveTab('quote')}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'quote' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    <Receipt className="w-3 h-3" /> Devis
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 border border-gray-100 rounded-[32px] p-1 shadow-sm relative">
                <div className="bg-gray-50 rounded-[28px] p-6 h-full flex flex-col">
                    
                    {activeTab === 'email' && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Rédaction Intelligente</h3>
                                <button 
                                    onClick={handleGenerateEmail}
                                    disabled={generatingEmail}
                                    className="text-xs bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                                >
                                    <Sparkles className="w-3 h-3 text-[#B4F481]" />
                                    {generatingEmail ? 'Rédaction...' : 'Générer Email'}
                                </button>
                            </div>
                            {emailDraft ? (
                                <div className="animate-slide-in flex-1 flex flex-col">
                                    <textarea 
                                        className="w-full flex-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5 resize-none mb-3"
                                        value={emailDraft}
                                        onChange={(e) => setEmailDraft(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <button className="bg-[#B4F481] text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:shadow-md transition-shadow">
                                            Envoyer <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                                    <span className="text-sm">Générez un email personnalisé basé sur le contexte</span>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'quote' && (
                        <>
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Générateur de Devis</h3>
                                <button 
                                    onClick={handleGenerateQuote}
                                    disabled={generatingQuote}
                                    className="text-xs bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                                >
                                    <Sparkles className="w-3 h-3 text-[#B4F481]" />
                                    {generatingQuote ? 'Création...' : 'Générer Devis'}
                                </button>
                            </div>
                            {quoteItems.length > 0 ? (
                                <div className="animate-slide-in flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                                        <span className="font-bold text-sm">NOUVEAU DEVIS</span>
                                        <span className="text-xs opacity-70">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 flex-1 overflow-y-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="text-gray-400 border-b border-gray-100">
                                                <tr>
                                                    <th className="pb-2 font-normal">Description</th>
                                                    <th className="pb-2 font-normal text-right">Prix</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {quoteItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-3">{item.description}</td>
                                                        <td className="py-3 text-right font-medium">€{item.total.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-sm font-medium">Total HT</span>
                                        <span className="text-lg font-bold">€{quoteTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="p-4 pt-2 flex justify-end gap-2">
                                         <button 
                                            onClick={handleSaveQuoteToCRM}
                                            className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-800"
                                         >
                                            Enregistrer <Save className="w-3 h-3" />
                                        </button>
                                         <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-50">
                                            PDF <FileText className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    <Receipt className="w-8 h-8 mb-2 opacity-20" />
                                    <span className="text-sm text-center">L'IA va créer les lignes de services<br/>basées sur les intérêts du lead</span>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>

      </div>
    </div>
  );
};