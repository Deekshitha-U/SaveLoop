import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search as SearchIcon, Sparkles, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import BookmarkCard from '../../components/bookmarks/BookmarkCard';
import EmptyState from '../../components/common/EmptyState';
import { searchService } from '../../services/searchService';
import { useAIStore } from '../../store/aiStore';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const setOpen = useAIStore((state) => state.setOpen);

  const run = async (event) => {
    event?.preventDefault?.();
    setBusy(true);
    try {
      setResults(await searchService.search({ q: query, status, platform }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    searchService.search().then(setResults).catch((error) => toast.error(error.message));
  }, []);

  const handleStatusChange = (updated) => {
    setResults((previous) => {
      // If filtering Pending, the visited item leaves that list immediately.
      if (status === 'pending' && updated.status !== 'pending') {
        return previous.filter((item) => item._id !== updated._id);
      }
      return previous.map((item) => item._id === updated._id ? updated : item);
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="FIND WHAT MATTERS"
        title={<>Smart <span className="accent">Search</span></>}
        description="Search your saved library using precise filters or talk to SaveLoop AI."
      />
      <form className="panel search-page-panel" onSubmit={run}>
        <div className="search-big">
          <SearchIcon size={23} />
          <input
            placeholder="Search React, recipes, interview resources..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="btn btn-primary" disabled={busy}>
            Search <ArrowRight size={17} />
          </button>
        </div>
        <div className="search-secondary">
          <label>
            Platform
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              <option value="all">All platforms</option>
              {['youtube', 'instagram', 'pinterest', 'linkedin', 'facebook', 'website', 'github'].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <button type="button" className="ai-search-button" onClick={() => setOpen(true)}>
            <Sparkles size={17} /> Ask AI in natural language
          </button>
        </div>
      </form>
      <div className="panel-head section-margin"><h2>{results.length} matching bookmarks</h2></div>
      {results.length ? (
        <div className="bookmarks-grid">
          {results.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark._id}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No matching bookmarks" description="Try a broader keyword or ask the AI assistant." />
      )}
    </>
  );
}
