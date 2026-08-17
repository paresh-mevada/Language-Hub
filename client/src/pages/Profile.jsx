import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Globe,
  Globe2,
  GraduationCap,
  LoaderCircle,
  Lock,
  Save,
  User as UserIcon,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import { getApiError } from '../services/api.js';
import { updateUserProfile } from '../services/userService.js';

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

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
];

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    nativeLanguage: user?.nativeLanguage || 'English',
    learningLanguage: user?.learningLanguage || 'Spanish',
    level: user?.level || 'Beginner',
    avatar: user?.avatar || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const updatedUser = await updateUserProfile(formData);
      updateUser(updatedUser);

      setSuccessMsg('Your profile has been updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(getApiError(err, 'Failed to update profile.'));
    } finally {
      setIsSaving(false);
    }
  };

  const memberSinceDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Summary Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-teal-500/20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Circle */}
            <div className="relative">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="size-20 rounded-full border-2 border-teal-400 object-cover shadow-xl"
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-full border-2 border-teal-500/40 bg-gradient-to-tr from-teal-500 to-emerald-400 text-2xl font-black text-slate-950 shadow-xl">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'LH'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300">
                  <Globe2 className="size-3.5" />
                  <span>Learning {user?.learningLanguage || 'English'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                  <Award className="size-3.5 text-amber-400" />
                  <span>{user?.level || 'Beginner'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Calendar className="size-4 text-teal-400" />
            <span>Member since {memberSinceDate}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-3">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="glass-input w-full cursor-not-allowed rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-500 opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Choose Avatar Preset
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preset ${idx + 1}`}
                onClick={() => setFormData({ ...formData, avatar: url })}
                className={`size-12 cursor-pointer rounded-full object-cover transition ring-2 ${
                  formData.avatar === url
                    ? 'ring-teal-400 scale-110 shadow-lg shadow-teal-500/20'
                    : 'ring-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
          <div>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="Or paste custom image URL..."
              className="glass-input w-full max-w-md rounded-xl px-3.5 py-2 text-xs font-medium"
            />
          </div>
        </div>

        <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-3 pt-4">
          Learning Preferences
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Native Language */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Native Language
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <select
                value={formData.nativeLanguage}
                onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                className="glass-input w-full rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Learning Language */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Learning Language
            </label>
            <div className="relative">
              <Globe2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-teal-400" />
              <select
                value={formData.learningLanguage}
                onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                className="glass-input w-full rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Skill Level
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-amber-400" />
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="glass-input w-full rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-slate-900 text-slate-200">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end border-t border-slate-800/80 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="size-4 animate-spin text-slate-950" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="size-4 text-slate-950" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
