import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signup({ ...form, role: 'student' });
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Signup failed'));
    }
  };

  return (
    <main className="app-bg grid min-h-screen place-items-center px-4 dark:text-white">
      <form onSubmit={submit} className="glass w-full max-w-lg rounded-lg p-8">
        <h1 className="text-3xl font-black">Create your account</h1>
        {error && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending OTP...' : 'Sign up'}</button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-teal-500" to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default Signup;
