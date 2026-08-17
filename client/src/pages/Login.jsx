import { AlertCircle, ArrowRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/common/PasswordInput.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import useAuthStore from '../context/authStore.js';

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const result = await login(form);
    if (result.success) navigate('/dashboard', { replace: true });
    else setError(result.message);
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your language practice."
      footer={
        <>
          New to Language Hub?{' '}
          <Link className="font-bold text-teal-400 hover:text-teal-300 transition" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs font-semibold text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            required
            className="glass-input h-11 w-full rounded-xl px-3.5 text-xs font-medium focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={updateField} />

        <div className="flex items-center justify-between gap-4 text-xs font-medium">
          <label className="flex cursor-pointer items-center gap-2 text-slate-300" htmlFor="rememberMe">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={form.rememberMe}
              onChange={updateField}
              className="size-4 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500"
            />
            <span>Remember me</span>
          </label>

          <a className="font-bold text-teal-400 hover:text-teal-300 transition" href="mailto:support@languagehub.local?subject=Password%20reset">
            Forgot password?
          </a>
        </div>

        <button
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-4 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin text-slate-950" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
