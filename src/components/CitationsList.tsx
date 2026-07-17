import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, Clipboard, Trash2, Copy, AlertCircle, BookOpen, FileText 
} from 'lucide-react';
import { SavedCitation } from '../types';

export default function CitationsList() {
  const [citations, setCitations] = useState<SavedCitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [masterCopied, setMasterCopied] = useState(false);

  const fetchCitations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/citations');
      if (res.ok) {
        setCitations(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitations();
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDeleteCitation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved citation from your database?')) return;

    try {
      const res = await fetch(`/api/citations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCitations(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyMasterBibliography = () => {
    if (citations.length === 0) return;
    const block = citations.map(c => c.citationText).join('\n\n');
    navigator.clipboard.writeText(block);
    setMasterCopied(true);
    setTimeout(() => setMasterCopied(false), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-left" id="citations_root">
      
      {/* HEADER SECTION */}
      <div className="bg-white border rounded-3xl p-6 border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-display font-black text-slate-900 text-lg flex items-center gap-1.5">
            <BookmarkCheck className="w-5 h-5 text-blue-600" />
            Bibliography Citation Database
          </h3>
          <p className="text-xs text-slate-400 mt-1">Export, search, and manage your custom academic references.</p>
        </div>

        {citations.length > 0 && (
          <button
            onClick={handleCopyMasterBibliography}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 self-start sm:self-center"
            id="copy_all_bib_btn"
          >
            <Copy className="w-4 h-4" />
            {masterCopied ? 'Master Copy Success!' : 'Copy Master Bibliography'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-slate-500 font-mono text-xs py-12">
          Syncing bibliography databases...
        </div>
      ) : citations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4" id="citations_list_grid">
          
          {/* Master bibliography consolidated summary block */}
          <div className="bg-blue-50/20 border border-blue-100 p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-blue-700 tracking-wider font-mono flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Bibliography Preview ({citations.length} publications)
              </h4>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                APA / MLA / BibTeX Mixed
              </span>
            </div>
            
            <div className="max-h-48 overflow-y-auto bg-white border border-slate-100 rounded-xl p-4 text-[11px] leading-relaxed text-slate-600 font-mono select-all">
              {citations.map((c, idx) => (
                <p key={idx} className="mb-2 last:mb-0 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  {c.citationText}
                </p>
              ))}
            </div>
          </div>

          {/* Individual citation cards */}
          {citations.map((cit) => (
            <div 
              key={cit.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              id={`citation_card_${cit.id}`}
            >
              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-100 text-blue-700 uppercase font-bold tracking-wider">
                    {cit.format}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]" title={cit.paperTitle}>
                    Ref: {cit.paperTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                  "{cit.citationText}"
                </p>
                <p className="text-[9px] text-slate-400 font-mono font-medium">
                  Added: {new Date(cit.savedAt).toLocaleDateString()} at {new Date(cit.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => handleCopyText(cit.citationText, cit.id)}
                  className="p-2.5 border hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                  id={`copy_cit_card_${cit.id}`}
                  title="Copy Citation Text"
                >
                  <Clipboard className="w-4 h-4" />
                  {copiedId === cit.id ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => handleDeleteCitation(cit.id)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  id={`delete_cit_card_${cit.id}`}
                  title="Delete Citation"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}

        </div>
      ) : (
        <div className="bg-white border rounded-3xl p-12 text-center border-slate-200 shadow-sm" id="citations_empty_state">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
          <h4 className="font-display font-bold text-slate-700 text-sm">Your bibliography database is empty.</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Go to any paper workspace under the <strong>Research Library</strong>, click the <strong>Citations</strong> tab on the right, and choose <strong>Save Citation</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
