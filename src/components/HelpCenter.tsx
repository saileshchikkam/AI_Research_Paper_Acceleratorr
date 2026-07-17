import React, { useState } from 'react';
import { 
  HelpCircle, BookOpen, ChevronDown, ChevronUp, Shield, Sparkles, KeyRound 
} from 'lucide-react';

export default function HelpCenter() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ResearchMind AI remain factually accurate without hallucinating?',
      a: 'We use Retrieval-Augmented Generation (RAG). When you submit a question, our backend searches your paper for paragraphs matching your text. It then wraps those exact paragraphs as context grounded inside low-temperature Gemini instructions. If a fact cannot be found in the provided paper text, Gemini states it cannot answer, keeping facts 100% accurate.'
    },
    {
      q: 'What is the "Synthesis Studio" and how does it compare multiple documents?',
      a: 'The Synthesis Studio lets you compare multiple publications at once. Select any two or more papers, click "Synthesize", and Gemini will formulate a comprehensive comparison grid, narrative literature synthesis, and gap analysis by reading and reconciling the technical arguments of all selected papers simultaneously.'
    },
    {
      q: 'Can I upload full textbooks or very large publications?',
      a: 'Yes! Our backend supports file parsing. However, to stay within standard Gemini context window limitations and guarantee prompt latency speeds of under 3 seconds, we partition the document and index text chunks. Standard single-paper chats search across up to 12,000 characters of grounded texts.'
    },
    {
      q: 'What happens if my "Gemini API Key" is not configured?',
      a: 'If process.env.GEMINI_API_KEY is missing, ResearchMind AI operates in a clean, highly formatted offline/mock mode. Quizzes, flashcards, and literature matrices will load beautiful, prepopulated scientific simulations and fallbacks so you can test and inspect the full interface seamlessly!'
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto text-left space-y-8" id="help_center_root">
      
      {/* HEADER PANELS */}
      <div className="bg-white border rounded-3xl p-6 border-slate-200 shadow-sm flex items-center gap-4">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl flex items-center justify-center shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-black text-slate-900 text-lg">Help Center & Scholarly RAG Guide</h3>
          <p className="text-xs text-slate-400">Everything you need to know about vector parsing, quizzes, and AI grounding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="help_main_grid">
        
        {/* Left: FAQ accordions (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider font-mono mb-2">Frequently Asked Questions</h4>
          
          <div className="space-y-3" id="faq_accordions">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-between"
                    id={`faq_toggle_${idx}`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Technical vector parameters explanation (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              Technical Stack Overview
            </h4>

            <div className="space-y-3 text-[11px] leading-relaxed font-medium text-slate-500">
              <p>
                <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
              </p>
              <p>
                <strong>Backend:</strong> Express Full-Stack Node.js architecture serving SPA fallback assets.
              </p>
              <p>
                <strong>Database:</strong> Durable local JSON database (`server-db.ts` / `src/db.json`) for active persistence.
              </p>
              <p>
                <strong>AI Model:</strong> Google Gemini 2.5 API, queried through low-temperature proxy calls.
              </p>
            </div>
          </div>

          <div className="bg-blue-50/25 border border-blue-100 p-6 rounded-3xl text-left space-y-3">
            <h4 className="text-[9px] font-black uppercase text-blue-700 tracking-wider font-mono flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-600" />
              Capstone Privacy Policy
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
              This system compiles data local strictly to this workspace instance. Intellectual property regarding uploaded manuscripts remains safe inside isolated sandboxes.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
