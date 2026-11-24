import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bookmark, Hourglass, CircleCheck, Archive, ArrowRight, Sparkles, CalendarDays, Layers3 } from 'lucide-react';
import { motion } from 'motion/react';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import BookmarkCard from '../../components/bookmarks/BookmarkCard';
import EmptyState from '../../components/common/EmptyState';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useAuthStore } from '../../store/authStore';
import { useAIStore } from '../../store/aiStore';
export default function DashboardPage() {
  const { bookmarks, fetch } = useBookmarkStore(); const user = useAuthStore((s) => s.user); const setOpen = useAIStore((s) => s.setOpen);
  useEffect(() => { fetch().catch((e) => toast.error(e.message)); }, [fetch]);
  const stats = useMemo(() => ({ total: bookmarks.length, pending: bookmarks.filter((b) => b.status === 'pending').length, completed: bookmarks.filter((b) => b.status === 'completed').length, archived: bookmarks.filter((b) => b.status === 'archived').length }), [bookmarks]);
  const topCats = Object.entries(bookmarks.reduce((result, b) => ({ ...result, [b.categoryName]: (result[b.categoryName] || 0) + 1 }), {})).sort((a,b) => b[1]-a[1]).slice(0,5);
  return <><PageHeader eyebrow="YOUR PERSONAL SPACE" title={<>Good to see you, <span className="accent">{user?.name?.split(' ')[0] || 'friend'}</span> 👋</>} description="Your favorite ideas are right where you left them." action={<Link to="/app/bookmarks/new" className="btn btn-primary">+ Add bookmark</Link>}/>
    <section className="stats-grid"><StatCard icon={Bookmark} label="Total saved" value={stats.total} detail="Across every platform"/><StatCard icon={Hourglass} label="Pending" value={stats.pending} detail="Ready to rediscover"/><StatCard icon={CircleCheck} label="Completed" value={stats.completed} detail="Resources revisited"/><StatCard icon={Archive} label="Archived" value={stats.archived} detail="Saved for another day"/></section>
    <div className="dashboard-grid"><section className="panel dashboard-activity"><div className="panel-head"><div><h2>My Save Activity</h2><p>Build a library that grows with you</p></div><span className="section-symbol"><Layers3 size={20}/></span></div>
      <div className="activity-graph"><svg viewBox="0 0 700 190" preserveAspectRatio="none" role="img" aria-label="Decorative activity curve"><defs><linearGradient id="slope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#df642e" stopOpacity=".42"/><stop offset="1" stopColor="#df642e" stopOpacity="0"/></linearGradient></defs><g stroke="#ffffff" strokeOpacity=".07">{[25,65,105,145].map((y) => <line key={y} x1="0" y1={y} x2="700" y2={y}/>)}</g><path d="M0 150 C70 95 90 125 170 105 S270 145 340 80 S440 110 510 60 S620 78 700 22 L700 190 L0 190 Z" fill="url(#slope)"/><path d="M0 150 C70 95 90 125 170 105 S270 145 340 80 S440 110 510 60 S620 78 700 22" stroke="#fa8139" strokeWidth="3" fill="none" strokeLinecap="round"/></svg></div><div className="graph-foot"><span>Start your journey</span><span>{stats.total} saves currently organised</span></div>
    </section><section className="panel dashboard-categories"><div className="panel-head"><h2>Categories</h2><Link to="/app/categories">Manage <ArrowRight size={15}/></Link></div>{topCats.length ? <div className="category-meters">{topCats.map(([name,count]) => <div key={name}><div><span>{name}</span><strong>{count}</strong></div><span className="meter"><i style={{ width: `${count / (stats.total || 1) * 100}%` }}/></span></div>)}</div> : <p className="muted-text">Your category insights will appear here.</p>}</section></div>
    <div className="panel-head section-margin"><div><h2>Recently saved</h2><p>Pick up where you left off.</p></div><Link to="/app/bookmarks" className="text-link">View library <ArrowRight size={17}/></Link></div>
    {bookmarks.length ? <div className="bookmarks-grid">{bookmarks.slice(0,4).map((b) => <BookmarkCard key={b._id} bookmark={b}/>)}</div> : <EmptyState title="Start your first collection" description="Paste your first useful web link to begin." action="Add bookmark" href="/app/bookmarks/new"/>}
    <motion.button className="rediscover-banner" whileHover={{ scale: 1.008 }} onClick={() => setOpen(true)}><span><Sparkles size={25}/><strong>Rediscover something amazing today</strong><small>Ask SaveLoop AI to find useful links you've forgotten.</small></span><ArrowRight size={22}/></motion.button>
  </>;
}
