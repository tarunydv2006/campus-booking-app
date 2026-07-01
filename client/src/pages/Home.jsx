import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <main className="app-bg min-h-screen overflow-hidden px-4 py-5 dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-xl font-black">CampusBook</Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="btn-secondary">{dark ? 'Light' : 'Dark'}</button>
          <Link to={user ? '/dashboard' : '/login'} className="btn-primary">{user ? 'Dashboard' : 'Login'}</Link>
        </div>
      </nav>
      <section className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-7xl">
            Smart Campus Resource Booking System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Reserve labs, seminar halls, classrooms, projectors, and equipment with role-based approvals, live availability checks, and premium dashboards.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? '/resources' : '/signup'} className="btn-primary">
              Start booking <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary">Explore demo</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Conflict-safe', ShieldCheck],
              ['Fast approvals', CalendarCheck],
              ['SaaS polish', Sparkles]
            ].map(([label, Icon]) => (
              <div key={label} className="glass rounded-lg p-4">
                <Icon className="mb-3 h-6 w-6 text-teal-500" />
                <p className="font-bold">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[480px]">
          <div className="absolute inset-8 rotate-3 rounded-[2rem] bg-slate-950 shadow-2xl dark:bg-white/10" />
          <div className="glass absolute inset-0 rounded-[2rem] p-6">
            <div className="grid h-full grid-rows-[1fr_auto] gap-5">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-200 via-white to-indigo-200 p-6 dark:from-teal-900 dark:via-slate-900 dark:to-indigo-950">
                <div className="absolute bottom-10 left-12 h-36 w-60 -skew-y-6 rounded-xl bg-white shadow-2xl dark:bg-slate-800" />
                <div className="absolute bottom-24 left-24 h-28 w-44 -skew-y-6 rounded-xl bg-teal-500 shadow-xl" />
                <div className="absolute bottom-32 right-16 h-48 w-36 -skew-y-6 rounded-xl bg-slate-950 shadow-2xl dark:bg-white" />
                <div className="absolute bottom-16 right-28 h-16 w-16 rounded-full bg-rose-400 shadow-xl" />
                <div className="absolute left-8 top-8 rounded-xl bg-white/80 p-4 shadow-xl dark:bg-slate-950/80">
                  <p className="text-xs font-bold uppercase text-teal-500">Live availability</p>
                  <p className="mt-1 text-2xl font-black">94%</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Labs', 'Halls', 'Equipment'].map((item) => (
                  <div key={item} className="rounded-lg bg-white/70 p-4 text-center font-bold dark:bg-white/10">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;
