"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type AnimateInProps = HTMLMotionProps<"div">;

export function AnimateIn({ children, ...props }: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
