import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, MessageSquare, Layers, CheckSquare, 
  Network, Columns, Lightbulb, Quote, BarChart2, ArrowRight
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  colorClass: string;
  glowColor: string;
  iconBg: string;
}

interface FeaturesSectionProps {
  onFeatureClick?: () => void;
}

export default function FeaturesSection({ onFeatureClick }: FeaturesSectionProps) {
  const features: FeatureItem[] = [
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: "AI Summary Engine",
      description: "Condense thousands of pages of heavy research PDFs, clinical journals, or technical corpora into ultra-readable, hyper-structured executive digests instantly.",
      badge: "Gemini 2.5",
      colorClass: "hover:border-emerald-500/40 dark:hover:border-emerald-500/30",
      glowColor: "rgba(16, 185, 129, 0.15)",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/10"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-violet-500 dark:text-violet-400" />,
      title: "Grounded AI Chat",
      description: "Cross-examine single or multi-paper research pools. Our full-stack RAG system pins answers directly to exact source coordinates with verified inline page citations.",
      badge: "Cited RAG",
      colorClass: "hover:border-violet-500/40 dark:hover:border-violet-500/30",
      glowColor: "rgba(139, 92, 246, 0.15)",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/10"
    },
    {
      icon: <Columns className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />,
      title: "Comparative Review Matrices",
      description: "Automatically match, align, and compare methodologies, study sizes, constraints, and statistical findings across up to 10 papers in structured evaluation grids.",
      badge: "Lit Matrix",
      colorClass: "hover:border-cyan-500/40 dark:hover:border-cyan-500/30",
      glowColor: "rgba(6, 182, 212, 0.15)",
      iconBg: "bg-cyan-500/10 dark:bg-cyan-500/10"
    },
    {
      icon: <Layers className="w-6 h-6 text-coral-500 dark:text-rose-400" />,
      title: "Spaced Flashcards",
      description: "Auto-generate highly targeted conceptual flashcards from abstract mathematical or complex technical segments. Rate retention to trigger automated schedules.",
      badge: "Memory",
      colorClass: "hover:border-rose-500/40 dark:hover:border-rose-500/30",
      glowColor: "rgba(244, 63, 94, 0.15)",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/10"
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      title: "Interactive Cognitive Quizzes",
      description: "Generate adaptive study tests designed to probe core theses and factual claims in your papers. Submit drafts and receive deep contextual critiques.",
      badge: "SaaS Studio",
      colorClass: "hover:border-amber-500/40 dark:hover:border-amber-500/30",
      glowColor: "rgba(245, 158, 11, 0.15)",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/10"
    },
    {
      icon: <Network className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
      title: "Visual Mind Mapping",
      description: "Map conceptual parentage, citations, and thematic linkages instantly in responsive vector charts that expand with granular details upon interactive clicks.",
      badge: "Vector Graph",
      colorClass: "hover:border-indigo-500/40 dark:hover:border-indigo-500/30",
      glowColor: "rgba(99, 102, 241, 0.15)",
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/10"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-teal-500 dark:text-teal-400" />,
      title: "Deep Formula & Hypothesis Indexer",
      description: "Instantly isolate, explain, and catalog complex calculations, chemical formulas, and theoretical hypotheses from dense document backgrounds automatically.",
      colorClass: "hover:border-teal-500/40 dark:hover:border-teal-500/30",
      glowColor: "rgba(20, 184, 166, 0.15)",
      iconBg: "bg-teal-500/10 dark:bg-teal-500/10"
    },
    {
      icon: <Quote className="w-6 h-6 text-fuchsia-500 dark:text-fuchsia-400" />,
      title: "Instant BibTeX & Citation Builder",
      description: "Export high-integrity reference scripts in standard academic styles: APA 7th, MLA 9th, Chicago, Harvard, and native BibTeX formats in single-click exports.",
      badge: "1-Click",
      colorClass: "hover:border-fuchsia-500/40 dark:hover:border-fuchsia-500/30",
      glowColor: "rgba(217, 70, 239, 0.15)",
      iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/10"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Real-Time Comprehension Analytics",
      description: "Track document indexing depth, key terms logged, and review cycles completed. Visualized on highly readable timeline graphs to streamline research velocity.",
      badge: "Analytics",
      colorClass: "hover:border-blue-500/40 dark:hover:border-blue-500/30",
      glowColor: "rgba(59, 130, 246, 0.15)",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/10"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section className="py-24 relative overflow-hidden" id="landing_features_section">
      {/* Background glass glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header content with dynamic premium titles */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-violet-500/10 text-xs font-black tracking-wider uppercase text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />
            Cutting-Edge Academic Engine
          </div>
          <h3 className="font-display font-black text-3xl sm:text-4.5xl text-slate-950 dark:text-white tracking-tight leading-tight">
            Comprehensive Workspace for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600">
              Modern Deep-Level Scholars
            </span>
          </h3>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Ditch fragmented highlighters, lost notes, and disconnected files. Experience an elite research hub crafted with iOS-style translucent glass and powerful cognitive accelerators.
          </p>
        </div>

        {/* Bento Grid scaled up */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="features_grid">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                boxShadow: `0 24px 50px -15px ${feature.glowColor}`,
                borderColor: 'rgba(255, 255, 255, 0.4)'
              }}
              onClick={onFeatureClick}
              className={`group relative p-8 bg-white/25 dark:bg-[#070a14]/25 border border-white/20 dark:border-slate-800/80 rounded-3xl backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer ${feature.colorClass}`}
              id={`feature_card_${idx}`}
            >
              {/* Glass subtle gradient sheen inner overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-2xl border border-white/30 dark:border-slate-700/40 ${feature.iconBg} flex items-center justify-center shadow-inner`}>
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-mono font-black tracking-wider uppercase px-3 py-1 rounded-full bg-white/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300 border border-white/40 dark:border-slate-800/60 shadow-sm">
                      {feature.badge}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white leading-snug">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100/40 dark:border-slate-800/40 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors z-10">
                <span>Explore functionality</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
