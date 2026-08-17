import { BookOpen, BotMessageSquare, Languages, PencilLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const actions = [
  { label: 'AI Voice & Text Tutor', path: '/tutor', icon: BotMessageSquare, color: 'border-teal-500/30 bg-teal-500/10 text-teal-300' },
  { label: 'Vocabulary Builder', path: '/vocabulary', icon: Languages, color: 'border-sky-500/30 bg-sky-500/10 text-sky-300' },
  { label: 'Interactive Lessons', path: '/lessons', icon: BookOpen, color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { label: 'Grammar Assistant', path: '/grammar', icon: PencilLine, color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold text-slate-100 tracking-tight">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(({ label, path, icon: Icon, color }) => (
          <motion.button
            key={path}
            type="button"
            whileHover={{ y: -4 }}
            onClick={() => navigate(path)}
            className="glass-card glass-card-hover flex min-h-24 items-center gap-4 rounded-2xl p-4 text-left shadow-xl"
          >
            <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${color}`}>
              <Icon className="size-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">{label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
