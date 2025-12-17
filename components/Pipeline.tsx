import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { MoreHorizontal, ArrowRight } from 'lucide-react';

interface PipelineProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

const STAGES = [
  { id: LeadStatus.NEW, label: 'Nouveau' },
  { id: LeadStatus.QUALIFIED, label: 'Qualifié' },
  { id: LeadStatus.PROPOSAL_SENT, label: 'Proposition' },
  { id: LeadStatus.NEGOTIATION, label: 'Négociation' },
  { id: LeadStatus.CLOSED_WON, label: 'Gagné' },
];

export const Pipeline: React.FC<PipelineProps> = ({ leads, onLeadClick, onStatusChange }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('leadId');
    if (id) {
        onStatusChange(id, newStatus);
    }
    setDraggingId(null);
  };

  const handleDragEnd = () => {
      setDraggingId(null);
  };

  return (
    <div className="flex-1 flex overflow-x-auto gap-4 md:gap-6 pb-4 px-1 custom-scroll min-h-0 h-full">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.id);
        const stageTotal = stageLeads.reduce((acc, curr) => acc + curr.value, 0);
        const isDropTarget = draggingId !== null;

        return (
          <div 
            key={stage.id} 
            className="flex-shrink-0 w-[280px] md:w-[320px] flex flex-col h-full max-h-full transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id as LeadStatus)}
          >
            {/* Minimal Header */}
            <div className="flex justify-between items-center mb-3 px-2 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-wide">{stage.label}</h3>
                    <span className="text-xs text-gray-500 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded-md font-bold">{stageLeads.length}</span>
                </div>
                {stageTotal > 0 && <span className="text-xs text-gray-400 font-medium">€{stageTotal > 1000 ? (stageTotal/1000).toFixed(0) + 'k' : stageTotal}</span>}
            </div>

            {/* Column Body - Drop Zone */}
            <div className={`flex-1 rounded-[24px] p-2 space-y-3 border overflow-y-auto custom-scroll transition-all duration-200 ${
                isDropTarget 
                ? 'bg-gray-100/80 dark:bg-white/10 border-dashed border-gray-300 dark:border-white/20' 
                : 'bg-gray-50/50 dark:bg-white/5 border-gray-200/50 dark:border-white/5'
            }`}>
              {stageLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onLeadClick(lead)}
                  className={`
                    group bg-white dark:bg-[#1E1E1E] p-4 rounded-[20px] shadow-sm border border-transparent dark:border-white/5 
                    hover:border-gray-200 dark:hover:border-white/20 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative
                    ${draggingId === lead.id ? 'opacity-40 scale-95 rotate-1 ring-2 ring-black dark:ring-white' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <button className="text-gray-300 pointer-events-auto hover:text-black dark:hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5 truncate pointer-events-none">{lead.firstName} {lead.lastName}</h4>
                  <p className="text-xs text-gray-400 mb-3 truncate pointer-events-none">{lead.company}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100 dark:border-white/10 pointer-events-none">
                    <span className="font-bold text-xs text-gray-900 dark:text-gray-200">€{lead.value.toLocaleString()}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-white/10 rounded-md text-gray-500 dark:text-gray-400 font-medium truncate max-w-[100px]">{lead.channel.split(' ')[0]}</span>
                  </div>

                  {/* Manual Move Button (Keep for accessibility/mobile backup) */}
                  {stage.id !== LeadStatus.CLOSED_WON && (
                     <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const nextStageIndex = STAGES.findIndex(s => s.id === stage.id) + 1;
                                if (nextStageIndex < STAGES.length) {
                                    onStatusChange(lead.id, STAGES[nextStageIndex].id as LeadStatus);
                                }
                            }}
                            className="bg-black dark:bg-white text-white dark:text-black w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                        >
                            <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                  )}
                </div>
              ))}
              
              {stageLeads.length === 0 && !isDropTarget && (
                <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[16px]">
                    <span className="text-xs text-gray-300 font-medium">Vide</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};