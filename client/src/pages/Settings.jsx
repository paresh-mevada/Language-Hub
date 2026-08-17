import { useEffect, useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Globe2,
  GraduationCap,
  Laptop,
  Moon,
  RotateCcw,
  Save,
  Sun,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveStoredSettings,
} from '../utils/settingsStore.js';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Chinese (Mandarin)',
  'Korean',
  'Portuguese',
  'Russian',
  'Arabic',
  'Hindi',
];

const LEVELS = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const GOAL_OPTIONS = [
  { value: 15, label: '15 mins/day', desc: 'Casual practice' },
  { value: 30, label: '30 mins/day', desc: 'Regular learning' },
  { value: 45, label: '45 mins/day', desc: 'Intensive study' },
  { value: 60, label: '60 mins/day', desc: 'Mastery mode' },
];

export default function Settings() {
  const { user } = useAuthStore();

  const [settings, setSettings] = useState(getStoredSettings());
  const [learningLanguage, setLearningLanguage] = useState(
    user?.learningLanguage && user.learningLanguage !== 'Not selected'
      ? user.learningLanguage
      : 'Spanish',
  );
  const [skillLevel, setSkillLevel] = useState(user?.level || 'Beginner');

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Apply theme on component mount
    saveStoredSettings(settings);
  }, []);

  const handleThemeChange = (selectedTheme) => {
    const updated = { ...settings, theme: selectedTheme };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleGoalChange = (goalMins) => {
    const updated = { ...settings, dailyGoal: goalMins };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleNotificationToggle = (key) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset all settings to default preferences?')) return;
    const res = saveStoredSettings(DEFAULT_SETTINGS);
    setSettings(res);
    setSuccessMsg('Settings reset to default!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Application Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Customize display theme, learning goals, and notification preferences.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-400 ring-1 ring-slate-800 hover:text-slate-200"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* SECTION 1: APPEARANCE */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-2 text-teal-400 mb-2">
            <Sun className="size-5" />
            <h2 className="text-base font-bold text-slate-100">Appearance & Theme</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Choose your preferred color theme for Language Hub.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Dark Theme Card */}
            <div
              onClick={() => handleThemeChange('dark')}
              className={`group cursor-pointer rounded-2xl border p-5 transition ${
                settings.theme === 'dark'
                  ? 'border-teal-500 bg-teal-950/20 ring-1 ring-teal-500/40'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className="size-6 text-teal-400" />
                {settings.theme === 'dark' && <Check className="size-5 text-teal-400" />}
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-100">Dark Mode</h3>
              <p className="mt-1 text-xs text-slate-400">Deep slate palette designed for low-light focus.</p>
            </div>

            {/* Light Theme Card */}
            <div
              onClick={() => handleThemeChange('light')}
              className={`group cursor-pointer rounded-2xl border p-5 transition ${
                settings.theme === 'light'
                  ? 'border-teal-500 bg-teal-950/20 ring-1 ring-teal-500/40'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun className="size-6 text-amber-400" />
                {settings.theme === 'light' && <Check className="size-5 text-teal-400" />}
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-100">Light Mode</h3>
              <p className="mt-1 text-xs text-slate-400">Bright, high-contrast crisp theme.</p>
            </div>

            {/* System Theme Card */}
            <div
              onClick={() => handleThemeChange('system')}
              className={`group cursor-pointer rounded-2xl border p-5 transition ${
                settings.theme === 'system'
                  ? 'border-teal-500 bg-teal-950/20 ring-1 ring-teal-500/40'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Laptop className="size-6 text-indigo-400" />
                {settings.theme === 'system' && <Check className="size-5 text-teal-400" />}
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-100">System Theme</h3>
              <p className="mt-1 text-xs text-slate-400">Automatically sync with OS display settings.</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: LEARNING PREFERENCES */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-2 text-teal-400 mb-2">
            <Globe2 className="size-5" />
            <h2 className="text-base font-bold text-slate-100">Learning Preferences & Goals</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Configure target language goals and daily study targets.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            {/* Target Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Learning Language
              </label>
              <select
                value={learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-200 focus:border-teal-500/60 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Proficiency Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-200 focus:border-teal-500/60 focus:outline-none"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily Goal Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-3">
              Daily Practice Target
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GOAL_OPTIONS.map((g) => (
                <div
                  key={g.value}
                  onClick={() => handleGoalChange(g.value)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    settings.dailyGoal === g.value
                      ? 'border-teal-500 bg-teal-950/30 text-teal-300 ring-1 ring-teal-500/40'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Clock className="size-4 text-teal-400" />
                    {settings.dailyGoal === g.value && <Check className="size-4 text-teal-400" />}
                  </div>
                  <p className="mt-2 text-sm font-bold">{g.label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: NOTIFICATIONS */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-2 text-teal-400 mb-2">
            <Bell className="size-5" />
            <h2 className="text-base font-bold text-slate-100">Notification Settings</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Choose which study reminders and alerts you would like to receive.
          </p>

          <div className="space-y-4 divide-y divide-slate-800/60">
            {/* Daily Practice Reminder */}
            <div className="flex items-center justify-between pt-4 first:pt-0">
              <div>
                <p className="text-xs font-bold text-slate-200">Daily Study Reminders</p>
                <p className="text-[11px] text-slate-400">Receive reminders to maintain your daily streak.</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('dailyReminder')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifications.dailyReminder ? 'bg-teal-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications.dailyReminder ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Lesson Progress Reminder */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-slate-200">Lesson Progress Notifications</p>
                <p className="text-[11px] text-slate-400">Get updates on new recommendations and lesson milestones.</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('lessonReminder')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifications.lessonReminder ? 'bg-teal-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications.lessonReminder ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Achievement Notifications */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-slate-200">Achievement & Streak Alerts</p>
                <p className="text-[11px] text-slate-400">Celebrate streak milestones and vocabulary achievements.</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('achievementAlerts')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifications.achievementAlerts ? 'bg-teal-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications.achievementAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-teal-400 hover:to-emerald-400"
          >
            <Save className="size-4 text-slate-950" />
            <span>Save Application Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
