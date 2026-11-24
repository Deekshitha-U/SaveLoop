import { Link, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bookmark, Link2, Layers3, Search, ArrowLeft } from 'lucide-react';
import Brand from '../components/common/Brand';

// Decorative bubbles use CSS only: no animation timers or additional dependencies.
const bubbles = Array.from({ length: 4 }, (_, index) => index);

export default function AuthLayout() {
  return (
    <div className="auth-shell polished-auth-shell">
      <div className="auth-bubble-field" aria-hidden="true">
        {bubbles.map((bubble) => <span key={bubble} className="auth-bubble" />)}
      </div>

      <div className="auth-top container">
        <Brand />
        <Link to="/" className="text-link"><ArrowLeft size={16} /> Back to home</Link>
      </div>

      <div className="auth-main container">
        <motion.div
          className="auth-showcase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="pill-accent"><Bookmark size={15} /> A personal home for your best finds</span>
          <h1>Good ideas deserve a <span className="accent">second look.</span></h1>
          <p>Collect your favourite links, keep them neatly organised and find the right one at the right moment.</p>

          <div className="auth-preview">
            <div className="preview-bar">
              <Brand compact />
              <span>My Library</span>
              <span className="preview-dots">•••</span>
            </div>
            <div className="preview-grid">
              <div className="preview-card"><span className="preview-art orange" /><b>React Hooks Guide</b><small>#react #learning</small></div>
              <div className="preview-card"><span className="preview-art violet" /><b>Design Inspiration</b><small>#design #ideas</small></div>
              <div className="preview-card"><span className="preview-art peach" /><b>Cooking Ideas</b><small>#food #recipe</small></div>
            </div>
          </div>

          <div className="auth-features">
            <span><Link2 /> Save anything useful</span>
            <span><Layers3 /> Keep things organised</span>
            <span><Search /> Find things faster</span>
          </div>
        </motion.div>

        <motion.div
          className="auth-form-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
