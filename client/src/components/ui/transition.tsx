"use client";

import { motion } from "framer-motion";

interface ITransitionProps {
  children: React.ReactNode;
  className?: string;
}

const Transition = ({ children, className }: ITransitionProps) => {
  return (
    <motion.div
      className={className}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
};

export default Transition;
