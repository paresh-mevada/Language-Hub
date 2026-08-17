import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Grid,
  Headphones,
  Lock,
  Mic,
  PenTool,
  Play,
  Route,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { getApiError } from '../services/api.js';
import { getLessons } from '../services/lessonService.js';

const CATEGORIES = [
  { name: 'All', icon: Compass },
  { name: 'Grammar', icon: BookOpen },
  { name: 'Vocabulary', icon: FileText },
  { name: 'Speaking', icon: Mic },
  { name: 'Listening', icon: Headphones },
  { name: 'Reading', icon: BookOpen },
  { name: 'Writing', icon: PenTool },
];

const LEVELS = [
  'All',
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Lessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // View Mode: 'roadmap' (Busuu style path) | 'grid'
  const [viewMode, setViewMode] = useState('roadmap');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  useEffect(() => {
    fetchLessons();
  }, [categoryFilter, levelFilter]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (levelFilter !== 'All') params.level = levelFilter;

      const data = await getLessons(params);
      setLessons(data || []);
    } catch (err) {
      setError(getApiError(err, 'Failed to load lessons.'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase().trim();
    return (
      lesson.title.toLowerCase().includes(term) ||
      lesson.description.toLowerCase().includes(term)
    );
  });

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const completionRate = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  const getCategoryIcon = (categoryName) => {
    const item = CATEGORIES.find((c) => c.name === categoryName);
    const IconComponent = item ? item.icon : BookOpen;
    return <IconComponent className="size-3.5" />;
  };

  const getLevelBadgeStyle = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Elementary':
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30';
      case 'Intermediate':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30';
      case 'Upper Intermediate':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
      case 'Advanced':
        return 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 p-6 sm:p-8 shadow-2xl text-white">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-teal-500/20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
              <Sparkles className="size-3.5" />
              <span>Busuu & Duolingo Learning Engine</span>
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Guided Interactive Skill Roadmap
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-teal-100/90">
              Follow step-by-step nodes to achieve real fluency across Grammar, Vocabulary, Speaking, and Listening.
            </p>
          </div>

          {/* View Switcher & Progress Ring */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-2xl bg-slate-950/80 p-1 border border-slate-800 shadow-lg">
              <button
                onClick={() => setViewMode('roadmap')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                  viewMode === 'roadmap'
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Route className="size-4" />
                <span>Busuu Roadmap</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="size-4" />
                <span>Grid View</span>
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-teal-500/30 bg-slate-950/70 px-4 py-2.5">
              <Trophy className="size-5 text-amber-400" />
              <div>
                <p className="text-xs font-black text-white">{completedCount} / {lessons.length} Passed</p>
                <p className="text-[10px] text-teal-300 font-semibold">{completionRate}% Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-4 shadow-xl backdrop-blur-md space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons by title, topic, or keyword..."
              className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="glass-input rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-200 cursor-pointer"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          {CATEGORIES.map(({ name, icon: IconComponent }) => {
            const isActive = categoryFilter === name;
            return (
              <button
                key={name}
                onClick={() => setCategoryFilter(name)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'text-slate-950 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 shadow-md shadow-teal-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <IconComponent className="size-3.5" />
                  <span>{name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* VIEW MODE 1: BUSUU ROADMAP TRAIL */}
      {viewMode === 'roadmap' ? (
        isLoading ? (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto size-10 animate-spin text-teal-400" />
            <p className="mt-3 text-xs text-slate-400 font-semibold">Building Busuu roadmap trail...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="glass-card rounded-3xl py-20 text-center space-y-3">
            <BookOpen className="mx-auto size-12 text-slate-400 dark:text-slate-600 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">No roadmap nodes available</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your category filter to reveal study nodes.
            </p>
          </div>
        ) : (
          <div className="relative py-8 max-w-4xl mx-auto space-y-12">
            <div className="roadmap-line" />

            {filteredLessons.map((lesson, idx) => {
              const isEven = idx % 2 === 0;
              const isUnlocked = idx === 0 || lesson.isCompleted || filteredLessons[idx - 1]?.isCompleted;

              return (
                <div key={lesson._id} className="relative z-10 flex items-center justify-center">
                  <div className={`flex w-full items-center gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="w-full max-w-md glass-card rounded-3xl p-6 shadow-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-300">
                          {getCategoryIcon(lesson.category)}
                          <span>Unit #{idx + 1} • {lesson.category}</span>
                        </span>
                        <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${getLevelBadgeStyle(lesson.level)}`}>
                          {lesson.level}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{lesson.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">{lesson.description}</p>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="size-3.5" />
                          <span>{lesson.duration || '15 mins'}</span>
                        </span>

                        <button
                          onClick={() => navigate(`/lessons/${lesson._id}`)}
                          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition ${
                            lesson.isCompleted
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                              : 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110'
                          }`}
                        >
                          <Play className="size-3.5 fill-current" />
                          <span>{lesson.isCompleted ? 'Review Node' : 'Start Node'}</span>
                        </button>
                      </div>
                    </motion.div>

                    <div className="relative shrink-0">
                      <div
                        className={`grid size-16 place-items-center rounded-full font-black text-lg transition-transform duration-300 ${
                          lesson.isCompleted
                            ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                            : isUnlocked
                            ? 'bg-gradient-to-tr from-teal-400 to-sky-400 text-slate-950 roadmap-node-active animate-pulse'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {lesson.isCompleted ? (
                          <CheckCircle2 className="size-8 text-slate-950" />
                        ) : isUnlocked ? (
                          <span>{idx + 1}</span>
                        ) : (
                          <Lock className="size-6 text-slate-500" />
                        )}
                      </div>
                    </div>

                    <div className="w-full max-w-md hidden md:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* VIEW MODE 2: CLASSIC GRID */
        isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-6 space-y-4 shimmer"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredLessons.map((lesson) => (
              <motion.div
                key={lesson._id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="glass-card glass-card-hover group relative flex flex-col justify-between rounded-2xl p-6 shadow-xl overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                      {getCategoryIcon(lesson.category)}
                      <span>{lesson.category}</span>
                    </span>

                    <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${getLevelBadgeStyle(lesson.level)}`}>
                      {lesson.level}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {lesson.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                    {lesson.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{lesson.duration || '15 mins'}</span>
                    </span>

                    {lesson.isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="size-3.5" />
                        <span>Completed (100%)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">
                        {lesson.exercises?.length || 3} exercises
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/lessons/${lesson._id}`)}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md ${
                      lesson.isCompleted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 border border-slate-300 dark:border-slate-700'
                        : 'bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 text-slate-950 shadow-teal-500/20 hover:brightness-110'
                    }`}
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>{lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
}
