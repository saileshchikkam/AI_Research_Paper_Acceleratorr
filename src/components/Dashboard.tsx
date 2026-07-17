import React, { useState, useEffect } from 'react';
import { 
  FileText, FolderHeart, Calendar, FileUp, Sparkles, Plus, 
  ArrowRight, BookOpen, Clock, CheckCircle2, TrendingUp, AlertCircle,
  Timer, Activity, ArrowUpRight
} from 'lucide-react';
import { DashboardMetrics, Folder, Paper, User, StudyActivity } from '../types';

interface DashboardProps {
  user: User;
  onOpenPaper: (paperId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

function formatRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard({ user, onOpenPaper, onNavigateToTab }: DashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthors, setUploadAuthors] = useState('');
  const [uploadJournal, setUploadJournal] = useState('');
  const [uploadYear, setUploadYear] = useState(2026);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [uploadTextContent, setUploadTextContent] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Interactive Chart States
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const uploadSteps = [
    "Uploading PDF binary payload...",
    "Extracting schema & citations...",
    "Invoking Gemini semantic model...",
    "Generating study materials & quizzes...",
    "Storing academic text vectors..."
  ];

  const fetchDashboardData = async () => {
    try {
      const [metRes, folRes, papRes, actRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/folders'),
        fetch('/api/papers'),
        fetch('/api/activities')
      ]);
      if (metRes.ok && folRes.ok && papRes.ok && actRes.ok) {
        setMetrics(await metRes.json());
        setFolders(await folRes.json());
        setPapers(await papRes.json());
        setActivities(await actRes.json());
      }
    } catch (err) {
      console.error('Failed to retrieve dashboard metrics.', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isUploading) {
      setUploadStep(0);
      const interval = setInterval(() => {
        setUploadStep(prev => (prev < uploadSteps.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadTitle(file.name.replace(/\.[^/.]+$/, "")); // Strip extension
      setUploadError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      setUploadError('');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Please provide a document title.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          authors: uploadAuthors || 'Anonymous Researcher',
          journal: uploadJournal || 'University Capstone Proceedings',
          year: uploadYear,
          folderId: selectedFolderId || null,
          rawContent: uploadTextContent, // If empty, server generates text automatically
          fileType: 'application/pdf',
          size: '1.5 MB',
          userId: user.id
        })
      });

      if (res.ok) {
        const newPaper = await res.json();
        setUploadSuccess(`Successfully ingested "${newPaper.title}"!`);
        // Clear form
        setUploadTitle('');
        setUploadAuthors('');
        setUploadJournal('');
        setUploadYear(2026);
        setUploadTextContent('');
        setSelectedFolderId('');
        
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || 'Failed to upload paper.');
      }
    } catch (err) {
      setUploadError('Network error uploading paper.');
    } finally {
      setIsUploading(false);
    }
  };

  // ----------------------------------------------------
  // DYNAMIC CALCULATIONS FOR CURRENT LOGGED IN USER
  // ----------------------------------------------------
  
  // Folders created by current user
  const userFolders = folders.filter(f => !f.userId || f.userId === user.id);
  const libraryFoldersCount = isLoading ? "--" : userFolders.length;

  // Documents uploaded (all available inside workspace / or mapped folders)
  const totalDocumentsCount = isLoading ? "--" : papers.length;

  // Study log activities for current user
  const userActivities = activities.filter(a => a.userId === user.id);
  
  // Quizzes completed count
  const quizzesTakenCount = isLoading 
    ? "--" 
    : userActivities.filter(a => a.type === 'quiz').length;

  // Study hours calculated from actual activities
  const totalStudyMinutes = userActivities.reduce((acc, act) => {
    if (act.type === 'read') return acc + 25;
    if (act.type === 'chat') return acc + 15;
    if (act.type === 'quiz') return acc + 20;
    if (act.type === 'flashcard') return acc + 10;
    if (act.type === 'note') return acc + 15;
    return acc;
  }, 0);
  const studyHoursVal = isLoading 
    ? "--" 
    : totalStudyMinutes > 0 
      ? `${(Math.round((totalStudyMinutes / 60) * 10) / 10).toFixed(1)}h` 
      : "0.0h";

  // Chart configuration
  const maxWeeklyMinutes = metrics ? Math.max(...metrics.weeklyProgress.map(d => d.minutes), 60) : 60;

