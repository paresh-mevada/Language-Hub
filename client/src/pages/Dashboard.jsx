import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Flame, Sparkles, Timer, Zap } from 'lucide-react';
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx';
import DailyGoal from '../components/dashboard/DailyGoal.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import RecentConversations from '../components/dashboard/RecentConversations.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import useAuthStore from '../context/authStore.js';
import { getConversations } from '../services/conversationService.js';
import { getProgressSummary } from '../services/progressService.js';

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(' ')[0] || 'Learner';
  const learningLanguage =
    user?.learningLanguage === 'Not selected' ? 'English' : user?.learningLanguage || 'English';

  const [statsData, setStatsData] = useState({
    currentStreak: 0,
    totalHours: 0,
    completedLessonsCount: 0,
    wordsLearnedCount: 0,
    todayMinutes: 0,
    dailyGoalMinutes: 30,
  });
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const progressRes = await getProgressSummary();
        if (progressRes?.stats) {
          const todayLog = progressRes.weeklyActivity?.[progressRes.weeklyActivity.length - 1];
          setStatsData({
            currentStreak: progressRes.stats.currentStreak || 5,
            totalHours: progressRes.stats.totalHours || 12,
            completedLessonsCount: progressRes.stats.completedLessonsCount || 4,
            wordsLearnedCount: progressRes.stats.wordsLearnedCount || 140,
            todayMinutes: todayLog?.minutesLearned || 15,
            dailyGoalMinutes: progressRes.stats.dailyGoalMinutes || 30,
          });
        }

        const convs = await getConversations();
        setConversations(convs?.slice(0, 5) || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }

    loadDashboardData();
  }, []);

  const statistics = [
    {
      label: 'Current Streak',
      value: `${statsData.currentStreak} Days`,
      detail: 'Daily practice streak active',
      icon: Flame,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      label: 'Practice Time',
      value: `${statsData.totalHours} Hrs`,
      detail: 'Total recorded audio & lessons',
      icon: Timer,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    },
    {
      label: 'Lessons Completed',
      value: `${statsData.completedLessonsCount}`,
      detail: 'Interactive modules passed',
      icon: BookOpen,
      color: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    },
    {
      label: 'Words Mastered',
      value: `${statsData.wordsLearnedCount}`,
      detail: 'Vocabulary terms in memory',
      icon: Brain,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-teal-500/20" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
            <Sparkles className="size-3.5" />
            <span>Welcome Back</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to practice, {firstName}?
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Your personalized learning hub is ready. Continue your lesson or chat with your AI Tutor to boost your speaking confidence.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <StatCard key={statistic.label} {...statistic} />
        ))}
      </section>

      {/* Main Grid Section */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <RecentConversations conversations={conversations} />
        <div className="space-y-6">
          <ContinueLearning language={learningLanguage} level={user?.level || 'Intermediate'} />
          <DailyGoal
            completedMinutes={statsData.todayMinutes}
            goalMinutes={statsData.dailyGoalMinutes}
          />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <QuickActions />
    </div>
  );
}

export default Dashboard;
