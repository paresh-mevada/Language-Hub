import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ContinueLearning({ language, level }) {
  const navigate = useNavigate();

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-900/60 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-2xl backdrop-blur-xl"
    >
      <div className="bg-ambient-glow -top-10 -right-10 h-48 w-48 bg-teal-500/20" />

      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] font-bold text-teal-300">
          <Sparkles className="size-3.5" />
          <span>RECOMMENDED SESSION</span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{language}</h2>
          <p className="text-xs font-semibold text-teal-400 mt-0.5">{level} Level</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
          Pick up right where you left off to maintain your learning velocity.
        </p>

        <button
          type="button"
          onClick={() => navigate('/lessons')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
        >
          <Play className="size-4 fill-current" />
          <span>Continue Learning</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </motion.section>
  );
}

export default ContinueLearning;
