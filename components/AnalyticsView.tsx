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
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-gray-50 p-3 rounded-full">
                <Icon className="w-5 h-5 text-gray-700" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 bg-[#B4F481] px-2 py-1 rounded-full text-xs font-bold">
                    +{trend}% <ArrowUpRight className="w-3 h-3" />
                </div>
            )}
        </div>
        <div className="text-3xl font-light mb-1 text-black">{value}</div>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</div>
        {subtext && <div className="text-xs text-gray-400 mt-2">{subtext}</div>}
    </div>
);

export const AnalyticsView: React.FC = () => {
    return (
        <div className="animate-slide-in pb-10">
            <div className="mb-8">
                <h1 className="text-4xl font-light tracking-tight text-black mb-2">Suivi Social & Analytics</h1>
                <p className="text-gray-400">Performance des canaux d'acquisition et engagement social</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Traffic Trend Chart */}
                <div className="col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-medium">Trafic Hebdomadaire par Source</h3>
                        <div className="flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black"></div> Social</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#B4F481]"></div> Organique</div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ANALYTICS_TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#B4F481" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#B4F481" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                />
                                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                <Area type="monotone" dataKey="social" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorSocial)" />
                                <Area type="monotone" dataKey="organic" stroke="#B4F481" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Channel ROI Chart */}
                <div className="col-span-1 bg-black text-white p-8 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
                    <div className="relative z-10 h-full flex flex-col">
                        <h3 className="text-xl font-medium mb-6">ROI par Canal</h3>
                        <div className="flex-1">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_CHANNEL_PERFORMANCE} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
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
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-medium mb-6">Détails des Sources d'Acquisition</h3>
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-gray-400 font-medium border-b border-gray-50">
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
                            <tr key={channel.name} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 font-medium text-gray-900">{channel.name}</td>
                                <td className="py-4 text-gray-500">{channel.visitors.toLocaleString()}</td>
                                <td className="py-4 text-gray-500">{channel.leads}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-black rounded-full" style={{ width: `${(channel.conversionRate / 5) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-medium">{channel.conversionRate}%</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right font-medium">€{channel.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};