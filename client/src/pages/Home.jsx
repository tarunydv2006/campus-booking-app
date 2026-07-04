import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarCheck, ChartNoAxesCombined, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { quickTransition } from '../utils/motion';

const Home = () => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <main className="app-bg mesh-bg min-h-screen overflow-hidden px-4 py-5 dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="icon-tile h-10 w-10 text-xs font-black">CB</span>
          <span>
            <span className="block text-lg font-black tracking-tight">CampusBook</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Smart Campus OS</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="btn-secondary">{dark ? 'Light' : 'Dark'}</button>
          <Link to={user ? '/dashboard' : '/login'} className="btn-primary">{user ? 'Dashboard' : 'Login'}</Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={quickTransition}>
          <div className="chip mb-5"><Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-500" /> Campus operations, redesigned</div>
          <h1 className="max-w-4xl text-balance text-5xl font-black tracking-[-0.03em] text-[#101114] dark:text-white sm:text-7xl">
            Resource booking that feels effortless.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Reserve labs, seminar halls, classrooms, projectors, and equipment with a premium dashboard built for fast approvals and confident planning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? '/resources' : '/signup'} className="btn-primary">
              Start booking <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary">Explore demo</Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ['Conflict-safe', ShieldCheck, 'Availability checks before every request.'],
              ['Approval-ready', CalendarCheck, 'Admin queues stay clean and fast.'],
              ['Insightful', ChartNoAxesCombined, 'Live stats for users and admins.']
            ].map(([label, Icon, text]) => (
              <div key={label} className="surface-card p-4">
                <Icon className="mb-3 h-5 w-5 text-cyan-500" />
                <p className="font-black">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={quickTransition} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-300/25 via-indigo-300/20 to-rose-300/20 blur-2xl" />
          <div className="floating-card relative overflow-hidden p-3">
            <img
              src="/images/campus-hero-dashboard.png"
              alt="Premium campus operations dashboard illustration"
              className="aspect-[1.15] w-full rounded-lg object-cover"
            />
          </div>
          <div className="floating-card absolute -bottom-6 left-6 hidden w-56 p-4 sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-500">Today</p>
            <p className="mt-1 text-3xl font-black">24</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">active booking requests</p>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;
