export const quickTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1]
};

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 }
};

export const listVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02
    }
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

export const cardHover = {
  y: -3,
  transition: quickTransition
};
