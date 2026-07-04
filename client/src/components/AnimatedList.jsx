import { motion, useReducedMotion } from 'framer-motion';
import { listVariants } from '../utils/motion';

const AnimatedList = ({ children, className = '', as = 'div' }) => {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
      variants={reduceMotion ? undefined : listVariants}
    >
      {children}
    </Component>
  );
};

export default AnimatedList;