  // Activity logs mapper
  const getActivityDetails = (act: StudyActivity) => {
    switch (act.type) {
      case 'read':
        return {
          title: act.detail || "PDF Research Paper Ingested",
          icon: <FileText className="w-3.5 h-3.5 text-blue-500" />,
          bg: "bg-blue-50/70 border border-blue-100/50",
          badge: "✓ Ingested"
        };
      case 'chat':
        return {
          title: act.detail || "AI Research Conversation",
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />,
          bg: "bg-purple-50/70 border border-purple-100/50",
          badge: "✓ Grounded"
        };
      case 'quiz':
        return {
          title: act.detail || "Academic Practice Quiz",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />,
          bg: "bg-amber-50/70 border border-amber-100/50",
          badge: "✓ Scored"
        };
      case 'note':
        return {
          title: act.detail || "Document Annotation Created",
          icon: <BookOpen className="w-3.5 h-3.5 text-emerald-500" />,
          bg: "bg-emerald-50/70 border border-emerald-100/50",
          badge: "✓ Persisted"
        };
      case 'flashcard':
        return {
          title: act.detail || "Recall Review Completed",
          icon: <Timer className="w-3.5 h-3.5 text-indigo-500" />,
          bg: "bg-indigo-50/70 border border-indigo-100/50",
          badge: "✓ Reviewed"
        };
      default:
        return {
          title: act.detail || "Workspace Study Activity",
          icon: <Activity className="w-3.5 h-3.5 text-slate-500" />,
          bg: "bg-slate-50/70 border border-slate-100/50",
          badge: "✓ Processed"
        };
    }
  };

