import { motion } from 'framer-motion';

function StatCard({ label, value, detail, icon: Icon, color }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="glass-card glass-card-hover relative overflow-hidden rounded-2xl p-5 shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-white tracking-tight">{value}</p>
          <p className="text-[11px] text-slate-400">{detail}</p>
        </div>
        <div className={`grid size-12 shrink-0 place-items-center rounded-xl border border-slate-700/50 shadow-md ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </motion.article>
  );
}

export default StatCard;
