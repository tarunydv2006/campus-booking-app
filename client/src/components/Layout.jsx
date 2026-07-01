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
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
        : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10'
    }`;

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#080b13]/85">
      <div className="mb-8 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-black">CampusBook</NavLink>
        <button className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => <NavLink key={item.to} to={item.to} className={linkClass}><item.icon className="h-4 w-4" /> {item.label}</NavLink>)}
        {user?.role === 'admin' && <div className="my-4 border-t border-slate-200 dark:border-white/10" />}
        {user?.role === 'admin' && adminItems.map((item) => <NavLink key={item.to} to={item.to} className={linkClass}><item.icon className="h-4 w-4" /> {item.label}</NavLink>)}
      </nav>
      <div className="mt-auto rounded-lg bg-slate-950/5 p-3 dark:bg-white/5">
        <p className="font-bold">{user?.name}</p>
        <p className="text-xs capitalize text-slate-500">{user?.role} • {user?.department}</p>
        <button onClick={signOut} className="mt-3 flex items-center gap-2 text-sm font-semibold text-rose-500">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="app-bg min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        {open && <div className="fixed inset-0 z-50 lg:hidden">{sidebar}</div>}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#070a12]/70">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">Smart Campus</p>
                <h1 className="text-lg font-black">Resource Booking</h1>
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
