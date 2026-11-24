import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from './Button';
export default function ConfirmDialog({ open, title = 'Are you sure?', message, onCancel, onConfirm, loading }) {
  return <AnimatePresence>{open && <div className="modal-root" role="presentation">
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
    <motion.div className="modal-card" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}>
      <button className="icon-btn modal-close" onClick={onCancel} aria-label="Close"><X size={18}/></button>
      <span className="modal-warn"><AlertTriangle size={24}/></span><h2>{title}</h2><p>{message}</p>
      <div className="modal-actions"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button variant="danger" loading={loading} onClick={onConfirm}>Confirm</Button></div>
    </motion.div>
  </div>}</AnimatePresence>;
}
