
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, ShieldCheck, ShieldAlert, X, Filter, LayoutGrid, List, 
  MoreHorizontal, Activity, Settings2, Package, Truck, Zap, Cpu, History
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Equipment as EquipmentType, User, Team } from '../types';

interface EquipmentProps {
  user: User;
  equipment: EquipmentType[];
  teams: Team[];
  onAddEquipment: (item: EquipmentType) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Heavy Machinery': <Cpu size={16} />,
  'Vehicles': <Truck size={16} />,
  'Utility': <Zap size={16} />,
  'IT': <Settings2 size={16} />,
  'General': <Package size={16} />
};

const Equipment: React.FC<EquipmentProps> = ({ user, equipment, teams, onAddEquipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form State
  const [name, setName] = useState('');
  const [serial, setSerial] = useState('');
  const [category, setCategory] = useState('Heavy Machinery');
  const [teamId, setTeamId] = useState('');

  // Mock Health Data for Sparklines
  const generateHealthHistory = (base: number) => {
    return Array.from({ length: 10 }, (_, i) => ({
      val: Math.min(100, Math.max(0, base + Math.floor(Math.random() * 20) - 10))
    }));
  };

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(equipment.map(e => e.category))];
    return cats;
  }, [equipment]);

  const filtered = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: EquipmentType = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      serialNumber: serial,
      category,
      company: 'Main Site',
      location: 'Default',
      workCenter: 'WC-01',
      health: 100,
      openRequestCount: 0,
      status: 'active',
      technicianId: user.id,
      teamId: teamId || teams[0]?.id || '1',
    };
    onAddEquipment(newItem);
    setIsModalOpen(false);
    setName('');
    setSerial('');
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (health >= 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Fleet Inventory</h1>
          <p className="text-gray-400 text-sm">Managing {equipment.length} critical assets across {teams.length} teams.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
            <button 
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-[#2a2a2a] text-blue-500 shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-[#2a2a2a] text-blue-500 shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95">
            <Plus size={18} /> <span className="hidden sm:inline">Add Equipment</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or serial number..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-blue-600/10 border-blue-600/50 text-blue-500' : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 hover:border-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl flex items-center justify-center ${item.health >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {CATEGORY_ICONS[item.category] || CATEGORY_ICONS['General']}
                  </div>
                  <button className="text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors truncate">{item.name}</h3>
                  <p className="text-xs font-mono text-gray-500">SN: {item.serialNumber}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getHealthColor(item.health)}`}>
                    <Activity size={10} /> {item.health}% Health
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase">
                    {teams.find(t => t.id === item.teamId)?.name || 'Unassigned'}
                  </div>
                </div>

                {/* Health Sparkline */}
                <div className="h-10 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateHealthHistory(item.health)}>
                      <defs>
                        <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={item.health >= 80 ? '#10b981' : '#f43f5e'} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={item.health >= 80 ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke={item.health >= 80 ? '#10b981' : '#f43f5e'} 
                        strokeWidth={2} 
                        fill={`url(#grad-${item.id})`} 
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#222]/30 border-t border-[#2a2a2a] flex justify-between items-center">
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <History size={10} /> {item.openRequestCount} Active Tasks
                </div>
                <button className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-wider">
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-[#2a2a2a]">
              <tr>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Serial / ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status / Health</th>
                <th className="px-6 py-4">Assigned Team</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.health >= 80 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                        {CATEGORY_ICONS[item.category] || CATEGORY_ICONS['General']}
                      </div>
                      <span className="font-bold text-gray-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{item.serialNumber}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#2a2a2a] px-2 py-1 rounded text-[10px] font-bold uppercase text-gray-400 border border-[#333]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${item.health >= 80 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${item.health}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{item.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    {teams.find(t => t.id === item.teamId)?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-600 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-[#111]/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                  <Package size={20} />
                </div>
                <h3 className="font-black text-xl">Register New Asset</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-[#2a2a2a] p-1.5 rounded-lg transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Name</label>
                  <input required placeholder="Industrial Lathe X1" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Serial Number</label>
                  <input required placeholder="SN-8821-X" value={serial} onChange={e => setSerial(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Utility">Utility</option>
                    <option value="IT">IT</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assigned Team</label>
                  <select 
                    required 
                    value={teamId} 
                    onChange={e => setTeamId(e.target.value)} 
                    className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="">Select Team</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-black text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 mt-4">
                Deploy Asset to Fleet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
