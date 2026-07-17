import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Clock, Activity, Award, Calendar, RefreshCw, FileText, 
  MessageSquare, Edit3, Flame, CheckCircle, Database
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ActivityLog {
  id: string;
  userId: string;
  type: 'read' | 'chat' | 'quiz' | 'flashcard' | 'note';
  paperTitle: string;
  paperId?: string;
  detail: string;
  timestamp: string;
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: number;
  readingProgress: number;
  summary?: any;
}

export default function Analytics() {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [activitiesRes, papersRes] = await Promise.all([
        fetch('/api/activities'),
        fetch('/api/papers')
      ]);

      if (activitiesRes.ok) {
        setActivities(await activitiesRes.ok ? await activitiesRes.json() : []);
      }
      if (papersRes.ok) {
        setPapers(await papersRes.ok ? await papersRes.json() : []);
      }
    } catch (err) {
      console.error('Error fetching analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ==========================================
  // DYNAMIC METRIC CALCULATIONS
  // ==========================================

  // 1. Average Study Pace:
  // Calculated from total minutes spend across study sessions / unique active study days.
  // Weight assignments to replicate actual study effort:
  // 'read' (paper views/uploads): 25 mins
  // 'note' (notebook edits): 15 mins
  // 'quiz' (assessment runs): 20 mins
  // 'chat' (AI discussions): 10 mins
  // 'flashcard' (spaced reviews): 10 mins
  const totalStudyMinutes = activities.reduce((acc, act) => {
    if (act.type === 'read') return acc + 25;
    if (act.type === 'note') return acc + 15;
    if (act.type === 'quiz') return acc + 20;
    if (act.type === 'chat') return acc + 10;
    if (act.type === 'flashcard') return acc + 10;
    return acc;
  }, 0);

  const uniqueActiveDays = new Set(
    activities.map(a => new Date(a.timestamp).toDateString())
  ).size;

  const avgStudyPace = uniqueActiveDays > 0 ? Math.round(totalStudyMinutes / uniqueActiveDays) : 0;

  // 2. Assessment Passing Rate:
  // Calculated from actual quiz activities and parsed scores.
  const quizActivities = activities.filter(a => a.type === 'quiz');
  const quizScores = quizActivities.map(a => {
    const match = a.detail.match(/Scored (\d+)%/);
    return match ? parseInt(match[1], 10) : null;
  }).filter((s): s is number => s !== null);

  const avgPassingRate = quizScores.length > 0 
    ? Math.round((quizScores.reduce((sum, s) => sum + s, 0) / quizScores.length) * 10) / 10 
    : 0;

  // 3. Research Papers Uploaded:
  const papersCount = papers.length;

  // 4. Workspace Operations:
  // Direct chronological sum of all actions and AI syntheses completed
  const workspaceOpsCount = activities.length + papers.filter(p => p.summary).length;

  // ==========================================
  // MONTHLY STUDY HOUR AGGREGATION CALCULATOR
  // ==========================================
  const getMonthlyReadingData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    // Initialize past 6 chronological calendar months
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        month: months[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        hours: 0,
        sessionCount: 0
      };
    });

    // Populate active hours from actual activity timestamps
    activities.forEach(act => {
      const actDate = new Date(act.timestamp);
      const actMonth = actDate.getMonth();
      const actYear = actDate.getFullYear();

      const bucket = last6Months.find(m => m.monthIndex === actMonth && m.year === actYear);
      if (bucket) {
        let mins = 0;
        if (act.type === 'read') mins = 25;
        else if (act.type === 'note') mins = 15;
        else if (act.type === 'quiz') mins = 20;
        else if (act.type === 'chat') mins = 10;
        else if (act.type === 'flashcard') mins = 10;

        bucket.hours += mins / 60;
        bucket.sessionCount += 1;
      }
    });

    return last6Months.map(m => ({
      month: m.month,
      hours: Math.round(m.hours * 10) / 10,
      sessions: m.sessionCount
    }));
  };

  const monthlyReadingData = getMonthlyReadingData();

  // Determine whether we should present an empty state
  const isLibraryEmpty = papersCount === 0 && activities.length === 0;

  // ==========================================
  // AUDIT TRAIL ROW FORMATTING MAPPER
  // ==========================================
  const getAuditDetails = (type: string) => {
    switch (type) {
      case 'read':
        return {
          module: 'Socratic Reader',
          action: 'Document View',
          color: 'bg-blue-50 text-blue-700 border-blue-100/50',
          icon: <Clock className="w-3.5 h-3.5 text-blue-500" />
        };
      case 'chat':
        return {
          module: 'AI Discussion Room',
          action: 'Workspace Chat',
          color: 'bg-purple-50 text-purple-700 border-purple-100/50',
          icon: <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
        };
      case 'quiz':
        return {
          module: 'Quiz Studio',
          action: 'Assessment',
          color: 'bg-amber-50 text-amber-700 border-amber-100/50',
          icon: <Award className="w-3.5 h-3.5 text-amber-500" />
        };
      case 'note':
        return {
          module: 'Notes Center',
          action: 'Notebook Edit',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
          icon: <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
        };
      case 'flashcard':
        return {
          module: 'Study Cards',
          action: 'Card Reviewed',
          color: 'bg-rose-50 text-rose-700 border-rose-100/50',
          icon: <Flame className="w-3.5 h-3.5 text-rose-500" />
        };
      default:
        return {
          module: 'System Core',
          action: 'Operation',
          color: 'bg-slate-50 text-slate-700 border-slate-100/50',
          icon: <Activity className="w-3.5 h-3.5 text-slate-500" />
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-mono text-xs gap-3" id="analytics_loading">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        Synchronizing real-time research metrics...
      </div>
    );
  }

  if (isLibraryEmpty) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-8" id="analytics_empty_root">
        <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md p-16 rounded-3xl shadow-sm flex flex-col items-center gap-5">
          <div className="bg-blue-50 text-blue-600 p-5 rounded-2xl flex items-center justify-center">
            <Activity className="w-10 h-10" />
          </div>
          <h3 className="font-display font-black text-slate-900 text-lg">No Active Research Telemetry</h3>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
            Your dynamic analytics dashboard will automatically compile reading duration, quiz scores, and workspace operations once you begin studying papers in your Research Library.
          </p>
          <div className="text-[10px] text-slate-400 font-mono border border-slate-100 bg-slate-50/50 px-3 py-1.5 rounded-lg">
            Awaiting document uploads to generate live analytics.
          </div>
        </div>
      </div>
    );
  }

  // Mathematics parameters for responsive line chart
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 60;
  const paddingY = 40;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;
  const maxHours = Math.max(...monthlyReadingData.map(d => d.hours));
  const chartMax = maxHours > 0 ? maxHours * 1.2 : 5; // give 20% margin or baseline of 5h

  // Polyline string construction for dynamic hours curve
  const curvePoints = monthlyReadingData.map((d, idx) => {
    const x = paddingX + (idx / (monthlyReadingData.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (d.hours / chartMax) * usableHeight;
    return `${x},${y}`;
  }).join(' ');

  // Polygon area string construction
  const areaPoints = `${paddingX},${chartHeight - paddingY} ${curvePoints} ${chartWidth - paddingX},${chartHeight - paddingY}`;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto text-left" id="analytics_root">
      
      {/* 1. OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="analytics_agg_cards">
        
        {/* Card A: Study Pace */}
        <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md p-6 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Average Study Pace</span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-0.5 truncate">{avgStudyPace} mins/day</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
              {uniqueActiveDays > 0 ? `Across ${uniqueActiveDays} active study ${uniqueActiveDays === 1 ? 'day' : 'days'}` : 'No sessions recorded'}
            </p>
          </div>
        </div>

        {/* Card B: Passing Rate */}
        <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md p-6 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Assessment Passing Rate</span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-0.5 truncate">
              {quizScores.length > 0 ? `${avgPassingRate}% Avg` : '—'}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
              {quizScores.length > 0 ? `${quizScores.length} assessments completed` : '0 assessments completed'}
            </p>
          </div>
        </div>

        {/* Card C: Research Papers Uploaded (REPLACING STREAK MAINTAINED) */}
        <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md p-6 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Research Papers</span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-0.5 truncate">{papersCount} Uploaded</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">Stored in research library</p>
          </div>
        </div>

        {/* Card D: Workspace Operations */}
        <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md p-6 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Workspace Operations</span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-0.5 truncate">{workspaceOpsCount} completed</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">100% active cloud sync</p>
          </div>
        </div>
      </div>

      {/* 2. COMPREHENSIVE SYSTEM AUDIT TRAIL */}
      <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md rounded-3xl shadow-sm p-6" id="comprehensive_audit_trail_section">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h4 className="font-display font-black text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-blue-600" />
            Comprehensive System Audit Trail
          </h4>
          <button 
            onClick={fetchAllData}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh logs"
            id="refresh_logs_btn"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {activities.length > 0 ? (
          <div className="overflow-x-auto" id="audit_trail_table">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100 text-[9px] font-mono">
                  <th className="p-3 w-1/5">Timestamp</th>
                  <th className="p-3 w-1/5">Action & Module</th>
                  <th className="p-3 w-1/4">Linked Paper Context</th>
                  <th className="p-3">User Activity</th>
                  <th className="p-3 w-[100px] text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => {
                  const info = getAuditDetails(act.type);
                  const actDate = new Date(act.timestamp);
                  return (
                    <tr key={act.id} className="border-b border-slate-150/40 hover:bg-white/40 transition-colors text-slate-700">
                      {/* Timestamp */}
                      <td className="p-3 font-mono text-slate-400">
                        <div className="font-bold">
                          {actDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] mt-0.5">
                          {actDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      {/* Action & Module */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`p-1.5 rounded-lg border ${info.color}`}>
                            {info.icon}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block">{info.action}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{info.module}</span>
                          </div>
                        </div>
                      </td>
                      {/* Linked Paper Context */}
                      <td className="p-3 font-semibold text-slate-600 max-w-[200px] truncate" title={act.paperTitle}>
                        {act.paperTitle || 'All Library'}
                      </td>
                      {/* Detailed Activity Description */}
                      <td className="p-3 text-slate-600 leading-relaxed font-medium">
                        {act.detail}
                      </td>
                      {/* Status Badge */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/50 font-mono">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          SYNCED
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-mono text-center p-6">No study actions or telemetry compiled in system audit trail.</p>
        )}
      </div>

      {/* 3. MONTHLY READING HOUR AGGREGATION */}
      <div className="bg-white/60 border border-slate-200/50 backdrop-blur-md rounded-3xl shadow-sm p-6 relative flex flex-col justify-between" id="monthly_reading_aggregation_section">
        <div>
          <h4 className="font-display font-black text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
            Monthly Reading Hour Aggregation
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Visualizes total active paper research hours dynamically aggregated across the past 6 calendar months.</p>
        </div>

        {/* Interactive Custom SVG Chart Container */}
        <div className="my-8 relative" id="synthesis_reading_curve">
          <svg className="w-full h-full min-h-[220px]" viewBox="0 0 900 220" preserveAspectRatio="none">
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + ratio * usableHeight;
              const value = Math.round((chartMax * (1 - ratio)) * 10) / 10;
              return (
                <g key={i}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={chartWidth - paddingX} 
                    y2={y} 
                    stroke={theme === 'dark' ? 'rgba(71, 85, 105, 0.4)' : '#F1F5F9'} 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 15} 
                    y={y + 3} 
                    fill="#94A3B8" 
                    className="text-[9px] font-mono font-semibold" 
                    textAnchor="end"
                  >
                    {value}h
                  </text>
                </g>
              );
            })}

            {/* Glowing Gradient Definition */}
            <defs>
              <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under the curve */}
            <polygon
              points={areaPoints}
              fill="url(#curve-gradient)"
              className="transition-all duration-300"
            />

            {/* Connecting curve line */}
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={curvePoints}
              className="transition-all duration-300"
            />

            {/* Interactive Grid nodes */}
            {monthlyReadingData.map((d, idx) => {
              const x = paddingX + (idx / (monthlyReadingData.length - 1)) * usableWidth;
              const y = chartHeight - paddingY - (d.hours / chartMax) * usableHeight;
              const isHovered = hoveredIdx === idx;

              return (
                <g key={idx}>
                  {/* Subtle vertical hover guideline */}
                  {isHovered && (
                    <line 
                      x1={x} 
                      y1={paddingY} 
                      x2={x} 
                      y2={chartHeight - paddingY} 
                      stroke="#3B82F6" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="opacity-70 animate-fade-in"
                    />
                  )}                   {/* Node Background Halo on Hover */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 10 : 0}
                    fill={theme === 'dark' ? '#1e40af' : '#BFDBFE'}
                    className="transition-all duration-200 opacity-40"
                  />

                  {/* Core Coordinate Circle Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 4}
                    fill={theme === 'dark' ? '#0f172a' : '#FFFFFF'}
                    stroke="#2563EB"
                    strokeWidth={isHovered ? 3.5 : 2.5}
                    className="transition-all duration-200 cursor-pointer"
                  />

                  {/* X-Axis labels */}
                  <text
                    x={x}
                    y={chartHeight - paddingY + 22}
                    fill={isHovered ? (theme === 'dark' ? '#F8FAFC' : '#1E293B') : '#64748B'}
                    className={`text-[10px] font-mono transition-colors ${isHovered ? 'font-bold' : 'font-medium'}`}
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}

            {/* Invisible wide mouse track columns for responsive hitboxes */}
            {monthlyReadingData.map((d, idx) => {
              const x = paddingX + (idx / (monthlyReadingData.length - 1)) * usableWidth;
              const colWidth = usableWidth / (monthlyReadingData.length - 1);
              const startX = x - colWidth / 2;

              return (
                <rect
                  key={idx}
                  x={startX}
                  y={paddingY}
                  width={colWidth}
                  height={usableHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Absolute floating HTML tooltip card */}
          {hoveredIdx !== null && (
            <div 
              className="absolute bg-slate-900/90 text-white text-[11px] p-3 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md pointer-events-none transition-all duration-150 z-10 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${paddingX + (hoveredIdx / (monthlyReadingData.length - 1)) * usableWidth}px`,
                top: `${chartHeight - paddingY - (monthlyReadingData[hoveredIdx].hours / chartMax) * usableHeight - 55}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold text-slate-300 uppercase tracking-wider text-[8px] font-mono">{monthlyReadingData[hoveredIdx].month} Study Summary</div>
              <div className="text-sm font-black text-blue-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {monthlyReadingData[hoveredIdx].hours} hrs logged
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {monthlyReadingData[hoveredIdx].sessions > 0 
                  ? `Across ${monthlyReadingData[hoveredIdx].sessions} active workspace sessions`
                  : '0 active study sessions recorded'}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
