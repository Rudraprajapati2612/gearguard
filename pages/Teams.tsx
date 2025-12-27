
import React, { useState } from 'react';
import { 
  Plus, Users, UserPlus, Mail, X, Trash2, ShieldCheck, 
  User as UserIcon, Settings2, Zap, Hammer, Activity, ShieldAlert,
  ChevronRight, MoreVertical, Search
} from 'lucide-react';
import { User, UserRole, Team } from '../types';

interface TeamsProps {
  user: User;
  teams: Team[];
  users: User[];
  onAddTeam: (team: Team) => void;
  onAddUser: (user: User) => void;
  onUpdateTeam: (team: Team) => void;
}

const SPECIALIZATION_ICONS: Record<string, React.ReactNode> = {
  'Hydraulics & Engines': <Settings2 size={16} className="text-orange-500" />,
  'Wiring & Controls': <Zap size={16} className="text-yellow-500" />,
  'Plumbing': <Activity size={16} className="text-blue-500" />,
  'Default': <Hammer size={16} className="text-purple-500" />
};

const Teams: React.FC<TeamsProps> = ({ user, teams, users, onAddTeam, onAddUser, onUpdateTeam }) => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Forms
  const [teamName, setTeamName] = useState('');
  const [specialization, setSpecialization] = useState('Hydraulics & Engines');
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TECHNICIAN);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTeam({
      id: Math.random().toString(36).substr(2, 9),
      name: teamName,
      members: [],
      specialization: specialization
    });
    setIsTeamModalOpen(false);
    setTeamName('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      id: Math.random().toString(36).substr(2, 9),
      name: userName,
      email: userEmail,
      role: userRole
    });
    setIsUserModalOpen(false);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
  };

  const handleAddMember = (memberId: string) => {
    if (!selectedTeam) return;
    if (selectedTeam.members.includes(memberId)) return;
    
    const updatedTeam = {
      ...selectedTeam,
      members: [...selectedTeam.members, memberId]
    };
    onUpdateTeam(updatedTeam);
    setSelectedTeam(updatedTeam);
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const updatedTeam = {
      ...team,
      members: team.members.filter(id => id !== memberId)
    };
    onUpdateTeam(updatedTeam);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Organization Control</h1>
          <p className="text-gray-400 text-sm">Managing human capital and cross-functional maintenance units.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {user.role === UserRole.ADMIN && (
            <button onClick={() => setIsUserModalOpen(true)} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-purple-600/20 transition-all active:scale-95">
              <UserPlus size={18} /> Add User
            </button>
          )}
          <button onClick={() => setIsTeamModalOpen(true)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95">
            <Plus size={18} /> New Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => {
          const workloadPercentage = Math.min(100, (team.members.length * 3) / 10 * 100); // Mock workload
          return (
            <div key={team.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedTeam(team); setIsMemberModalOpen(true); }}
                  className="p-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  title="Add Members"
                >
                  <UserPlus size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-2xl flex items-center justify-center border border-[#333]">
                    {SPECIALIZATION_ICONS[team.specialization] || SPECIALIZATION_ICONS['Default']}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{team.specialization}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                    <span>Active Workload</span>
                    <span className={workloadPercentage > 80 ? 'text-rose-500' : 'text-emerald-500'}>{workloadPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${workloadPercentage > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${workloadPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <Users size={12} /> Team Roster ({team.members.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {team.members.length === 0 ? (
                      <p className="text-xs text-gray-600 italic py-2">No personnel deployed.</p>
                    ) : (
                      team.members.map(memberId => {
                        const member = users.find(u => u.id === memberId);
                        return member ? (
                          <div key={memberId} className="flex items-center gap-2 bg-[#2a2a2a]/50 px-2.5 py-1.5 rounded-xl border border-[#333] group/member transition-all hover:bg-blue-600/10 hover:border-blue-500/30">
                            <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[8px] font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-gray-300">{member.name.split(' ')[0]}</span>
                            <button 
                              onClick={() => handleRemoveMember(team.id, memberId)}
                              className="text-gray-600 hover:text-red-500 transition-colors ml-1"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-[#222]/30 border-t border-[#2a2a2a] flex justify-between items-center group/footer cursor-pointer hover:bg-[#2a2a2a]/50 transition-all">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">View Team Performance</span>
                <ChevronRight size={14} className="text-gray-600 group-hover/footer:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 border-b border-[#2a2a2a] flex flex-col md:flex-row items-start md:items-center justify-between bg-[#111]/50 gap-4">
          <div>
            <h3 className="font-black text-xl flex items-center gap-3">
              <UserIcon size={24} className="text-blue-500" /> Personnel Ledger
            </h3>
            <p className="text-xs text-gray-500 mt-1">Total system access: {users.length} active accounts</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search member..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-[#2a2a2a]">
              <tr>
                <th className="px-8 py-5">Full Name & ID</th>
                <th className="px-8 py-5">Access Level</th>
                <th className="px-8 py-5">Communication</th>
                <th className="px-8 py-5">Activity</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-blue-500 flex items-center justify-center font-black text-sm uppercase border border-white/5 shadow-inner">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-100">{u.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase">USR-{u.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                      u.role === UserRole.ADMIN ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      u.role === UserRole.TECHNICIAN ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      u.role === UserRole.MANAGER ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <Mail size={14} />
                      <span className="text-xs font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Online
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-600 hover:text-white transition-all p-2 rounded-xl hover:bg-[#2a2a2a] inline-flex">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] bg-[#111]/50 flex justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg"><Users size={20} /></div>
                <h3 className="font-black text-xl">Establish Team</h3>
              </div>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-gray-500 hover:text-white p-1.5 bg-[#2a2a2a] rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTeam} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Designation</label>
                <input required placeholder="e.g. Mechanical Squad" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operational Core</label>
                <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-blue-500/50 transition-all text-sm appearance-none">
                  {Object.keys(SPECIALIZATION_ICONS).map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-black text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                Initialize Team
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Member Selection Modal */}
      {isMemberModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] bg-[#111]/50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl">Personnel Deployment</h3>
                <p className="text-xs text-gray-500">Assigning to {selectedTeam.name}</p>
              </div>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-500 hover:text-white p-1.5 bg-[#2a2a2a] rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {users.filter(u => !selectedTeam.members.includes(u.id)).length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600">
                      <ShieldAlert size={24} />
                    </div>
                    <p className="text-sm text-gray-500 font-bold">No available personnel for deployment.</p>
                  </div>
                ) : (
                  users.filter(u => !selectedTeam.members.includes(u.id)).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-2xl border border-transparent hover:border-blue-500/30 transition-all group/item">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-black text-xs uppercase border border-white/5">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black leading-none text-gray-200">{u.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{u.role}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddMember(u.id)}
                        className="bg-blue-600/10 text-blue-500 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-inner"
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setIsMemberModalOpen(false)} className="w-full bg-[#2a2a2a] py-4 rounded-xl font-black text-gray-400 hover:text-white transition-all">
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] bg-[#111]/50 flex justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/10 text-purple-500 rounded-lg"><UserPlus size={20} /></div>
                <h3 className="font-black text-xl">Onboard Personnel</h3>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-500 hover:text-white p-1.5 bg-[#2a2a2a] rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Legal Name</label>
                <input required placeholder="Jane Smith" value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-purple-500/50 transition-all text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Email</label>
                <input required type="email" placeholder="j.smith@gearguard.io" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-purple-500/50 transition-all text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Clearance</label>
                <select value={userRole} onChange={e => setUserRole(e.target.value as UserRole)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-purple-500/50 transition-all text-sm appearance-none">
                  <option value={UserRole.TECHNICIAN}>Technician</option>
                  <option value={UserRole.MANAGER}>Manager</option>
                  <option value={UserRole.ADMIN}>Administrator</option>
                  <option value={UserRole.REQUESTER}>Asset Requester</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Temporal Password</label>
                <input required type="password" placeholder="Set secure credential" value={userPassword} onChange={e => setUserPassword(e.target.value)} className="w-full bg-[#2a2a2a] p-3 rounded-xl border border-[#333] outline-none focus:border-purple-500/50 transition-all text-sm" />
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-black text-white shadow-xl shadow-purple-600/20 transition-all active:scale-95 mt-4">
                Grant System Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
