import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Video, 
  FileText, 
  ArrowUpRight, 
  MoreHorizontal,
  Phone,
  MessageSquare,
  CheckCircle,
  Circle,
  Calendar as CalendarIcon,
  Trash2,
  X
} from 'lucide-react';
import { MOCK_LEADS } from '../constants';
import { Lead, Task, CalendarEvent } from '../types';

interface DashboardProps {
    onOpenLead: (lead: Lead) => void;
}

const Avatar: React.FC<{ name: string; bg?: string }> = ({ name, bg = "bg-gray-200" }) => (
    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-[10px] font-bold text-gray-700 border-2 border-white dark:border-[#1E1E1E]`}>
        {name.substring(0, 2).toUpperCase()}
    </div>
);

const HotScale = ({ level }: { level: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'}`}
            ></div>
        ))}
    </div>
);

const MOCK_TASKS: Task[] = [
    { id: 't-1', title: 'Google Meet Client', type: 'meeting', date: '2023-03-28', time: '14:00', completed: false, priority: true, description: 'Appel planifié' },
    { id: 't-2', title: 'Envoyer Proposition', type: 'proposal', date: '2023-03-28', amount: 20000, completed: false, priority: false },
    { id: 't-3', title: 'Appel Découverte', type: 'call', date: '2023-03-28', time: '20:00', completed: false, priority: false, description: 'Prospect chaud' },
    { id: 't-4', title: 'Relance Email', type: 'email', date: '2023-03-28', completed: true, priority: false },
    { id: 't-5', title: 'Préparer Contrat', type: 'todo', date: '2023-03-28', completed: false, priority: true },
];

const MOCK_EVENTS: CalendarEvent[] = [
    { id: 'e-1', title: 'Point Hebdo', time: '09:00', participants: ['JD', 'AM'] },
    { id: 'e-2', title: 'Déjeuner Client', time: '12:30', participants: ['Client'] },
];

