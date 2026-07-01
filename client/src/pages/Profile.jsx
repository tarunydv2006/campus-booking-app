import { Mail, Shield, University } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <section className="page">
      <div className="glass max-w-3xl rounded-lg p-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-black text-white dark:bg-white dark:text-slate-950">
          {user.name.charAt(0)}
        </div>
        <h2 className="text-3xl font-black">{user.name}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white/60 p-4 dark:bg-white/5"><Mail className="mb-3 h-5 w-5 text-teal-500" /><p className="font-bold">{user.email}</p></div>
          <div className="rounded-lg bg-white/60 p-4 capitalize dark:bg-white/5"><Shield className="mb-3 h-5 w-5 text-teal-500" /><p className="font-bold">{user.role}</p></div>
          <div className="rounded-lg bg-white/60 p-4 dark:bg-white/5"><University className="mb-3 h-5 w-5 text-teal-500" /><p className="font-bold">{user.department}</p></div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
