import { Mail, Shield, University } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <PageTransition>
      <div className="floating-card max-w-3xl p-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-800 to-cyan-600 text-3xl font-black text-white dark:from-white dark:via-cyan-200 dark:to-indigo-200 dark:text-slate-950">
          {user.name.charAt(0)}
        </div>
        <p className="eyebrow">Profile</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">{user.name}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-4"><Mail className="mb-3 h-5 w-5 text-cyan-500" /><p className="break-words font-bold">{user.email}</p></div>
          <div className="surface-card p-4 capitalize"><Shield className="mb-3 h-5 w-5 text-indigo-500" /><p className="font-bold">{user.role}</p></div>
          <div className="surface-card p-4"><University className="mb-3 h-5 w-5 text-rose-500" /><p className="font-bold">{user.department}</p></div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
