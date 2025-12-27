
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar as CalendarIcon, 
  Box, 
  Users, 
  Plus, 
  LogOut, 
  ChevronDown,
  X,
  Key
} from 'lucide-react';
import { User, UserRole, MaintenanceRequest, Equipment, Team, MaintenanceStatus, Priority, MaintenanceType } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  onAddRequest: (req: MaintenanceRequest) => void;
  equipment: Equipment[];
  teams: Team[];
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, onAddRequest, equipment, teams }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Form State
  const [subject, setSubject] = useState('');
  const [equipId, setEquipId] = useState('');
  const [priority, setPriority] = useState(Priority.MEDIUM);
  const [description, setDescription] = useState('');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.REQUESTER] },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.REQUESTER] },
    { name: 'Calendar', path: '/calendar', icon: <CalendarIcon size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN] },
    { name: 'Equipment', path: '/equipment', icon: <Box size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.REQUESTER] },
    { name: 'Teams', path: '/teams', icon: <Users size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  const handleSubmitRequest = (e: React.FormEvent) => {
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
      notes: description
    };
    onAddRequest(newReq);
    setIsModalOpen(false);
    setSubject('');
    setEquipId('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">G</div>
            <span className="text-xl font-bold tracking-tight">GearGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {filteredNav.map(item => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'bg-[#2a2a2a] text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}`}>
                {item.icon} {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus size={18} /> <span className="hidden sm:inline">New Request</span>
          </button>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 hover:bg-[#2a2a2a] rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold uppercase">{user.name.charAt(0)}</div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg shadow-xl py-1 z-50 text-white animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-[#2a2a2a]">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
                <button onClick={() => { setIsPasswordModalOpen(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-300">
                  <Key size={14} /> Update Password
                </button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] flex items-center gap-2 text-red-400 border-t border-[#2a2a2a] mt-1">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#2a2a2a] flex justify-between items-center">
              <h3 className="text-lg font-bold">New Maintenance Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Equipment</label>
                <select required value={equipId} onChange={e => setEquipId(e.target.value)} className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="">Select Equipment</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.serialNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="What is the issue?" className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                    <button key={p} type="button" onClick={() => setPriority(p)} className={`py-2 text-xs font-bold rounded-lg border transition-all ${priority === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#2a2a2a] border-[#333] text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Problem Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide details..." className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition-all shadow-lg shadow-blue-600/20">Create Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#2a2a2a] flex justify-between items-center">
              <h3 className="text-lg font-bold">Update Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsPasswordModalOpen(false); alert('Password updated successfully!'); }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
