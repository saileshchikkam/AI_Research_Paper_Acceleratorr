import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, FolderClosed, Plus, Trash2, Bookmark, BookmarkCheck,
  Search, Eye, Sparkles, MessageSquare, ExternalLink, Move, ChevronRight
} from 'lucide-react';
import { Folder, Paper, User } from '../types';

interface ResearchLibraryProps {
  user: User;
  onOpenPaper: (paperId: string) => void;
  onNavigateToTab: (tab: string, arg?: string) => void;
  onStartComparativeChat: () => void;
  selectedPaperIds: string[];
  setSelectedPaperIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ResearchLibrary({ 
  user, 
  onOpenPaper, 
  onNavigateToTab, 
  onStartComparativeChat,
  selectedPaperIds,
  setSelectedPaperIds
}: ResearchLibraryProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Folder creation states
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6'); // Default Blue

  const colorsList = [
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#EF4444', name: 'Red' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#EC4899', name: 'Pink' }
  ];

  const fetchLibrary = async () => {
    try {
      const [papRes, folRes] = await Promise.all([
        fetch('/api/papers'),
        fetch('/api/folders')
      ]);
      if (papRes.ok && folRes.ok) {
        setPapers(await papRes.json());
        setFolders(await folRes.json());
      }
    } catch (err) {
      console.error('Error fetching library data', err);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDesc,
          color: newFolderColor,
          userId: user.id
        })
      });

      if (res.ok) {
        setNewFolderName('');
        setNewFolderDesc('');
        setShowFolderModal(false);
        fetchLibrary();
      }
    } catch (err) {
      console.error('Error creating folder', err);
    }
  };

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting folder
    if (!confirm('Are you sure you want to delete this folder? Papers inside will remain in the root directory.')) return;

    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (selectedFolderId === folderId) {
          setSelectedFolderId(null);
        }
        fetchLibrary();
      }
    } catch (err) {
      console.error('Error deleting folder', err);
    }
  };

  const handleToggleBookmark = async (paperId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/papers/${paperId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBookmarked: !currentVal })
      });
      if (res.ok) {
        fetchLibrary();
      }
    } catch (err) {
      console.error('Error updating bookmark', err);
    }
  };

  const handleAssignFolder = async (paperId: string, folderId: string) => {
    try {
      const res = await fetch(`/api/papers/${paperId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: folderId || null })
      });
      if (res.ok) {
        fetchLibrary();
      }
    } catch (err) {
      console.error('Error reassigning folder', err);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    if (!confirm('Are you sure you want to permanently delete this paper from your library? This will delete all its notes, flashcards, quizzes, and chat transcripts.')) return;

    try {
      const res = await fetch(`/api/papers/${paperId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchLibrary();
      }
    } catch (err) {
      console.error('Error deleting paper', err);
    }
  };

  // Filter papers
  const filteredPapers = papers.filter(p => {
    // 1. Folder match
    if (selectedFolderId !== null && p.folderId !== selectedFolderId) {
      return false;
    }
    // 2. Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.journal.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" id="library_root">
      
      {/* SEARCH AND COMPARATIVE ACTIONS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" id="library_controls_header">
        {/* Search bar */}
        <div className="relative flex-1 max-w-lg text-left">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search papers by keyword, author, abstract..."
            className="w-full bg-white pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            id="library_search_input"
          />
        </div>

        {/* Rapid Synthesis AI comparisons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStartComparativeChat}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
            id="multi_paper_chat_btn"
          >
            <MessageSquare className="w-4 h-4" />
            AI Comparison Chat
          </button>
          
          <button
            onClick={() => onNavigateToTab('synthesis')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
            id="synthesis_studio_btn"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Synthesis Studio
          </button>
        </div>
      </div>

      {/* DIRECTORIES BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-left">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
            <FolderClosed className="w-4 h-4 text-blue-600" />
            Workspace Directories
          </h4>
          <button 
            onClick={() => setShowFolderModal(true)}
            className="text-blue-600 hover:text-blue-500 text-xs font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100/50 px-2.5 py-1.5 rounded-lg transition-all"
            id="create_folder_trigger"
          >
            <Plus className="w-3.5 h-3.5" />
            New Folder
          </button>
        </div>

        {/* Folders row list */}
        <div className="flex flex-wrap items-center gap-2" id="library_folders_row">
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
              selectedFolderId === null 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            id="folder_tab_all"
          >
            All Papers ({papers.length})
          </button>

          {folders.map(fol => {
            const paperCount = papers.filter(p => p.folderId === fol.id).length;
            const isSelected = selectedFolderId === fol.id;
            return (
              <div 
                key={fol.id}
                onClick={() => setSelectedFolderId(fol.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                id={`folder_tab_${fol.id}`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : fol.color }}
                />
                <span>{fol.name} ({paperCount})</span>
                <button
                  onClick={(e) => handleDeleteFolder(fol.id, e)}
                  className={`p-0.5 rounded transition-colors ${isSelected ? 'hover:bg-blue-500 text-blue-100 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-red-500'}`}
                  title="Delete Folder"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* WORKSPACE DIRECTORIES FORM MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full shadow-2xl p-6 text-left animate-in fade-in zoom-in duration-200">
            <h4 className="font-display font-extrabold text-lg text-slate-950 mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-blue-600" />
              Create Category Folder
            </h4>
            <p className="text-xs text-slate-400 mb-4">Organize research papers by subtopics or classes.</p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="e.g. Transformers & Attention"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={newFolderDesc}
                  onChange={e => setNewFolderDesc(e.target.value)}
                  placeholder="e.g. Core materials for Term-Paper"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Theme Color</label>
                <div className="flex gap-2">
                  {colorsList.map((colorItem) => (
                    <button
                      key={colorItem.value}
                      type="button"
                      onClick={() => setNewFolderColor(colorItem.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        newFolderColor === colorItem.value ? 'scale-110 border-slate-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colorItem.value }}
                      title={colorItem.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Assemble Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAPERS LIST GRID */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="library_papers_grid">
          {filteredPapers.map((paper) => {
            const paperFolder = folders.find(f => f.id === paper.folderId);
            return (
              <div 
                key={paper.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between glow-card transition-all relative text-left"
                id={`paper_card_${paper.id}`}
              >
                {/* Header info */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    {/* Folder Badge & Journal with Checkbox */}
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedPaperIds.includes(paper.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedPaperIds(prev => 
                            prev.includes(paper.id) ? prev.filter(id => id !== paper.id) : [...prev, paper.id]
                          );
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 cursor-pointer shrink-0 transition-all hover:border-blue-400"
                        title="Select paper for comparison matrix"
                        id={`library_checkbox_${paper.id}`}
                      />
                      <div className="flex flex-col items-start gap-1">
                        {paperFolder ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: paperFolder.color }}>
                            {paperFolder.name}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                            Unassigned (Root)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[130px] md:max-w-[150px]" title={paper.journal}>
                          {paper.journal} ({paper.year})
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(paper.id, paper.isBookmarked)}
                      className={`p-1.5 rounded-xl transition-colors ${paper.isBookmarked ? 'bg-amber-50 text-amber-500' : 'hover:bg-slate-100 text-slate-300 hover:text-slate-500'}`}
                      id={`bookmark_toggle_${paper.id}`}
                      title={paper.isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
                    >
                      {paper.isBookmarked ? <BookmarkCheck className="w-4.5 h-4.5 fill-amber-500" /> : <Bookmark className="w-4.5 h-4.5" />}
                    </button>
                  </div>

                  {/* Title & authors */}
                  <h4 className="font-display font-extrabold text-slate-900 text-sm mt-3 leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={() => onOpenPaper(paper.id)}>
                    {paper.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 truncate">
                    {paper.authors}
                  </p>

                  {/* Abstract preview */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>

                {/* Footer and interactive actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 font-mono">Reading progress</span>
                      <span className="text-slate-600 font-mono">{paper.readingProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${paper.readingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Operational elements: Actions & folder move */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    {/* Folder selector inline dropdown */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold" title="Move Paper to Folder">
                      <Move className="w-3.5 h-3.5 shrink-0" />
                      <select
                        value={paper.folderId || ''}
                        onChange={(e) => handleAssignFolder(paper.id, e.target.value)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600 font-medium max-w-[100px]"
                        id={`folder_assign_${paper.id}`}
                      >
                        <option value="">Move To...</option>
                        {folders.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                        {paper.folderId && <option value="">Root Library</option>}
                      </select>
                    </div>

                    {/* Operational view/delete actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeletePaper(paper.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Ingested Paper"
                        id={`delete_paper_btn_${paper.id}`}
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => onOpenPaper(paper.id)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 hover:text-white text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1"
                        id={`open_paper_btn_${paper.id}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Analyze
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm" id="library_empty_state">
          <FolderClosed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-display font-bold text-slate-700 text-base">Your library has no matching documents.</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your filters or use the <strong>SaaS Ingestion Portal</strong> on the main Dashboard to upload a new research paper.
          </p>
          <button 
            onClick={() => onNavigateToTab('dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
            id="empty_state_upload_btn"
          >
            Launch Upload Portal
          </button>
        </div>
      )}

      {selectedPaperIds && selectedPaperIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 text-white" id="library_floating_selection_bar">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200">{selectedPaperIds.length} paper{selectedPaperIds.length > 1 ? 's' : ''} selected</p>
            <p className="text-[10px] text-slate-400">Ready to synthesize comparative matrix</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPaperIds([])}
              className="text-xs text-slate-300 hover:text-white font-semibold transition-colors px-3 py-2 hover:bg-slate-800/50 rounded-xl"
              id="clear_library_selection_btn"
            >
              Clear
            </button>
            <button
              onClick={() => onNavigateToTab('synthesis')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              id="generate_comparative_matrix_library_btn"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              Generate Comparative Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
