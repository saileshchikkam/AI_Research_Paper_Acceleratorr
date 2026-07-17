import React, { useState, useEffect, useRef } from 'react';
import { User, DashboardMetrics, Paper, StudyActivity } from '../types';
import { 
  Clock, BookOpen, Brain, CheckCircle2, 
  Calendar, Mail, User as UserIcon, Shield, Star,
  GraduationCap, Building2, AlignLeft, Camera, 
  Edit, Save, X, ChevronRight, FileText, CheckCircle,
  MessageSquare, Flame, Check, AlertCircle, RefreshCw,
  Sparkles, History
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onOpenPaper: (paperId: string) => void;
  onUserUpdate?: (updatedUser: User) => void;
}

export default function Profile({ user, onOpenPaper, onUserUpdate }: ProfileProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [bookmarkedPapers, setBookmarkedPapers] = useState<Paper[]>([]);
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username || user.email.split('@')[0]);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editAvatar, setEditAvatar] = useState(user.avatar || '');
  const [editRole, setEditRole] = useState(user.role);

  // UI state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileData = async () => {
    try {
      const [metRes, papRes, actRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/papers'),
        fetch('/api/activities')
      ]);

      if (metRes.ok && papRes.ok && actRes.ok) {
        const metricsData = await metRes.json();
        const papersData = await papRes.json();
        const activitiesData = await actRes.json();

        setMetrics(metricsData);
        setPapers(papersData);
        setBookmarkedPapers(papersData.filter((p: Paper) => p.isBookmarked));
        setActivities(activitiesData);
      }
    } catch (err) {
      console.error('Failed to fetch profile metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Image Upload handler: converts image file to Base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAvatar(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and drop events
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
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleEditClick = () => {
    setEditName(user.name);
    setEditUsername(user.username || user.email.split('@')[0]);
    setEditEmail(user.email);
    setEditAvatar(user.avatar || '');
    setEditRole(user.role);
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Form validation
    if (!editName.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }
    if (!editUsername.trim()) {
      setErrorMsg('Username cannot be empty.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editName,
          username: editUsername,
          email: editEmail,
          avatar: editAvatar,
          role: editRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      if (data.success && onUserUpdate) {
        onUserUpdate(data.user);
        setSuccessMsg('Profile successfully updated!');
        setIsEditing(false);
        // Clear message after 4 seconds
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // REAL-TIME STATISTICS CALCULATIONS (Dynamic, No placeholders)
  // ==========================================
  const statPapersUploaded = papers.length;
  const statSummariesGenerated = papers.filter(p => p.summary).length;
  const statChatsCompleted = activities.filter(a => a.type === 'chat').length;
  const statQuizzesCompleted = activities.filter(a => a.type === 'quiz').length;
  const statFlashcardsReviewed = activities.filter(a => a.type === 'flashcard').length;
  const statReadingSessions = activities.filter(a => a.type === 'read').length;

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6" id="profile_loading_skeleton">
        <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse md:col-span-2" />
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-left" id="profile_root">
      
      {/* SUCCESS & ERROR NOTIFICATION BANNERS */}
      {successMsg && (
        <div 
          className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl shadow-sm text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300"
          id="success_notification"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div 
          className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl shadow-sm text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300"
          id="error_banner"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. PROFILE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 animate-in fade-in duration-300" id="profile_page_header">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">Scholar Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your identity, track milestones, and view research analytics.</p>
        </div>
      </div>

      {/* 2. PROFILE INFORMATION CARD (Profile Photo + User Details + Edit Profile) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm" id="profile_info_card">
        {isEditing ? (
          <form onSubmit={handleSaveClick} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Photo Upload Zone (Left Column) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Profile Photo</label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50/40 scale-[0.98]' 
                      : editAvatar 
                        ? 'border-slate-200 bg-slate-50/50' 
                        : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50'
                  }`}
                  id="profile_photo_uploader"
                >
                  {editAvatar ? (
                    <div className="relative group w-full h-full">
                      <img 
                        src={editAvatar} 
                        alt="Profile preview" 
                        className="w-full h-full rounded-xl object-cover shadow-inner"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setEditAvatar('')}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                          title="Remove Image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 pointer-events-none">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-blue-600">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-[10px] text-slate-400">JPG, PNG up to 2MB</div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {editAvatar && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-center py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                )}
              </div>

              {/* Editable Fields (Right Column) */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="username"
                      className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">Academic Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                    required
                  />
                </div>

                {/* Role selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">Academic Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold capitalize"
                  >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="researcher">Researcher</option>
                    <option value="engineer">Engineer</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Editing Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={saving}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240'} 
                alt={user.name} 
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 capitalize">
                    <Shield className="w-3.5 h-3.5" />
                    {user.role}
                  </div>
                  {user.username && (
                    <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                      @{user.username}
                    </span>
                  )}
                </div>
                <h2 className="font-display font-black text-2xl text-slate-900">{user.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium justify-center md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Enrolled: {formatDate(user.enrolledAt || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>

            {/* COMPACT TOP METADATA SUMMARY & EDIT BUTTON */}
            <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right shrink-0">
              <div className="text-xs text-slate-400 font-mono">
                ID: {user.id}
              </div>
              <button
                onClick={handleEditClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                id="edit_profile_btn"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. PROFILE STATISTICS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="profile_stats_section">
        <div>
          <h3 className="font-display font-black text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            Academic Research Metrics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time metrics compiled dynamically from your active workspace sessions.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Stat 1: Uploaded */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Papers Uploaded</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statPapersUploaded}</p>
          </div>

          {/* Stat 2: AI Summaries */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">AI Summaries</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statSummariesGenerated}</p>
          </div>

          {/* Stat 3: AI Chats */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">AI Chats</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statChatsCompleted}</p>
          </div>

          {/* Stat 4: Quizzes */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Quizzes Done</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statQuizzesCompleted}</p>
          </div>

          {/* Stat 5: Flashcards */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Flashcards Reviewed</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statFlashcardsReviewed}</p>
          </div>

          {/* Stat 6: Reading Sessions */}
          <div className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-all">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Read Sessions</span>
            <p className="text-2xl font-display font-black text-slate-800 mt-2">{statReadingSessions}</p>
          </div>

        </div>
      </div>

      {/* 4. BALANCED GRID: PINNED BIBLIOGRAPHY & RECENT ACTIVITY LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="profile_bottom_grid">
        
        {/* LEFT COLUMN: Pinned & Saved Bibliography */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col h-full" id="pinned_bibliography_section">
          <div>
            <h3 className="font-display font-black text-slate-900 text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Pinned & Saved Bibliography ({bookmarkedPapers.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick-access list of starred literature in your collection.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-3">
            {bookmarkedPapers.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                No pinned papers found in your collection. Star papers in My Library to pin them here.
              </div>
            ) : (
              bookmarkedPapers.map((paper) => (
                <div 
                  key={paper.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500/30 bg-slate-50/20 hover:shadow-md transition-all flex items-center justify-between gap-4 text-left"
                >
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">{paper.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{paper.authors}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-400 font-mono mt-2">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        {paper.fileType || 'PDF'}
                      </span>
                      <span>•</span>
                      <span>Saved: {new Date(paper.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-600">
                        Progress: {paper.readingProgress}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenPaper(paper.id)}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-700 border border-blue-100 rounded-xl transition-all cursor-pointer"
                    title="Quick Open document"
                  >
                    Open
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity Logs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col h-full" id="recent_activity_section">
          <div>
            <h3 className="font-display font-black text-slate-900 text-base flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              Recent Activity Logs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time system actions logged across active research modules.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent learning activity logged.</p>
            ) : (
              activities.slice(0, 12).map((activity) => {
                // Map activity type to styles
                let iconElement = <FileText className="w-3.5 h-3.5 text-blue-600" />;
                let statusLabel = 'Completed';
                let bgCircle = 'bg-blue-50 border-blue-100';

                if (activity.type === 'chat') {
                  iconElement = <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
                  statusLabel = 'Chatted';
                  bgCircle = 'bg-purple-50 border-purple-100';
                } else if (activity.type === 'quiz') {
                  iconElement = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
                  statusLabel = 'Assessment';
                  bgCircle = 'bg-emerald-50 border-emerald-100';
                } else if (activity.type === 'flashcard') {
                  iconElement = <Brain className="w-3.5 h-3.5 text-pink-600" />;
                  statusLabel = 'Reviewed';
                  bgCircle = 'bg-pink-50 border-pink-100';
                } else if (activity.type === 'note') {
                  iconElement = <Edit className="w-3.5 h-3.5 text-amber-600" />;
                  statusLabel = 'Notes Edit';
                  bgCircle = 'bg-amber-50 border-amber-100';
                }

                return (
                  <div key={activity.id} className="text-xs flex gap-3 border-l-2 border-slate-100 pl-4 relative py-1 hover:bg-slate-50/50 rounded-r-xl pr-2 transition-colors">
                    {/* Glowing status bullet */}
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white -left-[6px] top-3" />
                    
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-700 leading-relaxed text-[11px] break-words">
                          {activity.detail}
                          {activity.paperTitle && activity.paperTitle !== 'Research Paper' && activity.paperTitle !== 'All Library' && (
                            <span className="font-bold text-slate-900 block mt-0.5">
                              "{activity.paperTitle}"
                            </span>
                          )}
                        </p>
                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold font-mono ${bgCircle} border uppercase`}>
                          {statusLabel}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
