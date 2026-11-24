import { motion } from 'motion/react';
export default function Button({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled = false, type = 'button', ...props }) {
  return <motion.button type={type} whileHover={!disabled ? { y: -2 } : undefined} whileTap={!disabled ? { scale: 0.98 } : undefined}
    className={`btn btn-${variant} btn-${size} ${className}`} disabled={disabled || loading} {...props}>
    {loading ? <span className="spinner small" aria-label="Working" /> : children}
  </motion.button>;
}
