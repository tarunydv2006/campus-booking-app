import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, CalendarCheck, Clock3, LibraryBig, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/StatCard';
import { itemVariants, quickTransition } from '../utils/motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    api.get('/dashboard/admin-stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <PageTransition><div className="floating-card skeleton-shimmer h-80" /></PageTransition>;

  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin analytics</p>
          <h2 className="display-title mt-2">Campus operations overview</h2>
        </div>
        <span className="chip">Approval intelligence</span>
      </div>
      <AnimatedList className="grid gap-4 md:grid-cols-5">
        <StatCard icon={LibraryBig} label="Resources" value={stats.totalResources} />
        <StatCard icon={Clock3} label="Pending" value={stats.pendingBookings} accent="text-amber-500" />
        <StatCard icon={CalendarCheck} label="Approved" value={stats.approvedBookings} accent="text-emerald-500" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejectedBookings} accent="text-rose-500" />
        <StatCard icon={BarChart3} label="Trend days" value={stats.trend.length} accent="text-indigo-500" />
      </AnimatedList>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="floating-card p-6">
          <p className="eyebrow">Demand</p>
          <h3 className="mt-2 text-xl font-black">Most booked resources</h3>
          <AnimatedList className="mt-5 space-y-3">
            {stats.mostBookedResources.length ? stats.mostBookedResources.map((item) => (
              <motion.div key={item._id} variants={reduceMotion ? undefined : itemVariants} transition={quickTransition} className="data-row flex items-center justify-between">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                <span className="text-2xl font-black">{item.count}</span>
              </motion.div>
            )) : <EmptyState title="No booking data yet" />}
          </AnimatedList>
        </div>
        <div className="floating-card p-6">
          <p className="eyebrow">Velocity</p>
          <h3 className="mt-2 text-xl font-black">Usage trend</h3>
          <div className="mt-5 flex h-64 items-end gap-2">
            {stats.trend.length ? stats.trend.map((item) => (
              <div key={item._id} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-lg bg-teal-500"
                  initial={reduceMotion ? false : { scaleY: 0.75, opacity: 0.7 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={quickTransition}
                  style={{ height: `${Math.max(18, item.count * 28)}px`, transformOrigin: 'bottom' }}
                />
                <span className="text-[10px] text-slate-500">{item._id.slice(5)}</span>
              </div>
            )) : <EmptyState title="No trend yet" />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
