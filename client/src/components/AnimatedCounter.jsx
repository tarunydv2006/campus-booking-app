import { animate, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ value }) => {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(value);

  useMotionValueEvent(rounded, 'change', setDisplay);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    const controls = animate(count, Number(value) || 0, { duration: 0.28, ease: 'easeOut' });

    return () => {
      controls.stop();
    };
  }, [count, reduceMotion, value]);

  return display;
};

export default AnimatedCounter;
