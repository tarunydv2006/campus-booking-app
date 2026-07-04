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
      className="glass rounded-lg p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black"><AnimatedCounter value={value} /></p>
        </div>
        <div className="rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
          <Icon className={`h-6 w-6 ${accent}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
