import { motion } from 'motion/react';
export default function PageHeader({ eyebrow, title, description, action }) {
  return <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="page-header">
    <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
    {action && <div className="header-action">{action}</div>}
  </motion.header>;
}
