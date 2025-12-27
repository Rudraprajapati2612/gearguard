
import React from 'react';
import { 
  AlertTriangle, 
  Zap, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Shield, 
  Users, 
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { User, MaintenanceRequest, MaintenanceStatus, Equipment, Team, Priority } from '../types';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f97316',
  danger: '#ef4444',
  purple: '#a855f7',
  muted: '#666'
};

interface DashboardProps {
  user: User;
  requests: MaintenanceRequest[];
  equipment: Equipment[];
  teams: Team[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, equipment, teams }) => {
  // Aggregate Stats
  const stats = {
    new: requests.filter(r => r.status === MaintenanceStatus.NEW).length,
    active: requests.filter(r => r.status === MaintenanceStatus.IN_PROGRESS).length,
    repaired: requests.filter(r => r.status === MaintenanceStatus.REPAIRED).length,
    totalEquipment: equipment.length,
    uptime: 94.2,
    avgRepairTime: '4.2h',
    criticalCount: equipment.filter(e => e.health < 40).length
  };

  // Chart Data: Equipment Health Distribution
  const healthData = [
    { name: 'Healthy', value: equipment.filter(e => e.health >= 70).length, color: COLORS.secondary },
    { name: 'Warning', value: equipment.filter(e => e.health >= 40 && e.health < 70).length, color: COLORS.warning },
    { name: 'Critical', value: equipment.filter(e => e.health < 40).length, color: COLORS.danger },
  ];

  // Chart Data: Weekly Maintenance Velocity
  const velocityData = [
    { day: 'Mon', completed: 4, received: 6 },
    { day: 'Tue', completed: 7, received: 5 },
    { day: 'Wed', completed: 5, received: 8 },
    { day: 'Thu', completed: 10, received: 4 },
    { day: 'Fri', completed: 8, received: 7 },
    { day: 'Sat', completed: 3, received: 2 },
    { day: 'Sun', completed: 2, received: 1 },
  ];

  // Chart Data: Open Tasks by Team
  const teamWorkload = teams.map(t => ({
    name: t.name,
    tasks: requests.filter(r => r.teamId === t.id && r.status !== MaintenanceStatus.REPAIRED).length
  }));

  // Recent Activity Feed (Mock)
  const activities = [
    { id: 1, user: 'Marcus Sterling', action: 'completed repair on', target: 'CNC Machine V2', time: '2h ago', icon: <CheckCircle2 size={14} className="text-green-500" /> },
    { id: 2, user: 'Sarah Connor', action: 'flagged critical warning for', target: 'Industrial Forklift', time: '4h ago', icon: <AlertTriangle size={14} className="text-red-500" /> },
    { id: 3, user: 'Elena Rodriguez', action: 'started work on', target: 'Server Rack Alpha', time: '5h ago', icon: <Clock size={14} className="text-blue-500" /> },
    { id: 4, user: 'Admin User', action: 'scheduled preventive for', target: 'Air Compressor', time: '1d ago', icon: <Zap size={14} className="text-purple-500" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Analytics</h1>
          <p className="text-gray-400 text-sm">Real-time facility performance monitoring for {user.name}.</p>
        </div>
        <div className="bg-[#1f1f1f] border border-[#2a2a2a] px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Live Engine Status: Optimal</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Asset Uptime', value: `${stats.uptime}%`, icon: <Activity className="text-emerald-500" />, trend: '+0.4%', isPositive: true },
          { label: 'Pending Tickets', value: stats.new + stats.active, icon: <Clock className="text-orange-500" />, trend: '-2', isPositive: true },
          { label: 'Active Fleet', value: stats.totalEquipment, icon: <Package className="text-blue-500" />, trend: '+1', isPositive: true },
          { label: 'Health Alerts', value: stats.criticalCount, icon: <AlertTriangle className="text-red-500" />, trend: '+0', isPositive: false },
        ].map((card, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${card.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {card.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {card.trend}
              </div>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.label}</h3>
            <div className="text-3xl font-black mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Maintenance Velocity
            </h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Received</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis dataKey="day" stroke="#444" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis stroke="#444" axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="received" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" />
              <Area type="monotone" dataKey="completed" stroke={COLORS.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Shield size={18} className="text-emerald-500" /> Fleet Health
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {healthData.map((d, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] font-bold text-gray-500 uppercase">{d.name}</div>
                <div className="text-lg font-black" style={{ color: d.color }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Users size={18} className="text-purple-500" /> Team Workload
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={teamWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#666" fontSize={11} width={120} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Bar dataKey="tasks" fill={COLORS.purple} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Activity size={18} className="text-blue-500" /> Live Feed
          </h3>
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                    {act.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium">
                      <span className="text-white font-bold">{act.user}</span> {act.action} <span className="text-blue-400 font-bold">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} /> {act.time}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
