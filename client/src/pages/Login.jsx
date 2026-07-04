import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/axios';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <PageTransition className="app-bg grid min-h-screen place-items-center px-4 dark:text-white">
      <form onSubmit={submit} className="floating-card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="icon-tile h-10 w-10 text-xs font-black">CB</span>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="text-3xl font-black tracking-tight">Sign in</h1>
          </div>
        </div>
        <p className="muted-copy">Use seeded admin credentials or your own account.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link className="font-bold text-teal-500" to="/signup">Create account</Link></p>
      </form>
    </PageTransition>
  );
};

export default Login;
