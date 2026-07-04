import { motion, useReducedMotion } from 'framer-motion';
import { CalendarPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const ResourceCard = ({ resource }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={reduceMotion ? undefined : itemVariants}
      whileHover={reduceMotion ? undefined : cardHover}
      transition={quickTransition}
      className="glass overflow-hidden rounded-lg"
    >
      <img src={resource.image} alt={resource.title} className="h-48 w-full object-cover" />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-200">
            {resource.category}
          </span>
          {!resource.isActive && <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">Inactive</span>}
        </div>
        <h3 className="text-xl font-black">{resource.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{resource.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-300">
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {resource.capacity}</span>
        </div>
        <Link to={`/resources/${resource._id}`} className="btn-secondary mt-5 w-full">
          <CalendarPlus className="h-4 w-4" /> View and book
        </Link>
      </div>
    </motion.article>
  );
};

export default ResourceCard;
