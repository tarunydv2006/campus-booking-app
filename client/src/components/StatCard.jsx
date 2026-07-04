import { motion, useReducedMotion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const StatCard = ({ icon: Icon, label, value, accent = 'text-teal-500' }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : itemVariants}
      whileHover={reduceMotion ? undefined : cardHover}
      transition={quickTransition}
      className="floating-card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight"><AnimatedCounter value={value} /></p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-white to-slate-100 p-3 shadow-sm dark:from-white/15 dark:to-white/5">
          <Icon className={`h-6 w-6 ${accent}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
