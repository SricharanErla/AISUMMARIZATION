import { motion } from 'framer-motion';

export const StatCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel rounded-3xl p-5 border border-white/10 shadow-glow"
    >
      <p className="text-sm text-white/55">{label}</p>
      <h3 className="mt-2 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-sm text-white/65">{detail}</p>
    </motion.div>
  );
};
