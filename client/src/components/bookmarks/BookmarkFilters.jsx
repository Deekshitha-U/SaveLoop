import { Search, Filter, SlidersHorizontal } from 'lucide-react';
export default function BookmarkFilters({ filters, setFilters, categories = [] }) {
  const patch = (key, value) => setFilters((old) => ({ ...old, [key]: value }));
  return <div className="filter-panel">
    <label className="search-wrap"><Search size={18}/><input aria-label="Search saved bookmarks" placeholder="Search titles, notes, hashtags..." value={filters.q} onChange={(e) => patch('q', e.target.value)}/></label>
    <div className="filter-grid">
      <label><span>Platform</span><select value={filters.platform} onChange={(e) => patch('platform', e.target.value)}>
        <option value="all">All platforms</option>{['youtube','instagram','pinterest','linkedin','facebook','github','medium','website'].map((p) => <option value={p} key={p}>{p}</option>)}
      </select></label>
      <label><span>Category</span><select value={filters.categoryId} onChange={(e) => patch('categoryId', e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
      <label><span>Status</span><select value={filters.status} onChange={(e) => patch('status', e.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="archived">Archived</option></select></label>
      <label><span>Sort</span><select value={filters.sort} onChange={(e) => patch('sort', e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select></label>
      <label><span>Priority</span><select value={filters.priority} onChange={(e) => patch('priority', e.target.value)}><option value="all">Any priority</option><option value="high">High priority</option><option value="normal">Normal</option><option value="low">Low</option></select></label>
    </div>
    <div className="date-filter"><SlidersHorizontal size={15}/><span>Saved from</span><input type="date" value={filters.from} onChange={(e) => patch('from', e.target.value)}/><span>to</span><input type="date" value={filters.to} onChange={(e) => patch('to', e.target.value)}/><button type="button" onClick={() => setFilters({ q: '', platform: 'all', categoryId: '', status: 'all', priority: 'all', sort: 'newest', from: '', to: '' })}>Clear filters</button></div>
  </div>;
}
