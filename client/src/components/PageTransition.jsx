import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants, quickTransition } from '../utils/motion';

const PageTransition = ({ children, className = 'page' }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
      exit={reduceMotion ? undefined : 'exit'}
      variants={reduceMotion ? undefined : pageVariants}
      transition={quickTransition}
    >
      {children}
    </motion.section>
  );
};

export default PageTransition;
