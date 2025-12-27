
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserRole, MaintenanceStatus, Priority, Equipment as EquipmentType, MaintenanceRequest, Team, MaintenanceType, User } from './types';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Equipment from './pages/Equipment';
import Calendar from './pages/Calendar';
import Teams from './pages/Teams';

const queryClient = new QueryClient();

// Initial Mock Data
const INITIAL_EQUIPMENT: EquipmentType[] = [
  { id: '1', name: 'CNC Milling Machine V2', serialNumber: 'CNC-88291', category: 'Heavy Machinery', company: 'Factory Floor A', location: 'Section 12', workCenter: 'WC-01', health: 85, openRequestCount: 0, status: 'active', technicianId: 'tech1', teamId: '1' },
  { id: '2', name: 'Industrial Forklift', serialNumber: 'FORK-3312', category: 'Vehicles', company: 'Warehouse B', location: 'Dock 4', workCenter: 'WC-05', health: 25, openRequestCount: 2, status: 'active', technicianId: 'tech2', teamId: '1' },
  { id: '3', name: 'Air Compressor Unit', serialNumber: 'AIR-1002', category: 'Utility', company: 'Factory Floor A', location: 'Wall 4', workCenter: 'WC-01', health: 92, openRequestCount: 0, status: 'active', technicianId: 'tech1', teamId: '2' },
  { id: '4', name: 'Server Rack Alpha', serialNumber: 'SRV-0001', category: 'IT', company: 'HQ', location: 'Data Center', workCenter: 'WC-09', health: 15, openRequestCount: 1, status: 'active', technicianId: 'tech3', teamId: '4' },
  { id: '5', name: 'Hydraulic Press', serialNumber: 'HYD-552', category: 'Heavy Machinery', company: 'Factory Floor B', location: 'Main Bay', workCenter: 'WC-02', health: 65, openRequestCount: 1, status: 'active', technicianId: 'tech1', teamId: '1' },
];

const INITIAL_REQUESTS: MaintenanceRequest[] = [
  { id: '1', subject: 'A/C Unit Failure Room 402', requesterId: 'req1', equipmentId: '1', category: 'HVAC', assignedDate: '2025-10-12', maintenanceType: MaintenanceType.CORRECTIVE, teamId: '1', status: MaintenanceStatus.NEW, priority: Priority.HIGH },
  { id: '2', subject: 'Leaking Pipe in Canteen', requesterId: 'req2', equipmentId: '2', category: 'Plumbing', assignedDate: '2025-10-15', maintenanceType: MaintenanceType.CORRECTIVE, teamId: '3', status: MaintenanceStatus.IN_PROGRESS, priority: Priority.MEDIUM },
  { id: '3', subject: 'Annual Calibration WC-01', requesterId: 'admin1', equipmentId: '1', category: 'Heavy Machinery', assignedDate: '2025-10-18', maintenanceType: MaintenanceType.PREVENTIVE, teamId: '1', status: MaintenanceStatus.REPAIRED, priority: Priority.LOW },
];

const INITIAL_TEAMS: Team[] = [
  { id: '1', name: 'Mechanical Squad', members: ['tech1', 'tech2'], specialization: 'Hydraulics & Engines' },
  { id: '2', name: 'Electrical Force', members: ['tech3'], specialization: 'Wiring & Controls' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [equipment, setEquipment] = useState<EquipmentType[]>(INITIAL_EQUIPMENT);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(INITIAL_REQUESTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [users, setUsers] = useState<User[]>([
    { id: 'admin1', name: 'Admin User', email: 'admin@gearguard.io', role: UserRole.ADMIN },
    { id: 'tech1', name: 'Marcus Sterling', email: 'm.sterling@gearguard.io', role: UserRole.TECHNICIAN },
    { id: 'tech2', name: 'Sarah Connor', email: 's.connor@gearguard.io', role: UserRole.TECHNICIAN },
    { id: 'tech3', name: 'Elena Rodriguez', email: 'e.rodriguez@gearguard.io', role: UserRole.TECHNICIAN },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('gearguard_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('gearguard_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gearguard_user');
  };

  const addRequest = (newRequest: MaintenanceRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  const addEquipment = (newItem: EquipmentType) => {
    setEquipment(prev => [...prev, newItem]);
  };

  const addTeam = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />
          
          <Route 
            path="/" 
            element={isAuthenticated ? <Layout user={user!} onLogout={handleLogout} onAddRequest={addRequest} equipment={equipment} teams={teams} /> : <Navigate to="/" />}
          >
            <Route path="dashboard" element={<Dashboard user={user!} requests={requests} equipment={equipment} teams={teams} />} />
            <Route path="maintenance" element={<Requests user={user!} requests={requests} equipment={equipment} teams={teams} onAddRequest={addRequest} />} />
            <Route path="equipment" element={<Equipment user={user!} equipment={equipment} teams={teams} onAddEquipment={addEquipment} />} />
            <Route path="calendar" element={<Calendar user={user!} requests={requests} />} />
            <Route path="teams" element={<Teams user={user!} teams={teams} users={users} onAddTeam={addTeam} onAddUser={addUser} onUpdateTeam={updateTeam} />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
