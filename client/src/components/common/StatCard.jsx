import { motion } from 'motion/react';
export default function StatCard({ icon: Icon, label, value, detail, className = '' }) {
  return <motion.article whileHover={{ y: -5 }} className={`stat-card ${className}`}>
    <span className="stat-icon"><Icon size={21} /></span>
    <span className="stat-label">{label}</span>
    <strong>{value}</strong>
    <span className="stat-detail">{detail || 'Your SaveLoop overview'}</span>
    <span className="stat-glow" />
  </motion.article>;
}
