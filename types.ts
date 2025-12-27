
export enum UserRole {
  REQUESTER = 'Requester',
  TECHNICIAN = 'Technician',
  MANAGER = 'Manager',
  ADMIN = 'Admin'
}

export enum MaintenanceStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  REPAIRED = 'Repaired',
  SCRAP = 'Scrap'
}

export enum MaintenanceType {
  CORRECTIVE = 'Corrective',
  PREVENTIVE = 'Preventive'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // User IDs
  specialization: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  company: string;
  usedBy?: string;
  assignedDate?: string;
  setupDate?: string;
  location: string;
  workCenter: string;
  technicianId: string; // Default assigned
  teamId: string;
  health: number; // 0-100
  status: 'active' | 'scrapped';
  openRequestCount: number;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  requesterId: string;
  equipmentId: string;
  category: string;
  assignedDate: string;
  maintenanceType: MaintenanceType;
  teamId: string;
  technicianId?: string;
  scheduledDate?: string;
  duration?: number; // in hours
  priority: Priority;
  status: MaintenanceStatus;
  notes?: string;
  isOverdue?: boolean;
}