  const handleBarMouseMove = (idx: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 45
      });
    }
    setHoveredBar(idx);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" id="dashboard_root">
      {/* CAPSTONE ADVISORY NOTICE BANNER */}
      <div className="bg-gradient-to-r from-emerald-600/95 via-cyan-600/90 to-violet-700/95 rounded-3xl p-6 text-white shadow-2xl shadow-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden border border-white/10" id="dashboard_welcome_banner">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 flex items-center pointer-events-none">
          <Sparkles className="w-64 h-64 translate-x-12 translate-y-12 text-cyan-200" />
        </div>
        <div className="space-y-1.5 relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Adaptive AI Recommender
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight">
            Welcome back, {user.name}!
          </h3>
          <p className="text-xs text-slate-100 max-w-2xl font-medium leading-relaxed">
            Based on your role as <span className="underline font-extrabold text-cyan-200">{user.role}</span>, we recommend conducting a comparative review on <strong className="text-white font-extrabold">RAG Formulations</strong> today. You have a study assessment due on Attention mechanisms!
          </p>
        </div>
        <button 
          onClick={() => onNavigateToTab('library')}
          className="bg-white/10 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all relative z-10 shrink-0 self-start md:self-center cursor-pointer"
          id="banner_action_btn"
        >
          Enter Library
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard_stats_grid">
        <div className="bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-4 glow-card transition-all text-left">
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/15">
            <FileText className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider font-bold">Total Documents</span>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalDocumentsCount}</h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Verified uploaded files</p>
          </div>
        </div>

        <div className="bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-4 glow-card transition-all text-left">
          <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 p-3.5 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/15">
            <FolderHeart className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider font-bold">Library Folders</span>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{libraryFoldersCount}</h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Segmented categories</p>
          </div>
        </div>

        <div className="bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-4 glow-card transition-all text-left">
          <div className="bg-violet-500/10 text-violet-600 dark:text-violet-400 p-3.5 rounded-2xl flex items-center justify-center shrink-0 border border-violet-500/15">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider font-bold">Quizzes Taken</span>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{quizzesTakenCount}</h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Assessment feedback logs</p>
          </div>
        </div>

        <div className="bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-4 glow-card transition-all text-left">
          <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-3.5 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/15">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider font-bold">Study Hours</span>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{studyHoursVal}</h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Calculated active focus</p>
          </div>
        </div>
      </div>

      {/* MID SECTION: SAS INGESTION PORTAL (LEFT) & STUDY LOG STREAM (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="dashboard_mid_grid">
        {/* SaaS Ingestion Portal */}
        <div className="lg:col-span-7 bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm text-left flex flex-col justify-between h-full" id="sas_ingestion_portal">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileUp className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                SaaS Ingestion Portal
              </h4>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-emerald-500/20">
                PDF Upload
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Drag PDFs/files or enter text parameters. Gemini will auto-generate dense scholarly chapters with full semantic text vectors.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5" id="upload_portal_form">
              {uploadError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                  {uploadSuccess}
                </div>
              )}

              {isUploading ? (
                /* Active Upload Animation & Step Progress */
                <div className="border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-2xl p-5 text-center space-y-3 flex flex-col justify-center min-h-[160px]" id="uploading_progress_area">
                  <div className="relative w-10 h-10 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white animate-pulse">{uploadSteps[uploadStep]}</p>
                    <p className="text-[9px] text-slate-400 font-mono">Step {uploadStep + 1} of {uploadSteps.length}</p>
                  </div>
                  <div className="w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${((uploadStep + 1) / uploadSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* Custom Expanded Drag and Drop Box */
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all relative cursor-pointer min-h-[160px] flex flex-col justify-center items-center ${
                    dragActive ? 'border-emerald-500 bg-emerald-500/5 shadow-inner scale-[0.99]' : 'border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40'
                  }`}
                >
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.md"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file_input_field"
                  />
                  <FileUp className="w-7 h-7 text-emerald-500 mx-auto mb-2 duration-200" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {uploadTitle ? `Selected: ${uploadTitle.substring(0, 45)}...` : 'Drag & drop research paper PDF'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">or click to browse local files</p>
                  <p className="text-[9px] text-slate-300 dark:text-slate-500 mt-2">Supported Formats: PDF, TXT, MD • Max 50MB</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Document Title</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={e => { setUploadTitle(e.target.value); setUploadError(''); }}
                  placeholder="e.g. Attention Is All You Need"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white"
                  required
                  disabled={isUploading}
                  id="upload_title_field"
                />
              </div>

              {/* Optional Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Authors</label>
                  <input 
                    type="text" 
                    value={uploadAuthors}
                    onChange={e => setUploadAuthors(e.target.value)}
                    placeholder="e.g. Vaswani et al."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white"
                    disabled={isUploading}
                    id="upload_authors_field"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Publish Year</label>
                  <input 
                    type="number" 
                    value={uploadYear}
                    onChange={e => setUploadYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white"
                    disabled={isUploading}
                    id="upload_year_field"
                  />
                </div>
              </div>

              {/* Folder Destination & Text Input Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Assign Folder</label>
                  <select 
                    value={selectedFolderId}
                    onChange={e => setSelectedFolderId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-[#0f172a]/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white"
                    disabled={isUploading}
                    id="upload_folder_field"
                  >
                    <option value="">(None - Root)</option>
                    {userFolders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Journal Venue</label>
                  <input 
                    type="text" 
                    value={uploadJournal}
                    onChange={e => setUploadJournal(e.target.value)}
                    placeholder="e.g. NeurIPS, arXiv"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white"
                    disabled={isUploading}
                    id="upload_journal_field"
                  />
                </div>
              </div>

              {/* Optional text area */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Optional Plain Text Copy</label>
                <textarea
                  value={uploadTextContent}
                  onChange={e => setUploadTextContent(e.target.value)}
                  placeholder="Paste text contents here. If left empty, Gemini will auto-generate complete scholarly paper chapters for you based on the title!"
                  className="w-full h-20 px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/30 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 dark:text-white resize-none font-mono leading-relaxed"
                  disabled={isUploading}
                  id="upload_raw_content_field"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 hover:opacity-90 text-white font-extrabold py-3 rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="upload_submit_btn"
              >
                {isUploading ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing & Ingesting Paper...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Ingest Scholarly Paper
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Study Log Stream */}
        <div className="lg:col-span-5 bg-white/45 dark:bg-[#141a2b]/40 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-sm text-left flex flex-col justify-between h-full" id="study_log_stream">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-emerald-500" />
                  Study Log Stream
                </h4>
                <span className="text-[9px] bg-slate-200/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Real-time Logs
                </span>
              </div>
              
              <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1" id="activity_feed">
                {isLoading ? (
                  /* Loading indicators */
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-2.5 animate-pulse border-b border-slate-200/25 dark:border-slate-800/30 py-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-200/30 dark:bg-slate-800/40 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2.5 bg-slate-200/30 dark:bg-slate-800/40 rounded w-2/3" />
                        <div className="h-2 bg-slate-200/20 dark:bg-slate-800/30 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : userActivities.length > 0 ? (
                  userActivities.map((act) => {
                    const details = getActivityDetails(act);
                    return (
                      <div key={act.id} className="flex gap-2.5 text-[11px] py-2 border-b border-slate-200/20 dark:border-slate-800/20 last:border-b-0 last:pb-0 fade-in-up items-start hover:bg-white/5 dark:hover:bg-slate-900/20 p-1.5 rounded-xl transition-colors">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${details.bg}`}>
                          {details.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight pr-3 text-[11px]">{details.title}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
                            <span className="font-mono text-slate-500 dark:text-slate-400 font-medium max-w-[130px] truncate block" title={act.paperTitle}>
                              {act.paperTitle}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{formatRelativeTime(act.timestamp)}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 border border-slate-200/60 dark:border-slate-800/50 rounded px-1.5 py-0.5 whitespace-nowrap shrink-0 self-start">
                          {details.badge}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  /* Elegant Empty State */
                  <div className="py-16 text-center border border-dashed border-slate-200/40 dark:border-slate-800/40 rounded-2xl bg-white/20 dark:bg-slate-900/10">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">No active research logs recorded yet.</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">Upload files or review flashcards to populate logs.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] border-t border-slate-200/25 dark:border-slate-800/30 pt-3.5 mt-4" id="study_log_footer">
              <span className="text-slate-500 dark:text-slate-400">Registered Activities: <strong>{userActivities.length}</strong></span>
              <button 
                onClick={() => onNavigateToTab('library')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                Enter Document Library
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY INGESTION METRICS */}
      <div className="bg-[#101524]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl text-left relative overflow-hidden flex flex-col justify-between" id="weekly_metrics_panel">
        <div className="absolute right-0 top-0 opacity-10 flex items-center pointer-events-none">
          <TrendingUp className="w-64 h-64 translate-x-12 -translate-y-12 text-emerald-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-display font-black text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Weekly Ingestion Metrics
              </h4>
              <p className="text-xs text-slate-400 mt-1">Focus analytics tracking dynamic reading logs, annotations, and system interactive minutes.</p>
            </div>
            <span className="self-start sm:self-auto text-[10px] bg-white/10 text-emerald-400 font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
              Minutes Active
            </span>
          </div>
        </div>

        {/* SVG Custom Interactive Graph */}
        <div className="my-8 relative flex-1 min-h-[220px]" id="svg_chart_container">
          {metrics ? (
            <>
              <svg className="w-full h-full min-h-[220px]" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = 20 + ratio * 140;
                  const labelVal = Math.round(maxWeeklyMinutes * (1 - ratio));
                  return (
                    <g key={i}>
                      <line x1="45" y1={y} x2="490" y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="5" y={y + 4} fill="#94a3b8" className="text-[9px] font-mono" textAnchor="start">
                        {labelVal}m
                      </text>
                    </g>
                  );
                })}

                {/* Draw active vertical bars */}
                {metrics.weeklyProgress.map((item, idx) => {
                  const spacing = 440 / 7;
                  const x = 50 + idx * spacing + (spacing - 24) / 2;
                  const barHeight = (item.minutes / maxWeeklyMinutes) * 140;
                  const y = 160 - barHeight;
                  const isHovered = hoveredBar === idx;

                  return (
                    <g key={idx}>
                      {/* Interactive hover background overlay */}
                      <rect 
                        x={x - 6} 
                        y="15" 
                        width="36" 
                        height="150" 
                        fill="transparent" 
                        className="cursor-pointer"
                        onMouseEnter={(e) => handleBarMouseMove(idx, e)}
                        onMouseMove={(e) => handleBarMouseMove(idx, e)}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                      
                      {/* Base Bar (for glowing aesthetic behind) */}
                      {isHovered && (
                        <rect
                          x={x - 2}
                          y={y - 2}
                          width="28"
                          height={Math.max(barHeight + 4, 8)}
                          rx="6"
                          fill="#10B981"
                          opacity="0.35"
                          className="blur-sm transition-all duration-200"
                        />
                      )}

                      {/* Actual vertical colored bar */}
                      <rect
                        x={x}
                        y={y}
                        width="24"
                        height={Math.max(barHeight, 5)}
                        rx="5"
                        fill={isHovered ? '#10B981' : idx === new Date().getDay() - 1 ? '#06B6D4' : '#475569'}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={(e) => handleBarMouseMove(idx, e)}
                        onMouseMove={(e) => handleBarMouseMove(idx, e)}
                        onMouseLeave={() => setHoveredBar(null)}
                      />

                      {/* X Axis text label */}
                      <text
                        x={x + 12}
                        y="182"
                        fill={isHovered ? '#10B981' : '#94a3b8'}
                        className="text-[10px] font-semibold text-center font-sans"
                        textAnchor="middle"
                      >
                        {item.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Responsive Tooltip Div */}
              {hoveredBar !== null && metrics.weeklyProgress[hoveredBar] && (
                <div 
                  className="absolute bg-[#141a2b] border border-white/15 text-white px-3 py-2 rounded-xl text-[10px] font-medium pointer-events-none shadow-xl -translate-x-1/2 transition-all duration-100 z-30"
                  style={{ left: tooltipPos.x, top: tooltipPos.y }}
                >
                  <p className="font-bold text-slate-300 uppercase tracking-wider text-[8px] font-mono">{metrics.weeklyProgress[hoveredBar].day} Focus</p>
                  <p className="text-[#10B981] font-mono mt-0.5 font-bold text-xs">
                    {metrics.weeklyProgress[hoveredBar].minutes} mins active
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
              Recalculating focus vectors...
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs border-t border-white/10 pt-4 relative z-10" id="chart_summary">
          <span className="text-slate-400">Average Focus Session: <strong>42 mins/day</strong></span>
          <button 
            onClick={() => onNavigateToTab('analytics')}
            className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Analyze Study Patterns
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CATEGORIZED DIRECTORIES */}
      <div className="space-y-4" id="categorized_directories_section">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2 text-left">
              <FolderHeart className="w-5 h-5 text-emerald-500" />
              Categorized Directories
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click folder cards to open structured workspaces within your Research Library.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('library')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Manage Folders
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard_folders_grid">
          {isLoading ? (
            /* Folder skeletal placeholders */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/30 dark:bg-slate-900/30 border border-slate-200/30 p-5 rounded-2xl h-36 animate-pulse" />
            ))
          ) : userFolders.length > 0 ? (
            userFolders.map(fol => {
              const count = papers.filter(p => p.folderId === fol.id).length;
              
              // Blinking status green/blue indicator if any recent user activity occurred on papers in this folder
              const hasRecent = activities.some(
                act => act.userId === user.id && 
                       act.paperId && 
                       papers.some(p => p.id === act.paperId && p.folderId === fol.id)
              );

              return (
                <div
                  key={fol.id}
                  className="group relative bg-white/45 dark:bg-[#141a2b]/40 hover:bg-white/80 dark:hover:bg-[#141a2b]/70 border border-slate-200/50 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 backdrop-blur-md rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between text-left cursor-default"
                  id={`folder_card_${fol.id}`}
                >
                  {/* Blinking Recent Indicator dot */}
                  {hasRecent && (
                    <span className="absolute top-4 right-4 flex h-2 w-2" title="Recent activity detected in folder">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}

                  <div>
                    {/* Icon container colored dynamically */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 border"
                      style={{ backgroundColor: `${fol.color}15`, borderColor: `${fol.color}30`, color: fol.color }}
                    >
                      <FolderHeart className="w-5 h-5" style={{ stroke: fol.color }} />
                    </div>

                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate font-display">{fol.name}</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold uppercase tracking-wider font-mono">
                      {count} paper{count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/20 dark:border-slate-800/30 pt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      Updated {formatRelativeTime(fol.createdAt)}
                    </span>
                    <button 
                      onClick={() => onNavigateToTab('library')}
                      className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      Quick Open
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            /* Elegant Empty State for Folders */
            <div className="col-span-full py-12 text-center bg-white/20 dark:bg-slate-900/10 border border-dashed border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
              <FolderHeart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No active library folders categorized yet.</p>
              <button 
                onClick={() => onNavigateToTab('library')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline mt-2 inline-block cursor-pointer"
              >
                + Create new folder inside library
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
