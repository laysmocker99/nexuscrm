import React from 'react';
import { Lead, LeadStatus } from '../types';
import { MoreHorizontal, Calendar, ArrowRight, DollarSign } from 'lucide-react';

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
  return (
    <div className="flex-1 flex overflow-x-auto gap-6 pb-4 px-2 hide-scroll">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.id);
        const stageTotal = stageLeads.reduce((acc, curr) => acc + curr.value, 0);

        return (
          <div key={stage.id} className="flex-shrink-0 w-[300px] flex flex-col h-full">
            {/* Minimal Header */}
            <div className="flex justify-between items-end mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg text-gray-800">{stage.label}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
                {stageTotal > 0 && <span className="text-xs text-gray-400 font-medium">€{stageTotal > 1000 ? (stageTotal/1000).toFixed(0) + 'k' : stageTotal}</span>}
            </div>

            {/* Column Body */}
            <div className="flex-1 rounded-[32px] bg-gray-50/50 p-3 space-y-3 border border-gray-100/50 overflow-y-auto custom-scroll">
              {stageLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => onLeadClick(lead)}
                  className="group bg-white p-5 rounded-[24px] shadow-sm border border-transparent hover:border-gray-200 hover:shadow-md transition-all cursor-pointer relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <button className="text-gray-300 hover:text-black">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-0.5">{lead.firstName} {lead.lastName}</h4>
                  <p className="text-xs text-gray-400 mb-4">{lead.company}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                    <span className="font-semibold text-sm text-gray-900">€{lead.value.toLocaleString()}</span>
                    <span className="text-[10px] px-2 py-1 bg-gray-50 rounded-md text-gray-500">{lead.channel.split(' ')[0]}</span>
                  </div>

                  {/* Move Button */}
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
                            className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                            <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                  )}
                </div>
              ))}
              
              {stageLeads.length === 0 && (
                <div className="h-32 flex items-center justify-center">
                    <span className="text-xs text-gray-300 font-medium">Aucune opportunité</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};