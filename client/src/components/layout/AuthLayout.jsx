import { BookOpenCheck, Languages, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AuthLayout({ children, title, description, footer }) {
  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)]">
      {/* Ambient background glow accents */}
      <div className="bg-ambient-glow top-0 right-1/4 h-[500px] w-[500px] bg-teal-500/15" />
      <div className="bg-ambient-glow bottom-0 left-1/3 h-[600px] w-[600px] bg-indigo-600/15" />

      {/* Left Brand Feature Section */}
      <section className="relative hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between border-r border-slate-800/80 backdrop-blur-xl">
        <Link to="/" className="inline-flex w-fit items-center gap-3 group">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <BookOpenCheck className="size-5" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-teal-200 bg-clip-text text-transparent">
            Language Hub
          </span>
        </Link>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300">
            <Sparkles className="size-4" />
            <span>AI-POWERED FLUENCY PLATFORM</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
            Make every language practice session count.
          </h1>

          <p className="text-sm leading-relaxed text-slate-400">
            Master real-world speaking, grammar, and vocabulary through guided interactive exercises, smart AI tutor conversations, and actionable progress insights.
          </p>
        </div>

        <p className="text-xs font-semibold text-slate-500">© Language Hub Platform</p>
      </section>

      {/* Right Form Card Container */}
      <section className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-6"
        >
          <div className="flex items-center gap-2.5 lg:hidden mb-2">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md">
              <BookOpenCheck className="size-5" />
            </div>
            <span className="text-lg font-extrabold text-white">Language Hub</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          </div>

          <div>{children}</div>

          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {footer}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default AuthLayout;
