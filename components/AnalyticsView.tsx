import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { MOCK_CHANNEL_PERFORMANCE, ANALYTICS_TREND_DATA } from '../constants';
import { ArrowUpRight, Users, MousePointer, Euro, Smartphone } from 'lucide-react';

const Card = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-gray-50 dark:bg-white/10 p-3 rounded-full">
                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 bg-[#B4F481] px-2 py-1 rounded-full text-xs font-bold text-black">
                    +{trend}% <ArrowUpRight className="w-3 h-3" />
                </div>
            )}
        </div>
        <div className="text-3xl font-light mb-1 text-black dark:text-white">{value}</div>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</div>
        {subtext && <div className="text-xs text-gray-400 mt-2">{subtext}</div>}
    </div>
);

export const AnalyticsView: React.FC = () => {
    return (
        <div className="animate-slide-in pb-10">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black dark:text-white mb-2">Suivi Social & Analytics</h1>
                <p className="text-gray-400">Performance des canaux d'acquisition et engagement social</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card 
                    title="Visiteurs Sociaux" 
                    value="12.4k" 
                    icon={Users} 
                    trend={12} 
                    subtext="vs 10.1k le mois dernier"
                />
                <Card 
                    title="Taux de Conv. Social" 
                    value="2.8%" 
                    icon={MousePointer} 
                    trend={0.4} 
                    subtext="Moyenne secteur: 1.9%"
                />
                <Card 
                    title="Revenu Ads (Meta)" 
                    value="€42k" 
                    icon={Euro} 
                    trend={8} 
                    subtext="ROAS: 3.2"
                />
                <Card 
                    title="Visites Mobiles" 
                    value="68%" 
                    icon={Smartphone} 
                    subtext="Dont 80% via Instagram"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Traffic Trend Chart */}
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#1E1E1E] p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Trafic Hebdomadaire par Source</h3>
                        <div className="flex gap-4 text-xs font-medium dark:text-gray-300">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div> Social</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#B4F481]"></div> Organique</div>
                        </div>
                    </div>
                    <div className="h-[250px] md:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ANALYTICS_TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#888" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#888" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#B4F481" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#B4F481" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', color: '#000' }}
                                />
                                <CartesianGrid vertical={false} stroke="#f3f4f6" strokeOpacity={0.1} />
                                <Area type="monotone" dataKey="social" stroke="#888" strokeWidth={3} fillOpacity={1} fill="url(#colorSocial)" />
                                <Area type="monotone" dataKey="organic" stroke="#B4F481" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Channel ROI Chart */}
                <div className="col-span-1 bg-black dark:bg-black text-white p-6 md:p-8 rounded-[32px] relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
                    <div className="relative z-10 h-full flex flex-col">
                        <h3 className="text-xl font-medium mb-6">ROI par Canal</h3>
                        <div className="flex-1">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_CHANNEL_PERFORMANCE} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff' }}
                                    />
                                    <Bar dataKey="roi" fill="#B4F481" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[32px] border border-gray-100 dark:border-white/10 p-6 md:p-8 shadow-sm overflow-x-auto transition-colors">
                <h3 className="text-xl font-medium mb-6 text-gray-900 dark:text-white">Détails des Sources d'Acquisition</h3>
                <table className="w-full text-left min-w-[600px]">
                    <thead className="text-xs uppercase text-gray-400 font-medium border-b border-gray-50 dark:border-white/5">
                        <tr>
                            <th className="pb-4">Canal</th>
                            <th className="pb-4">Visiteurs</th>
                            <th className="pb-4">Leads</th>
                            <th className="pb-4">Conv. Rate</th>
                            <th className="pb-4 text-right">Revenu Généré</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CHANNEL_PERFORMANCE.map((channel) => (
                            <tr key={channel.name} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-4 font-medium text-gray-900 dark:text-white">{channel.name}</td>
                                <td className="py-4 text-gray-500 dark:text-gray-400">{channel.visitors.toLocaleString()}</td>
                                <td className="py-4 text-gray-500 dark:text-gray-400">{channel.leads}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(channel.conversionRate / 5) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-medium dark:text-gray-300">{channel.conversionRate}%</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right font-medium text-gray-900 dark:text-white">€{channel.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};