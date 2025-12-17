import React, { useState, useEffect } from 'react';
import { Lead, QuoteItem, Quote } from '../types';
import { X, Sparkles, Send, Brain, ArrowRight, Receipt, FileText, Mail, Save, Plus, Trash2 } from 'lucide-react';
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

  const handleManualQuote = () => {
    setQuoteItems([{ description: 'Service sur mesure', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...quoteItems];
    const item = { ...newItems[index] };

    if (field === 'description') {
        item.description = value as string;
    } else if (field === 'quantity' || field === 'unitPrice') {
        const valStr = value.toString();
        // Allow empty string for better UX during typing
        const numValue = valStr === '' ? 0 : parseFloat(valStr);
        
        if (field === 'quantity') item.quantity = numValue;
        if (field === 'unitPrice') item.unitPrice = numValue;
        
        item.total = (item.quantity || 0) * (item.unitPrice || 0);
    }

    newItems[index] = item;
    setQuoteItems(newItems);
  };

  const addItem = () => {
      setQuoteItems([...quoteItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
      setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-8">
      <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-5xl h-full md:h-[85vh] rounded-none md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slide-in relative transition-colors">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/50 dark:bg-black/50 backdrop-blur hover:bg-white dark:hover:bg-black rounded-full flex items-center justify-center transition-all"
        >
            <X className="w-5 h-5 text-black dark:text-white" />
        </button>

        {/* Left: AI & Dark Mode Insights (Mobile: Top, Desktop: Left) */}
        <div className="w-full md:w-2/5 bg-[#121212] text-white p-6 md:p-10 flex flex-col relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F481] rounded-full blur-[100px] opacity-10"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#B4F481] rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    </div>
                    <h2 className="text-lg md:text-xl font-medium tracking-wide">Nexus AI</h2>
                </div>

                <div className="mb-6 md:mb-8 flex md:block gap-8 items-center">
                    <div>
                        <div className="text-4xl md:text-6xl font-light mb-1 md:mb-2">{loading ? '...' : analysis?.score || 0}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Score du Lead</div>
                    </div>
                    <div className="md:hidden flex-1 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Probabilité</span>
                            <span className="font-bold text-white">{analysis?.dealProbability || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-4 md:p-6 border border-white/10 mb-6 flex-1 hidden md:block">
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
                    <div className="bg-[#B4F481] text-black p-3 md:p-4 rounded-2xl font-medium flex justify-between items-center cursor-pointer hover:bg-[#a3e665] transition-colors text-sm md:text-base">
                        {loading ? 'Calcul en cours...' : analysis?.nextAction || "À revoir"}
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Lead Details & Content */}
        <div className="w-full md:w-3/5 p-6 md:p-10 bg-white dark:bg-[#1E1E1E] overflow-y-auto custom-scroll flex flex-col flex-1">
            <div className="mb-6 md:mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-medium text-black dark:text-white">{lead.firstName} {lead.lastName}</h1>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-xs text-gray-500 dark:text-gray-300 font-medium">{lead.channel}</span>
                </div>
                <p className="text-gray-400 text-sm md:text-base">{lead.position} chez <span className="text-black dark:text-white font-medium">{lead.company}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 md:mb-8">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div className="text-xs text-gray-400 mb-1">Intérêts (Pages Vues)</div>
                    <div className="flex flex-wrap gap-1">
                        {lead.gaData.pagesVisited.map((page, i) => (
                            <span key={i} className="text-[10px] bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 dark:text-gray-300 px-2 py-1 rounded-md">{page}</span>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div className="text-xs text-gray-400 mb-1">Budget Estimé</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">€{lead.value.toLocaleString()}</div>
                </div>
            </div>

            {/* AI Generator Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-white/5 rounded-full w-fit">
                <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-3 md:px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'email' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    <Mail className="w-3 h-3" /> Email
                </button>
                <button 
                    onClick={() => setActiveTab('quote')}
                    className={`px-3 md:px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'quote' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    <Receipt className="w-3 h-3" /> Devis
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 border border-gray-100 dark:border-white/10 rounded-[24px] md:rounded-[32px] p-1 shadow-sm relative min-h-[300px]">
                <div className="bg-gray-50 dark:bg-white/5 rounded-[20px] md:rounded-[28px] p-4 md:p-6 h-full flex flex-col">
                    
                    {activeTab === 'email' && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-sm md:text-base text-gray-900 dark:text-white">Rédaction Intelligente</h3>
                                <button 
                                    onClick={handleGenerateEmail}
                                    disabled={generatingEmail}
                                    className="text-xs bg-black dark:bg-white dark:text-black text-white px-3 md:px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                                >
                                    <Sparkles className="w-3 h-3 text-[#B4F481] dark:text-black" />
                                    {generatingEmail ? '...' : 'Générer'}
                                </button>
                            </div>
                            {emailDraft ? (
                                <div className="animate-slide-in flex-1 flex flex-col">
                                    <textarea 
                                        className="w-full flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 resize-none mb-3 min-h-[200px]"
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
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
                                    <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                                    <span className="text-sm">Générez un email personnalisé basé sur le contexte</span>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'quote' && (
                        <>
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-sm md:text-base text-gray-900 dark:text-white">Générateur de Devis</h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleGenerateQuote}
                                        disabled={generatingQuote}
                                        className="text-xs bg-black dark:bg-white dark:text-black text-white px-3 md:px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        <Sparkles className="w-3 h-3 text-[#B4F481] dark:text-black" />
                                        {generatingQuote ? '...' : 'IA'}
                                    </button>
                                </div>
                            </div>
                            {quoteItems.length > 0 ? (
                                <div className="animate-slide-in flex-1 flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                                    <div className="bg-gray-900 dark:bg-black text-white p-4 flex justify-between items-center">
                                        <span className="font-bold text-sm">ÉDITION DE DEVIS</span>
                                        <span className="text-xs opacity-70">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 flex-1 overflow-x-auto">
                                        <table className="w-full text-left text-sm min-w-[500px]">
                                            <thead className="text-gray-400 border-b border-gray-100 dark:border-white/10">
                                                <tr>
                                                    <th className="pb-2 font-normal pl-2">Description</th>
                                                    <th className="pb-2 font-normal w-16 text-center">Qté</th>
                                                    <th className="pb-2 font-normal w-24 text-right">Prix</th>
                                                    <th className="pb-2 font-normal w-24 text-right">Total</th>
                                                    <th className="pb-2 font-normal w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                                {quoteItems.map((item, idx) => (
                                                    <tr key={idx} className="group">
                                                        <td className="py-2">
                                                            <input 
                                                                type="text" 
                                                                value={item.description}
                                                                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                                                className="w-full bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white py-1 placeholder-gray-300 text-gray-900 dark:text-white"
                                                                placeholder="Description..."
                                                            />
                                                        </td>
                                                        <td className="py-2">
                                                            <input 
                                                                type="number" 
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                                                className="w-full bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white py-1 text-center text-gray-900 dark:text-white"
                                                                min="0"
                                                            />
                                                        </td>
                                                        <td className="py-2">
                                                            <input 
                                                                type="number" 
                                                                value={item.unitPrice}
                                                                onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                                                                className="w-full bg-transparent outline-none border-b border-transparent focus:border-black dark:focus:border-white py-1 text-right text-gray-900 dark:text-white"
                                                                min="0"
                                                            />
                                                        </td>
                                                        <td className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">
                                                            €{item.total.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <button 
                                                                onClick={() => removeItem(idx)}
                                                                className="text-gray-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-all p-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button 
                                            onClick={addItem}
                                            className="mt-4 text-xs font-bold flex items-center gap-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> Ajouter une ligne
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total HT</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">€{quoteTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="p-4 pt-2 flex justify-end gap-2">
                                         <button 
                                            onClick={handleSaveQuoteToCRM}
                                            className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200"
                                         >
                                            Enregistrer <Save className="w-3 h-3" />
                                        </button>
                                         <button className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                            PDF <FileText className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl gap-4 p-4 text-center">
                                    <div className="text-center">
                                        <Receipt className="w-8 h-8 mb-2 opacity-20 mx-auto" />
                                        <span className="text-sm block">Aucun devis en cours</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleManualQuote}
                                            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/20 rounded-full text-xs font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Créer Manuellement
                                        </button>
                                    </div>
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