import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid2X2, List, Plus, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import BookmarkCard from '../../components/bookmarks/BookmarkCard';
import BookmarkFilters from '../../components/bookmarks/BookmarkFilters';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useUIStore } from '../../store/uiStore';
const defaultFilters = { q: '', platform: 'all', categoryId: '', status: 'all', priority: 'all', sort: 'newest', from: '', to: '' };
export default function BookmarksPage() {
  const { bookmarks, fetch, remove } = useBookmarkStore(); const { categories, fetch: getCategories } = useCategoryStore();
  const { view, setView } = useUIStore(); const [filters, setFilters] = useState(defaultFilters); const [toDelete, setToDelete] = useState(null); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch().catch((e) => toast.error(e.message)); getCategories().catch((e) => toast.error(e.message)); }, [fetch, getCategories]);
  const filtered = useMemo(() => bookmarks.filter((b) => {
    const term = filters.q.toLowerCase(); const allText = [b.title,b.notes,b.categoryName,b.platform,...(b.tags || [])].join(' ').toLowerCase();
    return (!term || allText.includes(term)) && (filters.platform === 'all' || b.platform === filters.platform) && (filters.status === 'all' || b.status === filters.status) && (filters.priority === 'all' || (b.priority || 'normal') === filters.priority) &&
      (!filters.categoryId || b.categoryId === filters.categoryId) && (!filters.from || b.savedAt?.slice(0,10) >= filters.from) && (!filters.to || b.savedAt?.slice(0,10) <= filters.to);
  }).sort((a,b) => filters.sort === 'title' ? a.title.localeCompare(b.title) : filters.sort === 'oldest' ? new Date(a.savedAt)-new Date(b.savedAt) : new Date(b.savedAt)-new Date(a.savedAt)), [bookmarks,filters]);
  const confirm = async () => { setBusy(true); try { await remove(toDelete._id); toast.success('Bookmark deleted'); setToDelete(null); } catch (e) { toast.error(e.message); } finally { setBusy(false); } };
  return <><PageHeader eyebrow="YOUR SAVED UNIVERSE" title={<>My <span className="accent">Library</span></>} description={`${bookmarks.length} saved items, organized and ready whenever you need them.`} action={<Link className="btn btn-primary" to="/app/bookmarks/new"><Plus size={17}/> Save a link</Link>}/>
    <BookmarkFilters filters={filters} setFilters={setFilters} categories={categories}/>
    <div className="panel-head listing-head"><h2><BookmarkCheck size={20}/> Saved Content ({filtered.length})</h2><div className="view-switch"><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 size={18}/></button><button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view"><List size={18}/></button></div></div>
    {filtered.length ? <div className={`bookmarks-grid ${view === 'list' ? 'list-view' : ''}`}>{filtered.map((b) => <BookmarkCard key={b._id} bookmark={b} onDelete={setToDelete} compact={view === 'list'}/>)}</div> : <EmptyState title="No bookmarks found" description="Change your filters or add a new bookmark." action="Save a link" href="/app/bookmarks/new"/>}
    <ConfirmDialog open={Boolean(toDelete)} title="Delete this bookmark?" message="The original website will not be affected, but your saved reference and related reminders will be removed." loading={busy} onCancel={() => setToDelete(null)} onConfirm={confirm}/>
  </>;
}
