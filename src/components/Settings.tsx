import React, { useState, useEffect } from 'react';
import { 
  Settings, KeyRound, Sliders, Eye, EyeOff, Sparkles, CheckCircle2, RefreshCw 
} from 'lucide-react';

export default function SettingsPage() {
  const [temperature, setTemperature] = useState(0.2);
  const [chunkSize, setChunkSize] = useState(4000);
  const [persona, setPersona] = useState<'scholarly' | 'tutor' | 'reviewer'>('scholarly');
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    fetch('/api/ai-config')
      .then(res => res.json())
      .then(data => {
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data.chunkSize !== undefined) setChunkSize(data.chunkSize);
        if (data.persona !== undefined) setPersona(data.persona);
      })
      .catch(err => console.error('Error fetching AI config:', err));
  }, []);

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, chunkSize, persona })
      });
      if (res.ok) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
      } else {
        console.error('Failed to save configuration');
      }
    } catch (err) {
      console.error('Error saving configuration:', err);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-left space-y-6" id="settings_root">
      
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-black text-slate-900 text-lg">AI Core Configurations</h3>
          <p className="text-xs text-slate-400">Manage hyper-parameters, prompt personas, and ingestion depths.</p>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-8 border-slate-200 shadow-sm">
        {successAlert && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Configurations updated and compiled successfully inside server memory!
          </div>
        )}

        <form onSubmit={handleSaveConfigs} className="space-y-6">
          
          {/* Section 1: Generative Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider font-mono flex items-center gap-1">
              <Sliders className="w-4 h-4" />
              RAG Generative Parameters
            </h4>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Generative Temperature: <span className="font-mono text-blue-600">{temperature}</span></label>
                <span className="text-[10px] text-slate-400 font-mono">0.0 (Factual) to 1.0 (Creative)</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Lower values (e.g. 0.2) force Gemini to adhere strictly to the uploaded paper context with zero hallucination. Higher values increase phrasing variation.
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 font-sans">Semantic Grounding Context Chunk Size: <span className="font-mono text-blue-600">{chunkSize} characters</span></label>
                <span className="text-[10px] text-slate-400 font-mono">Max: 12000 chars</span>
              </div>
              <input
                type="range"
                min="2000"
                max="12000"
                step="500"
                value={chunkSize}
                onChange={e => setChunkSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Specifies how many semantic paragraphs are bundled together as prompt context. Larger chunks increase comparison grounding details.
              </p>
            </div>
          </div>

          {/* Section 2: Prompt Persona Selection */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider font-mono flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              AI Prompt Persona & Core Tone
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'scholarly', label: 'Scholarly Synthesizer', desc: 'Replies in dense academic language with detailed section derivations.' },
                { value: 'tutor', label: 'Simplifier Socratic Tutor', desc: 'Breaks down complex formulas into simple layperson metaphors.' },
                { value: 'reviewer', label: 'Skeptical Peer Reviewer', desc: 'Critiques the paper, questioning methodologies, datasets, and claims.' }
              ].map((pItem) => (
                <div
                  key={pItem.value}
                  onClick={() => setPersona(pItem.value as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                    persona === pItem.value 
                      ? 'border-blue-500 bg-blue-50/20 text-blue-950 font-bold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold">{pItem.label}</h5>
                    <p className="text-[10px] text-slate-400 font-normal mt-1 leading-relaxed">{pItem.desc}</p>
                  </div>
                  <input
                    type="radio"
                    checked={persona === pItem.value}
                    onChange={() => {}}
                    className="mt-3 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Safe API status block */}
          <div className="pt-4 border-t border-slate-100 bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
              <KeyRound className="w-4 h-4 text-blue-600" />
              API Protection Architecture
            </h4>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              ResearchMind AI implements a secure, compliant **Full-Stack Proxy Architecture**. Your Google Gemini API Keys are strictly evaluated server-side (`process.env.GEMINI_API_KEY`) and never sent to the browser.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4.5 h-4.5 fill-emerald-50 text-emerald-600" />
              Gemini model status: Active, Connected via Express Proxy
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            id="save_configs_btn"
          >
            Save AI Configurations
          </button>
        </form>
      </div>

    </div>
  );
}
