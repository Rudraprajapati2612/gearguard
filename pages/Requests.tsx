
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, MapPin, Box as BoxIcon, AlertCircle, X } from 'lucide-react';
import { MaintenanceStatus, User, UserRole, Priority, MaintenanceRequest, Equipment, Team, MaintenanceType } from '../types';

interface RequestsProps {
  user: User;
  requests: MaintenanceRequest[];
  equipment: Equipment[];
  teams: Team[];
  onAddRequest: (req: MaintenanceRequest) => void;
}

const Requests: React.FC<RequestsProps> = ({ user, requests, equipment, teams, onAddRequest }) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterTeam, setFilterTeam] = useState<string>('All');
  
  // New Request Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [equipId, setEquipId] = useState('');
  const [priority, setPriority] = useState(Priority.MEDIUM);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || req.priority === filterPriority;
    const matchesTeam = filterTeam === 'All' || req.teamId === filterTeam;
    return matchesSearch && matchesPriority && matchesTeam;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: MaintenanceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      requesterId: user.id,
      equipmentId: equipId,
      category: equipment.find(e => e.id === equipId)?.category || 'General',
      assignedDate: new Date().toISOString().split('T')[0],
      maintenanceType: MaintenanceType.CORRECTIVE,
      teamId: teams[0]?.id || '1',
      status: MaintenanceStatus.NEW,
      priority,
    };
    onAddRequest(newReq);
    setIsModalOpen(false);
    setSubject('');
    setEquipId('');
  };

  const columns = [
    { title: 'New', status: MaintenanceStatus.NEW, color: 'bg-blue-500' },
    { title: 'In Progress', status: MaintenanceStatus.IN_PROGRESS, color: 'bg-orange-500' },
    { title: 'Repaired', status: MaintenanceStatus.REPAIRED, color: 'bg-green-500' },
    { title: 'Scrap', status: MaintenanceStatus.SCRAP, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Requests</h1>
          <p className="text-gray-400 text-sm">Managing {filteredRequests.length} requests.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium">
          <Plus size={18} /> Create
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search subject..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#2a2a2a] border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 text-gray-200 outline-none"
          />
        </div>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-[#2a2a2a] text-sm rounded-md px-3 py-2 outline-none border-none">
          <option value="All">All Priorities</option>
          {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className="bg-[#2a2a2a] text-sm rounded-md px-3 py-2 outline-none border-none">
          <option value="All">All Teams</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(col => (
          <div key={col.status} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-2 font-bold text-sm uppercase text-gray-500">
              <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
              {col.title} ({filteredRequests.filter(r => r.status === col.status).length})
            </div>
            <div className="bg-[#111] border border-[#222] rounded-xl p-3 min-h-[400px] space-y-3">
              {filteredRequests.filter(r => r.status === col.status).map(req => (
                <div key={req.id} className="bg-[#2a2a2a] border border-[#3a3a3a] p-4 rounded-lg shadow-sm hover:border-blue-500/50 transition-all">
                  <div className="text-[10px] font-bold uppercase text-blue-500 mb-1">{req.priority}</div>
                  <div className="font-semibold text-sm leading-tight mb-3">{req.subject}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {equipment.find(e => e.id === req.equipmentId)?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
              <h3 className="font-bold">New Maintenance Request</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <select required value={equipId} onChange={e => setEquipId(e.target.value)} className="w-full bg-[#2a2a2a] p-2 rounded border border-[#333]">
                <option value="">Select Equipment</option>
                {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <input required type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-[#2a2a2a] p-2 rounded border border-[#333]" />
              <div className="flex gap-2">
                {Object.values(Priority).map(p => (
                  <button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 py-1 text-xs rounded border ${priority === p ? 'bg-blue-600 border-blue-600' : 'bg-[#2a2a2a] border-[#333]'}`}>{p}</button>
                ))}
              </div>
              <button className="w-full bg-blue-600 py-3 rounded-lg font-bold">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
