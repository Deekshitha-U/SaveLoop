import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, Play, BookmarkPlus, Layers3, Search, Bell,
  MessageCircle, Youtube, Instagram, Linkedin, ExternalLink,
  ShieldCheck, FolderHeart, Pin, Heart,
} from 'lucide-react';
import Brand from '../../components/common/Brand';

const features = [
  {
    icon: FolderHeart,
    title: 'Everything in one place',
    body: 'A personal space for the videos, posts and articles you want to remember.',
  },
  {
    icon: Layers3,
    title: 'Organised your way',
    body: 'Build collections by topic, personalise tags and keep your favourite finds tidy.',
  },
  {
    icon: Search,
    title: 'Find what matters',
    body: 'Search your own saved links by topic, platform, date or a natural-language question.',
  },
  {
    icon: Bell,
    title: 'Gentle reminders',
    body: 'Give those useful links a second chance with reminders that fit your plans.',
  },
  {
    icon: MessageCircle,
    title: 'Ask SaveLoop',
    body: 'Ask for something you saved and jump back to its original link.',
  },
];

const sample = [
  { title: 'React Hooks Explained', tag: 'Technology', art: 'orange', icon: Youtube },
  { title: 'Design Inspiration Board', tag: 'Design', art: 'peach', icon: Pin },
  { title: 'Better Work Habits', tag: 'Lifestyle', art: 'violet', icon: Linkedin },
];

const platforms = [
  { icon: Youtube, name: 'YouTube', caption: 'Videos and tutorials', key: 'youtube' },
  { icon: Instagram, name: 'Instagram', caption: 'Posts and reels', key: 'instagram' },
  { icon: Pin, name: 'Pinterest', caption: 'Ideas and inspiration', key: 'pinterest' },
  { icon: Linkedin, name: 'LinkedIn', caption: 'Career and learning', key: 'linkedin' },
  { icon: ExternalLink, name: 'Websites', caption: 'Articles and blogs', key: 'websites' },
];

export default function LandingPage() {
  return (
    <main>
      <section className="hero-section container">
        <div className="hero-glow" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="pill-accent"><Heart size={15} /> Made for curious minds</span>
          <h1>Save, organize, and <em>rediscover</em> everything you love.</h1>
          <p>Useful things are easy to save and hard to find again. SaveLoop gives every great link its own place, ready whenever you need it.</p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn btn-primary btn-lg">Start saving free <ArrowRight size={19} /></Link>
            <a href="#how-it-works" className="btn btn-outline btn-lg"><Play size={18} /> How it works</a>
          </div>
          <div className="hero-points">
            <span><ShieldCheck size={16} /> Private by design</span>
            <span><BookmarkPlus size={16} /> Save public web links</span>
            <span><Search size={16} /> Find them again</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-product"
          initial={{ opacity: 0, x: 30, rotateY: -7 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="product-bar"><Brand /><span className="product-window-dots">● ● ●</span></div>
          <div className="product-content">
            <aside className="product-side">
              <span className="active">⌂ &nbsp; My Library</span>
              <span>⌕ &nbsp; Search</span>
              <span>✧ &nbsp; SaveLoop assistant</span>
              <span>▢ &nbsp; Categories</span>
            </aside>
            <div className="product-main">
              <div className="product-head"><strong>My Saves</strong><span>+ Save new</span></div>
              <div className="product-search">⌕ &nbsp; Search your saved world...</div>
              <div className="product-cards">
                {sample.map(({ title, tag, art, icon: Icon }) => (
                  <div className="product-mini-card" key={title}>
                    <span className={`preview-art ${art}`} />
                    <strong>{title}</strong>
                    <small><Icon size={12} /> {tag}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <motion.div className="hero-ai-chip" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Search size={20} />
            <div><strong>Find it again</strong><small>"My saved React tutorials"</small></div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="features-section container">
        <div className="section-heading"><span className="eyebrow">WHY SAVELOOP?</span><h2>More than just bookmarks.</h2><p>Make all that saved inspiration genuinely useful.</p></div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, body }, index) => (
            <motion.article
              className="feature-card"
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -3 }}
            >
              <span className="feature-icon"><Icon size={27} /></span>
              <h3>{title}</h3><p>{body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="platform-section container polished-platform-section" id="platforms">
        <div>
          <span className="eyebrow">ALL YOUR LINKS, ONE HOME</span>
          <h2>Save from wherever you explore.</h2>
          <p>Paste a link and save its reference in your personal library. No downloads or social-account access required.</p>
        </div>
        <div className="platform-tiles polished-platform-tiles" aria-label="Supported link platforms">
          {platforms.map(({ icon: Icon, name, caption, key }, index) => (
            <motion.div
              className={`platform-tile platform-${key}`}
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3, scale: 1.015 }}
            >
              <i className="platform-bubble" aria-hidden="true" />
              <span className="platform-icon-ring"><Icon size={27} /></span>
              <strong>{name}</strong>
              <small>{caption}</small>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="steps-section container" id="how-it-works">
        <div className="section-heading"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>Three steps to rediscovery.</h2></div>
        <div className="steps-grid">
          <div><b>01</b><h3>Save a link</h3><p>Paste the original web URL and add notes or hashtags.</p></div>
          <div><b>02</b><h3>Organise it</h3><p>Accept a category suggestion or choose one yourself.</p></div>
          <div><b>03</b><h3>Find it later</h3><p>Search or ask SaveLoop for the exact saved resource.</p></div>
        </div>
      </section>

      <section className="final-cta container">
        <div><h2>Never lose a great find again.</h2><p>Start building a searchable library of everything worth remembering.</p></div>
        <Link to="/signup" className="btn btn-primary btn-lg">Get started <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
