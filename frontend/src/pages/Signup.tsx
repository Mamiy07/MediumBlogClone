// SignupPage.tsx
import   { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, LoaderCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// --- TYPES ---------------------------------------------------------------
type Errors = {
  name?: string;
  email?: string;
  password?: string;
  root?: string;
};

// --- MAIN COMPONENT ------------------------------------------------------
export default function SignupPage() {
  // field state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // UX state
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // --- helpers -----------------------------------------------------------
  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const navigate = useNavigate();
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const res = await fetch('https://mediumblogclone-1.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend error – could be single message or object
        setErrors({ root: data.message || 'Signup failed' });
        return;
      }

      setSuccessMsg('Account created! You can log in now.');
      // reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      setErrors({ root: 'Network error – please try again' });
    } finally {
      setLoading(false);
    }
  };

  // --- JSX ---------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8">
          Create your account
        </h1>

        {/* backend toast */}
        {errors.root && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{errors.root}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              placeholder="Ada Lovelace"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              placeholder="ada@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-3 pr-12 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((x) => !x)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400 dark:focus:ring-offset-slate-900"
          >
            {loading && <LoaderCircle className="animate-spin h-4 w-4" />}
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <span onClick={() => navigate('/signin')} className="font-semibold text-black hover:underline">
            Log in
          </span>
        </p>

      </div>
    </div>
  );
}