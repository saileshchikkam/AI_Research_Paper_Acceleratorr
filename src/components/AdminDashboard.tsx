import React, { useState } from 'react';
import { 
  Users, KeyRound, ShieldAlert, Award, Search, Trash2, ArrowRight, TrendingUp, Cpu
} from 'lucide-react';

export default function AdminDashboard() {
  // Prepopulated seat allocations list
  const [seats, setSeats] = useState([
    { id: 'seat-1', name: 'Aarav Patel', email: 'aarav@university.edu', role: 'Student', papers: 3, lastLogin: 'Today, 10:20 AM', active: true },
    { id: 'seat-2', name: 'Dr. Meera Iyer', email: 'meera.iyer@university.edu', role: 'Professor', papers: 5, lastLogin: 'Today, 09:14 AM', active: true },
    { id: 'seat-3', name: 'Rahul Patel', email: 'rahul.ml@tech.co', role: 'Researcher', papers: 4, lastLogin: 'Yesterday, 04:30 PM', active: true },
    { id: 'seat-4', name: 'Prof. Srinivas G.', email: 'srinivas@university.edu', role: 'Professor', papers: 12, lastLogin: '3 days ago', active: true },
    { id: 'seat-5', name: 'Anjali Sharma', email: 'anjali.s@student.edu', role: 'Student', papers: 1, lastLogin: '5 days ago', active: true }
  ]);

  const [trendingKeywords] = useState([
    { word: 'Retrieval Augmented RAG', count: 142, trend: '+35%' },
    { word: 'Transformer Attention Mechanisms', count: 98, trend: '+12%' },
    { word: 'Cognitive Science & Memory', count: 65, trend: '+4%' },
    { word: 'Semantic Vector Clustering', count: 110, trend: '+22%' }
  ]);

  const handleToggleSeat = (seatId: string) => {
    setSeats(prev => prev.map(s => {
      if (s.id === seatId) {
        return { ...s, active: !s.active };
      }
      return s;
    }));
  };

  const handleRevokeSeat = (seatId: string) => {
    if (!confirm('Are you sure you want to permanently revoke this user seat? They will lose access to their Research Library.')) return;
    setSeats(prev => prev.filter(s => s.id !== seatId));
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto text-left" id="admin_dashboard_root">
      
      {/* ENTERPRISE ADVISORY BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-2 py-0.5 bg-blue-500/25 border border-blue-500/30 rounded text-[9px] font-mono tracking-widest uppercase font-black text-blue-300">
            Enterprise License Console
          </span>
          <h3 className="font-display font-black text-xl">University Admin Council</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            You are managing the multi-seat enterprise subscription for <strong className="text-white font-bold">IIT Hyderabad Computer Science Faculty</strong>. License seat counts, scanning volume, and trending research keywords are synchronized.
          </p>
        </div>

        <div className="flex gap-4 shrink-0 font-mono text-center">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Seats Filled</span>
            <span className="text-lg font-black text-white">{seats.filter(s => s.active).length} / 25</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Storage Used</span>
            <span className="text-lg font-black text-white">42%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin_grid_panels">
        
        {/* Left Column: License Seat Management Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-display font-black text-slate-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Active Faculty Seat Allocations
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-1 rounded">
              IIT HYD INST-ID: 489-CSE
            </span>
          </div>

          <div className="overflow-x-auto" id="seat_allocation_table">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Department Field</th>
                  <th className="p-3">Ingested Papers</th>
                  <th className="p-3">License State</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((seat) => (
                  <tr key={seat.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                    <td className="p-3">
                      <p className="font-bold text-slate-800 leading-snug">{seat.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{seat.email}</p>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-semibold text-slate-600">{seat.role}</span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-600">
                      {seat.papers} documents
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleToggleSeat(seat.id)}
                        className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                          seat.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}
                        title="Click to toggle account state"
                      >
                        {seat.active ? 'Active Licence' : 'Suspended'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRevokeSeat(seat.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-xl transition-all"
                        id={`revoke_seat_btn_${seat.id}`}
                        title="Revoke and recycle seat license"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Key trends & SVG quota circle (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Trends list card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-left">
            <h4 className="font-display font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Trending Research Topics
            </h4>
            
            <div className="space-y-3" id="admin_trending_topics">
              {trendingKeywords.map((wordItem, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{wordItem.word}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{wordItem.count} query scans</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                    {wordItem.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Licensing compliance card */}
          <div className="bg-amber-50/20 border border-amber-100 rounded-3xl p-6 text-left space-y-3 flex-1 flex flex-col justify-center">
            <h4 className="text-[10px] font-black uppercase text-amber-800 tracking-wider font-mono flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500 animate-pulse" />
              Compute Node Quotas
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Enterprise server nodes allow up to <strong className="text-slate-800">50,000 PDF parsing operations</strong> per month. Current university consumption rests at <strong className="text-slate-800">4,200 operations</strong>. Perfect bandwidth.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
