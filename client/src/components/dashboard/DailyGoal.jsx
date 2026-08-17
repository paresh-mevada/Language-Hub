import { Flame } from 'lucide-react';

function DailyGoal({ completedMinutes = 0, goalMinutes = 30 }) {
  const progress = Math.min(Math.round((completedMinutes / goalMinutes) * 100), 100);

  return (
    <section className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="size-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Daily Target</h2>
            <p className="text-xs text-slate-400">{completedMinutes} of {goalMinutes} mins practiced</p>
          </div>
        </div>
        <span className="text-base font-black text-teal-300">{progress}%</span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-slate-700/50"
        aria-label={`${progress}% of daily goal completed`}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-700 shadow-md shadow-teal-500/30"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

export default DailyGoal;
