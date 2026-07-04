import { CalendarCheck, Clock3, ListChecks, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    api.get('/dashboard/user-stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{user.role} dashboard</p>
          <h2 className="display-title mt-2">Hello, {user.name}</h2>
        </div>
        <span className="chip">Live workspace</span>
      </div>
      <AnimatedList className="grid gap-4 md:grid-cols-4">
        <StatCard icon={ListChecks} label="Total bookings" value={stats.total} />
        <StatCard icon={Clock3} label="Pending" value={stats.pending} accent="text-amber-500" />
        <StatCard icon={CalendarCheck} label="Approved" value={stats.approved} accent="text-emerald-500" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} accent="text-rose-500" />
      </AnimatedList>
      <div className="floating-card mt-6 overflow-hidden p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Fast action</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight">Book a campus resource</h3>
            <p className="muted-copy mt-2 max-w-2xl">Browse active resources, select a time slot, and submit an approval request.</p>
          </div>
        <Link to="/resources" className="btn-primary mt-5">Open resource catalog</Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
