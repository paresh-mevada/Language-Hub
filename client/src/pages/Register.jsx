import { AlertCircle, ArrowRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/common/PasswordInput.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import useAuthStore from '../context/authStore.js';

const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Portuguese'];

function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [form, setForm] = useState({
    name: '',
    email: '',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    level: 'Beginner',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { confirmPassword, ...registration } = form;
    const result = await register(registration);
    if (result.success) navigate('/dashboard', { replace: true });
    else setError(result.message);
  }

  const inputClass = 'glass-input h-11 w-full rounded-xl px-3.5 text-xs font-medium focus:ring-2 focus:ring-teal-500/20';

  return (
    <AuthLayout
      title="Create your account"
      description="Set up your learning profile in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-bold text-teal-400 hover:text-teal-300 transition" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs font-semibold text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            placeholder="Your name"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="register-email">
            Email address
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            required
            className={inputClass}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="nativeLanguage">
              Native Language
            </label>
            <select id="nativeLanguage" name="nativeLanguage" value={form.nativeLanguage} onChange={updateField} className={inputClass}>
              {languages.map((language) => (
                <option key={language} value={language} className="bg-slate-900 text-slate-200">
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="learningLanguage">
              Target Language
            </label>
            <select id="learningLanguage" name="learningLanguage" value={form.learningLanguage} onChange={updateField} className={inputClass}>
              {languages.map((language) => (
                <option key={language} value={language} className="bg-slate-900 text-slate-200">
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="level">
            Current Level
          </label>
          <select id="level" name="level" value={form.level} onChange={updateField} className={inputClass}>
            {levels.map((level) => (
              <option key={level} value={level} className="bg-slate-900 text-slate-200">
                {level}
              </option>
            ))}
          </select>
        </div>

        <PasswordInput id="register-password" name="password" label="Password" autoComplete="new-password" value={form.password} onChange={updateField} placeholder="At least 8 characters" />
        <PasswordInput id="confirmPassword" label="Confirm password" autoComplete="new-password" value={form.confirmPassword} onChange={updateField} placeholder="Repeat your password" />

        <button
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-4 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin text-slate-950" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