export const Dashboard: React.FC<DashboardProps> = ({ onOpenLead }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<Task['type']>('todo');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(false);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleAddTask = () => {
      if (!newTaskTitle) return;
      const newTask: Task = {
          id: `t-${Date.now()}`,
          title: newTaskTitle,
          type: newTaskType,
          date: new Date().toISOString().split('T')[0],
          time: newTaskTime || undefined,
          completed: false,
          priority: newTaskPriority
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskTime('');
      setNewTaskPriority(false);
      setIsTaskModalOpen(false);
  };

  const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setTasks(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) {
          if (a.priority === b.priority) return 0;
          return a.priority ? -1 : 1;
      }
      return a.completed ? 1 : -1;
  });

  const activeTasksCount = tasks.filter(t => !t.completed).length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;
  const nextEvent = events[0];

  return (
    <div className="animate-slide-in h-full flex flex-col pb-20 md:pb-0 overflow-y-auto md:overflow-hidden">
      
      {/* Compact Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 shrink-0">
        <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-light tracking-tighter text-black dark:text-white uppercase">Espace de Travail</h1>
                {/* Compact Schedule Pill */}
                <div className="hidden md:flex bg-black/5 dark:bg-white/10 rounded-full p-1 pl-3 pr-2 items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-300 capitalize">{formattedDate}</span>
                    {nextEvent && (
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1E1E1E] rounded-full px-2 py-0.5 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-[#B4F481] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold dark:text-gray-200">{nextEvent.time} • {nextEvent.title}</span>
                        </div>
                    )}
                </div>
             </div>
             <p className="text-gray-400 text-sm">Bon retour, voici ce qui se passe aujourd'hui.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex gap-6 px-6 border-r border-gray-200 dark:border-white/10">
                <div className="text-center">
                    <div className="text-xl font-medium dark:text-white">{MOCK_LEADS.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Leads</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-medium text-orange-500">{activeTasksCount}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">À Faire</div>
                </div>
             </div>
             <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="flex-1 md:flex-none bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
            >
                <Plus className="w-4 h-4" /> Tâche
            </button>
        </div>
      </div>

      {/* Main Grid Layout - Fixed height on desktop to prevent full page scroll */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Leads & Tasks (Scrollable internally) */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 1. New Leads (Horizontal Scroll) */}
            <div className="shrink-0">
                <div className="flex justify-between items-center mb-3 px-1">
                    <h2 className="text-lg font-medium dark:text-white">Leads Récents</h2>
                    <span className="text-xs font-bold text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors">Voir tout</span>
                </div>
                <div className="flex gap-4 overflow-x-auto custom-scroll pb-4 snap-x px-1">
                    {MOCK_LEADS.map((lead, idx) => (
                        <div key={lead.id} onClick={() => onOpenLead(lead)} className="snap-start bg-white dark:bg-[#1E1E1E] p-4 rounded-[24px] min-w-[240px] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <Avatar name={lead.firstName + lead.lastName} bg={idx % 2 === 0 ? "bg-pink-100" : "bg-blue-100"} />
                                <div className="text-[10px] font-bold bg-gray-50 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500 dark:text-gray-300">{lead.channel.split(' ')[0]}</div>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{lead.firstName} {lead.lastName}</h3>
                            <p className="text-xs text-gray-400 mb-3 truncate">{lead.position} @ {lead.company}</p>
                            <div className="flex justify-between items-center border-t border-gray-50 dark:border-white/10 pt-2">
                                <span className="font-mono text-xs font-medium dark:text-gray-300">€{(lead.value/1000).toFixed(1)}k</span>
                                <HotScale level={idx === 0 ? 5 : 3} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Tasks (Vertical Scroll) - Fills remaining height */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1E1E1E] rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
                <div className="p-5 border-b border-gray-50 dark:border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-medium dark:text-white">Tâches</h2>
                        <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-xs font-bold">{completedTasksCount}/{tasks.length}</span>
                    </div>
                    <div className="w-32 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-black dark:bg-white transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
                    {sortedTasks.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-2xl">
                             <p className="text-sm">Aucune tâche pour le moment.</p>
                         </div>
                    )}
                    
                    {sortedTasks.map((task) => (
                        <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${task.completed ? 'bg-gray-50 dark:bg-white/5 border-gray-50 dark:border-transparent opacity-60' : 'bg-white dark:bg-[#1E1E1E] border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/20 hover:shadow-sm'}`}>
                            <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-black dark:group-hover:border-white'}`}>
                                {task.completed && <CheckCircle className="w-3 h-3 text-white dark:text-black" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                    <span className="uppercase font-bold tracking-wider text-[10px]">{task.type}</span>
                                    {task.time && <span>• {task.time}</span>}
                                </div>
                            </div>

                            {task.priority && !task.completed && (
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Urgent</span>
                            )}
                            
                            <button onClick={(e) => deleteTask(task.id, e)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Summary Widget (Full Height) */}
        <div className="lg:col-span-4 h-full min-h-[400px]">
            <div className="bg-black dark:bg-[#1E1E1E] rounded-[40px] p-8 text-white h-full relative overflow-hidden flex flex-col border dark:border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 dark:bg-black rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B4F481] rounded-full blur-[60px] opacity-10 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#B4F481] rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-medium">Insights</h3>
                         </div>
                         <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer">
                            <MoreHorizontal className="w-5 h-5" />
                         </div>
                    </div>

                    <div className="mb-6 bg-white/5 rounded-3xl p-6 border border-white/10">
                        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Performance Hebdo</h4>
                        <div className="text-4xl font-light mb-1">€42.5k</div>
                        <div className="flex items-center gap-2 text-sm text-[#B4F481]">
                            <ArrowUpRight className="w-4 h-4" /> +12% vs semaine dernière
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg">Focus IA</h4>
                            <div className="bg-[#B4F481] text-black text-[10px] font-bold px-2 py-0.5 rounded">BETA</div>
                        </div>
                        <div className="overflow-y-auto custom-scroll pr-2 space-y-4">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                <strong className="text-white">Conseil du jour :</strong> Vous avez 3 leads en étape "Proposition" depuis plus de 4 jours. L'IA suggère d'envoyer une étude de cas "Fintech" à Alice Dubois pour débloquer la situation.
                            </p>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 mb-1">Action suggérée</div>
                                <div className="text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-[#B4F481]">
                                    <FileText className="w-4 h-4" /> Envoyer Cas Fintech
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setIsTaskModalOpen(false)}>
              <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-slide-in p-6 border dark:border-white/10" onClick={(e) => e.stopPropagation()}>
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold dark:text-white">Nouvelle Tâche</h3>
                       <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-white">
                           <X className="w-5 h-5" />
                       </button>
                   </div>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Titre</label>
                           <input 
                                type="text" 
                                className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-black dark:focus:border-white rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium dark:text-white"
                                placeholder="Ex: Relancer Client X..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                autoFocus
                           />
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Type</label>
                                <select 
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-black dark:focus:border-white rounded-xl px-3 py-3 outline-none transition-all appearance-none text-sm dark:text-white"
                                    value={newTaskType}
                                    onChange={(e) => setNewTaskType(e.target.value as any)}
                                >
                                    <option value="todo">À faire</option>
                                    <option value="call">Appel</option>
                                    <option value="meeting">Réunion</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Heure</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-black dark:focus:border-white rounded-xl px-3 py-3 outline-none transition-all text-sm dark:text-white"
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                />
                            </div>
                       </div>

                       <div className="flex items-center gap-2 pt-2">
                           <input 
                                type="checkbox" 
                                id="priority"
                                checked={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.checked)}
                                className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
                           />
                           <label htmlFor="priority" className="text-sm text-gray-600 dark:text-gray-300 font-medium">Marquer comme prioritaire</label>
                       </div>

                       <button 
                            onClick={handleAddTask}
                            className="w-full bg-black dark:bg-white dark:text-black text-white rounded-xl py-3.5 font-bold mt-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg text-sm"
                       >
                           Créer la Tâche
                       </button>
                   </div>
              </div>
          </div>
      )}

    </div>
  );
};