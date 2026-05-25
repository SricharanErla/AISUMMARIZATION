import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-[2rem] p-8 shadow-glow">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-white/60">Sign in to access your workspace.</p>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 font-medium text-white disabled:opacity-70">
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </div>
        <p className="mt-5 text-sm text-white/60">
          No account? <Link to="/register" className="text-cyan-300">Create one</Link>
        </p>
      </form>
    </div>
  );
};
