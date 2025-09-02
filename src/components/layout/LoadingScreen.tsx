// src/components/layout/LoadingScreen.tsx
import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0, 1, 0], y: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-2xl font-bold text-cyan-400"
      >
        Blending...
      </motion.h1>
    </motion.div>
  );
};
