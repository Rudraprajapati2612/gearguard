
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { User, Priority, MaintenanceRequest } from '../types';

const Calendar: React.FC<{ user: User, requests: MaintenanceRequest[] }> = ({ user, requests }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Default to Oct 2025
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Logic to get days for the grid
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const calendarCells = [];
  // Buffer start
  for (let i = 0; i < startDay; i++) {
    calendarCells.push({ day: null });
  }
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayEvents = requests.filter(r => r.assignedDate === dayStr);
    calendarCells.push({ day: i, events: dayEvents });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Calendar</h1>
          <p className="text-gray-400 text-sm">Scheduling and tracking maintenance events for {year}.</p>
        </div>
      </div>

      <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl overflow-hidden flex flex-col h-[750px]">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold">{monthName} {year}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={nextMonth} className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors"><ChevronRight size={20} /></button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium text-blue-500 hover:underline">Today</button>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-[#111] border-b border-[#2a2a2a]">
          {daysOfWeek.map(day => (
            <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
          {calendarCells.map((cell, idx) => (
            <div key={idx} className={`border-b border-r border-[#2a2a2a] p-2 min-h-[120px] hover:bg-[#222] transition-colors ${!cell.day ? 'bg-[#0a0a0a]/50' : ''}`}>
              {cell.day && (
                <>
                  <div className="text-xs font-bold text-gray-500 mb-2">{cell.day}</div>
                  <div className="space-y-1">
                    {cell.events?.map(ev => (
                      <div key={ev.id} className={`text-[9px] p-1.5 rounded border border-[#333] truncate font-bold uppercase ${ev.priority === Priority.HIGH ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {ev.subject}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
