import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/axios';
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
    <main className="app-bg grid min-h-screen place-items-center px-4 dark:text-white">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-8">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use seeded admin credentials or your own account.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link className="font-bold text-teal-500" to="/signup">Create account</Link></p>
      </form>
    </main>
  );
};

export default Login;
