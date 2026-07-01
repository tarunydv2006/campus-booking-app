import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      setMessage('Email verified successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(getApiErrorMessage(err, 'OTP verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setMessage('');
    try {
      const data = await resendOtp(email);
      setMessage(data.message);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not resend OTP'));
    }
  };

  return (
    <main className="app-bg grid min-h-screen place-items-center px-4 dark:text-white">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-lg p-8">
        <h1 className="text-3xl font-black">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter the 6-digit OTP sent to your email.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-300">{message}</p>}
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            className="input text-center text-lg font-black tracking-[0.3em]"
            placeholder="000000"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          <button type="button" onClick={resend} className="btn-secondary w-full" disabled={!email}>Resend OTP</button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">Already verified? <Link className="font-bold text-teal-500" to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default VerifyOtp;
