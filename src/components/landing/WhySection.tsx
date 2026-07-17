import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Clock, Bookmark, Network, ArrowUpRight } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  accentColor: string;
}

interface WhySectionProps {
  onBenefitClick?: () => void;
}

export default function WhySection({ onBenefitClick }: WhySectionProps) {
  const benefits: BenefitItem[] = [
    {
      icon: <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: "Save Exhausting Research Time",
      description: "Synthesize massive doctoral files, clinical documentations, and academic collections in minutes instead of exhausting weeks.",
      stat: "90%",
      statLabel: "Time Saved",
      accentColor: "text-emerald-500 dark:text-emerald-400"
    },
    {
      icon: <Bookmark className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      title: "Deconstruct Multi-Jargon Papers",
      description: "Decode heavy terminology, dense mathematical proofs, and specialized research methodologies into clear, plain explanations.",
      stat: "10x",
      statLabel: "Faster Comprehension",
      accentColor: "text-violet-500 dark:text-violet-400"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: "Rigorous Memory Systems",
      description: "Retain high-fidelity ideas via automatic flashcards and adaptive retrieval practices paired with Spaced Repetition algorithms.",
      stat: "85%",
      statLabel: "Retention Rate Boost",
      accentColor: "text-cyan-500 dark:text-cyan-400"
    },
    {
      icon: <Network className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      title: "Visual Knowledge Mapping",
      description: "Generate connected mind maps, citation vectors, and hypothesis clusters automatically in beautiful interactive screens.",
      stat: "100%",
      statLabel: "Cohesive Mapping",
      accentColor: "text-rose-500 dark:text-rose-400"
    }
  ];

  return (
    <section className="py-24 bg-slate-50/20 dark:bg-[#070a13]/20 border-t border-slate-100/40 dark:border-slate-800/60 backdrop-blur-3xl relative overflow-hidden" id="landing_why_section">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Marketing pitch & stats */}
          <div className="lg:col-span-5 space-y-8 text-left" id="why_pitch_container">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              Verified Performance Gains
            </div>
            
            <h3 className="font-display font-black text-3xl sm:text-4.5xl text-slate-950 dark:text-white tracking-tight leading-tight">
              Designed For the Rigor of Advanced Scholarship
            </h3>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Academic workloads have grown exponentially. ResearchMind AI provides the cognitive leverage required to index, organize, digest, and compare massive quantities of text without losing accuracy or grounding.
            </p>

            {/* Compare box */}
            <div className="bg-white/40 dark:bg-slate-950/25 p-6 rounded-3xl border border-white/25 dark:border-slate-800/80 space-y-4 shadow-lg backdrop-blur-2xl" id="why_comparison_box">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                Workflow Transformation
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 bg-rose-500/5 dark:bg-rose-950/10 border border-rose-500/15 rounded-2xl space-y-1.5">
                  <span className="text-rose-600 dark:text-rose-400 block font-black uppercase text-[10px] tracking-wider font-mono">Traditional Method</span>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Manual highlights, scattered papers, broken references, and isolated reading files.</p>
                </div>

                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/15 rounded-2xl space-y-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 block font-black uppercase text-[10px] tracking-wider font-mono">ResearchMind AI</span>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Grounded AI indexers, automated matrices, hyper-precise citations, and active recall sync.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed benefits grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6" id="why_benefits_grid">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.4)' }}
                onClick={onBenefitClick}
                className="p-8 bg-white/20 dark:bg-[#070a14]/20 border border-white/20 dark:border-slate-800/80 rounded-3xl shadow-sm space-y-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between backdrop-blur-2xl group cursor-pointer"
                id={`benefit_card_${idx}`}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-white/50 dark:bg-slate-900 border border-white/40 dark:border-slate-800 rounded-2xl shadow-inner">
                    {benefit.icon}
                  </div>
                  
                  <h4 className="text-lg font-extrabold text-slate-950 dark:text-white leading-snug">
                    {benefit.title}
                  </h4>
                  
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>

                {benefit.stat && (
                  <div className="pt-5 border-t border-slate-100/40 dark:border-slate-800/60 flex items-baseline justify-between">
                    <div>
                      <span className={`text-3xl font-black block tracking-tight ${benefit.accentColor}`}>
                        {benefit.stat}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block mt-0.5">
                        {benefit.statLabel}
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
