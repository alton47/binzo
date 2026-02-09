"use client";
import { motion } from "framer-motion";

export function Toast({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow-xl"
    >
      {text}
    </motion.div>
  );
}
