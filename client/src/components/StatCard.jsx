import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, accent = 'text-teal-500' }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-lg p-5 transition hover:-translate-y-1"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-black">{value}</p>
      </div>
      <div className="rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
        <Icon className={`h-6 w-6 ${accent}`} />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
