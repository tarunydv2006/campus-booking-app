import { CalendarCheck, Clock3, ListChecks, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    api.get('/dashboard/user-stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <section className="page">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-500">{user.role} dashboard</p>
        <h2 className="mt-2 text-3xl font-black">Hello, {user.name}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={ListChecks} label="Total bookings" value={stats.total} />
        <StatCard icon={Clock3} label="Pending" value={stats.pending} accent="text-amber-500" />
        <StatCard icon={CalendarCheck} label="Approved" value={stats.approved} accent="text-emerald-500" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} accent="text-rose-500" />
      </div>
      <div className="glass mt-6 rounded-lg p-6">
        <h3 className="text-xl font-black">Book a campus resource</h3>
        <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">Browse active resources, select a time slot, and submit an approval request.</p>
        <Link to="/resources" className="btn-primary mt-5">Open resource catalog</Link>
      </div>
    </section>
  );
};

export default Dashboard;
