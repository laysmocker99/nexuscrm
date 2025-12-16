import React from 'react';
import { 
  Plus, 
  Search, 
  Video, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  MoreHorizontal,
  Mic,
  Phone,
  MessageSquare
} from 'lucide-react';
import { MOCK_LEADS } from '../constants';
import { Lead } from '../types';

interface DashboardProps {
    onOpenLead: (lead: Lead) => void;
}

const Avatar = ({ name, bg = "bg-gray-200" }: { name: string, bg?: string }) => (
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-xs font-bold text-gray-700 border-2 border-white`}>
        {name.substring(0, 2).toUpperCase()}
    </div>
);

const HotScale = ({ level }: { level: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
            <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i <= level ? 'bg-orange-400' : 'bg-gray-200'}`}
            ></div>
        ))}
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onOpenLead }) => {
  return (
    <div className="animate-slide-in relative">
      
      {/* Top Floating Bar (Schedule) */}
      <div className="flex justify-center mb-10">
        <div className="bg-black text-white rounded-full p-2 pl-6 pr-2 flex items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
                <span className="font-medium">Votre Agenda</span>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="opacity-60">28 Mars</span>
                </div>
            </div>
            
            {/* Timeline Segment */}
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    <Avatar name="JD" bg="bg-green-200" />
                    <Avatar name="AM" bg="bg-blue-200" />
                </div>
                <div className="bg-[#B4F481] text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    14:00 <ArrowUpRight className="w-3 h-3" />
                </div>
            </div>

            <div className="flex items-center gap-2">
                 <div className="bg-gray-800 rounded-full p-2">
                    <Avatar name="Moi" bg="bg-indigo-400" />
                 </div>
            </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-baseline gap-6">
            <h1 className="text-5xl font-light tracking-tighter text-black uppercase">Espace de Travail</h1>
            <button className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4" /> Nouvelle Tâche
            </button>
        </div>
        
        <div className="flex gap-8 pr-4">
            <div className="text-center">
                <div className="text-3xl font-light">34</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Affaires</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-light">20</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Gagnées</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-light text-gray-300">3</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Perdues</div>
            </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Column (Main) */}
        <div className="flex-1 w-2/3">
            
            {/* New Leads Section */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-xl font-medium">Nouveaux Leads</h2>
                        <span className="text-sm underline decoration-gray-300 underline-offset-4 text-gray-500 cursor-pointer">7 Leads</span>
                    </div>
                    
                    {/* Filter Pills */}
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50">Tous</button>
                        <button className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium flex items-center gap-1 text-orange-500">
                             <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Prioritaire
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="flex gap-4 overflow-x-auto hide-scroll pb-4">
                    {MOCK_LEADS.slice(0, 4).map((lead, idx) => (
                        <div key={lead.id} onClick={() => onOpenLead(lead)} className="bg-white p-5 rounded-[28px] min-w-[260px] shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <Avatar name={lead.firstName + lead.lastName} bg={idx % 2 === 0 ? "bg-pink-100" : "bg-blue-100"} />
                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{lead.firstName} {lead.lastName}</h3>
                            <p className="text-xs text-gray-400 mb-4">{lead.position} chez {lead.company}</p>
                            
                            <div className="flex justify-between items-end">
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-[10px] text-gray-600 font-medium">{lead.channel.split(' ')[0]}</span>
                                </div>
                                <HotScale level={idx === 0 ? 5 : 3} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your Days Tasks */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Tâches du jour</h2>
                    <div className="flex gap-2">
                         <div className="p-2 bg-white rounded-full border border-gray-200">
                            <Search className="w-4 h-4 text-gray-400" />
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Big Lime Card */}
                    <div className="col-span-1 bg-[#B4F481] p-6 rounded-[32px] relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <Avatar name="PT" bg="bg-white" />
                                <div className="bg-black/10 p-2 rounded-full">
                                    <ArrowUpRight className="w-4 h-4 text-black" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-medium text-black mb-2">Google Meet Client</h3>
                            <div className="flex items-center gap-2 mb-8">
                                <div className="flex -space-x-2">
                                    <Avatar name="A" bg="bg-white" />
                                    <Avatar name="B" bg="bg-yellow-200" />
                                </div>
                                <span className="text-xs font-bold text-black/70">28.03.2023 à 14h</span>
                            </div>
                            
                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-3 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-500 rounded-full">
                                        <Video className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-black/80">Appel planifié</span>
                                </div>
                                <div className="bg-black text-white p-2 rounded-xl">
                                    <Mic className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Grid Column */}
                    <div className="col-span-1 flex flex-col gap-4">
                        {/* Task Card 1 */}
                        <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex-1 hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-4">
                                <Avatar name="AH" bg="bg-purple-100" />
                                <ArrowUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">Envoyer Proposition</h3>
                            <p className="text-xs text-gray-400 mb-4">Montant € 20,000</p>
                            <div className="bg-gray-50 rounded-xl p-2 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600 pl-2">En attente devis</span>
                                <div className="bg-black text-white p-1.5 rounded-lg">
                                    <FileText className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Task Card 2 */}
                        <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex-1 hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-2">
                                <Avatar name="MF" bg="bg-orange-100" />
                                <ArrowUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                            <h3 className="font-medium text-lg">Appel Découverte</h3>
                             <div className="flex items-center gap-2 mt-2 mb-4">
                                <Avatar name="G" bg="bg-blue-500 text-white" />
                                <span className="text-xs text-gray-500">28.03.2023 à 20h</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600 pl-2">Appel planifié</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Widget (Summary) */}
        <div className="w-1/3 pt-10">
            <div className="bg-black rounded-[40px] p-6 text-white h-full relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[80px] opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B4F481] rounded-full blur-[60px] opacity-10"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#B4F481] rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-medium">Résumé</h3>
                         </div>
                         <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer">
                            <ArrowUpRight className="w-4 h-4" />
                         </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                             <span className="text-sm text-gray-400">Documents:</span>
                             <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">Importer</button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll">
                            <div className="bg-white/10 p-3 rounded-2xl min-w-[100px] hover:bg-white/15 cursor-pointer">
                                <div className="w-full h-16 bg-white/10 rounded-lg mb-2 flex items-center justify-center">
                                    <FileText className="w-4 h-4 opacity-50" />
                                </div>
                                <div className="text-[10px] text-gray-300">Brief.pdf</div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl min-w-[100px] hover:bg-white/15 cursor-pointer">
                                <div className="w-full h-16 bg-white/10 rounded-lg mb-2 flex items-center justify-center">
                                    <FileText className="w-4 h-4 opacity-50" />
                                </div>
                                <div className="text-[10px] text-gray-300">Specs.pdf</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 rounded-3xl p-5 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg">Objectif:</span>
                            <div className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white">
                                <MoreHorizontal />
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Réduire le nombre d'incidents de sécurité de 50%. Cet objectif est <span className="text-white font-bold">quantifiable et mesurable</span>, et aurait un impact significatif.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                             <div className="bg-[#B4F481] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">AI</div>
                             <div className="text-xs text-gray-400">Généré il y a 2m</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};