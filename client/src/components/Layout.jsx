import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Boxes,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resources', label: 'Resources', icon: Boxes },
  { to: '/my-bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User }
];

const adminItems = [
  { to: '/admin/resources', label: 'Manage Resources', icon: BookOpen },
  { to: '/admin/bookings', label: 'Manage Bookings', icon: CalendarDays }
];

const Layout = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition duration-200 hover:translate-x-0.5 ${
      isActive
        ? 'bg-[#101114] text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] dark:bg-white dark:text-slate-950'
        : 'text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/70 bg-white/75 p-4 shadow-[20px_0_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#09090d]/90 dark:shadow-[20px_0_60px_rgba(0,0,0,0.35)]">
      <div className="mb-8 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="icon-tile h-9 w-9 text-[11px] font-black">CB</span>
          <span>
            <span className="block text-lg font-black tracking-tight">CampusBook</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Operations OS</span>
          </span>
        </NavLink>
        <button className="btn-secondary px-2.5 lg:hidden" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon className="h-4 w-4" /> {item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && <div className="my-4 border-t border-slate-200 dark:border-white/10" />}
        {user?.role === 'admin' && adminItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon className="h-4 w-4" /> {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-200/70 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-indigo-700 text-sm font-black text-white dark:from-white dark:to-cyan-200 dark:text-slate-950">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-black">{user?.name}</p>
            <p className="truncate text-xs capitalize text-slate-500">{user?.role} / {user?.department}</p>
          </div>
        </div>
        <button onClick={signOut} className="mt-3 flex items-center gap-2 text-sm font-bold text-rose-500 transition hover:translate-x-0.5">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="app-bg mesh-bg min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 bg-slate-950/25 lg:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={reduceMotion ? false : { x: -18, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={reduceMotion ? undefined : { x: -18, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
                className="h-full w-72"
              >
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/70 bg-white/65 backdrop-blur-2xl dark:border-white/10 dark:bg-[#07070a]/70">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button className="btn-secondary px-3 lg:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="eyebrow">Smart Campus</p>
                <h1 className="text-lg font-black tracking-tight">Resource Booking</h1>
              </div>
              <button onClick={toggleTheme} className="btn-secondary px-3">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
