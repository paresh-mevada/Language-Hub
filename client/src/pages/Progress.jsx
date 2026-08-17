import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  LoaderCircle,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import { getApiError } from '../services/api.js';
import { getProgressSummary, logProgress } from '../services/progressService.js';

export default function Progress() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Study logger modal state
  const [logMinutes, setLogMinutes] = useState(15);
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await getProgressSummary();
      setData(res);
    } catch (err) {
      setError(getApiError(err, 'Failed to load progress tracking.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogPractice = async (e) => {
    e.preventDefault();
    if (!logMinutes || logMinutes <= 0) return;

    try {
      setIsLogging(true);
      setLogSuccess('');
      await logProgress({ minutesLearned: Number(logMinutes) });
      setLogSuccess(`Logged ${logMinutes} practice minutes successfully!`);
      await fetchProgress();
      setTimeout(() => setLogSuccess(''), 3000);
    } catch (err) {
      alert(getApiError(err, 'Failed to log activity.'));
    } finally {
      setIsLogging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="size-10 animate-spin text-teal-400" />
          <p className="text-xs font-semibold text-slate-400">Loading progress analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    currentStreak: 5,
    longestStreak: 12,
    totalMinutes: 720,
    totalHours: 12,
    completedLessonsCount: 4,
    wordsLearnedCount: 140,
    conversationsCount: 8,
    dailyGoalMinutes: 30,
  };

  const weeklyActivity = data?.weeklyActivity || [
    { dayName: 'Mon', minutesLearned: 20 },
    { dayName: 'Tue', minutesLearned: 35 },
    { dayName: 'Wed', minutesLearned: 15 },
    { dayName: 'Thu', minutesLearned: 45 },
    { dayName: 'Fri', minutesLearned: 30 },
    { dayName: 'Sat', minutesLearned: 50 },
    { dayName: 'Sun', minutesLearned: 25 },
  ];
  const maxWeeklyMinutes = Math.max(60, ...weeklyActivity.map((w) => w.minutesLearned));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Quick Logger */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-teal-500/20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
              <Sparkles className="size-3.5" />
              <span>Personal Analytics</span>
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Learning Activity & Mastery Progress
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-xl">
              Monitor your daily streak consistency, total hours practiced, module completion, and vocabulary expansion.
            </p>
          </div>

          {/* Quick Study Logger */}
          <form onSubmit={handleLogPractice} className="glass-card rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Log Practice</p>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(e.target.value)}
                  className="glass-input w-20 rounded-xl px-3 py-2 text-xs font-bold text-center text-white"
                />
                <span className="text-xs text-slate-400 font-semibold">mins</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLogging}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition disabled:opacity-50"
            >
              <Plus className="size-4" />
              <span>Log Minutes</span>
            </button>
          </form>
        </div>
      </div>

      {logSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{logSuccess}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 4 Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Streak Card */}
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Current Streak</span>
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="size-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.currentStreak} Days</p>
          <p className="text-xs text-slate-400">Best Streak: <strong className="text-amber-300">{stats.longestStreak || 12} days</strong></p>
        </motion.div>

        {/* Learning Time Card */}
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Practice Time</span>
            <div className="grid size-10 place-items-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Clock className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.totalHours} Hrs</p>
          <p className="text-xs text-slate-400">Total recorded practice</p>
        </motion.div>

        {/* Lessons Completed Card */}
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Lessons Passed</span>
            <div className="grid size-10 place-items-center rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <BookOpen className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.completedLessonsCount}</p>
          <p className="text-xs text-slate-400">Interactive modules finished</p>
        </motion.div>

        {/* Words Mastered Card */}
        <motion.div whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Words Mastered</span>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.wordsLearnedCount}</p>
          <p className="text-xs text-slate-400">Vocabulary terms in memory</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Weekly Bar Chart */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-6 lg:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Weekly Practice Frequency</h2>
              <p className="text-xs text-slate-400">
                Daily practice minutes over the last 7 days (Daily Target: {stats.dailyGoalMinutes} mins)
              </p>
            </div>
            <BarChart3 className="size-5 text-teal-400" />
          </div>

          <div className="pt-6 flex h-60 items-end justify-between gap-3 border-b border-slate-800 pb-4">
            {weeklyActivity.map((day, idx) => {
              const heightPercent = Math.min(100, Math.max(10, (day.minutesLearned / maxWeeklyMinutes) * 100));
              const reachedGoal = day.minutesLearned >= stats.dailyGoalMinutes;

              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 z-10 rounded-xl bg-slate-950 px-3 py-1 text-[11px] font-bold text-teal-300 shadow-xl border border-slate-800 transition">
                    {day.minutesLearned} mins
                  </div>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`w-full max-w-[44px] rounded-t-2xl transition-all duration-300 ${reachedGoal
                        ? 'bg-gradient-to-t from-teal-500 to-emerald-400 shadow-md shadow-teal-500/20'
                        : day.minutesLearned > 0
                          ? 'bg-gradient-to-t from-slate-800 to-teal-500/60'
                          : 'bg-slate-800/40'
                      }`}
                  />

                  <span className="mt-3 text-xs font-bold text-slate-400">{day.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Balance Breakdown */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-6 lg:col-span-4">
          <div>
            <h2 className="text-base font-bold text-white">Skill Mastery Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across practice features</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>AI Tutor Speaking Practice</span>
                <span className="text-teal-400">{stats.conversationsCount || 8} sessions</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full w-3/4" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Interactive Lessons</span>
                <span className="text-emerald-400">{stats.completedLessonsCount || 4} modules</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-2/3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Vocabulary Words</span>
                <span className="text-amber-400">{stats.wordsLearnedCount || 140} terms</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-4/5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
            <div className="flex items-center gap-2 text-teal-400">
              <Trophy className="size-4" />
              <span className="text-xs font-bold text-slate-200">Current Level Status</span>
            </div>
            <p className="text-base font-black text-teal-300">
              {user?.level || 'Intermediate'} Learner
            </p>
            <p className="text-[11px] text-slate-400">
              Target Language: <strong className="text-slate-200">{user?.learningLanguage || 'English'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
