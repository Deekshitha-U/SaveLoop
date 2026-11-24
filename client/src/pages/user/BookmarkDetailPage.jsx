import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Pencil, Trash2, Clock, Tag, Folder, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { bookmarkService } from '../../services/bookmarkService';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { prettyDateTime } from '../../utils/dateUtils';
import { isSafeExternalUrl } from '../../utils/platformUtils';
import { categoryArtwork } from '../../utils/categoryArtwork';
import { recordBookmarkVisit } from '../../utils/bookmarkVisit';

export default function BookmarkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const remove = useBookmarkStore((state) => state.remove);
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    bookmarkService.get(id)
      .then((result) => { if (alive) setBookmark(result); })
      .catch((error) => { if (alive) toast.error(error.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const openOriginal = () => {
    recordBookmarkVisit(bookmark, (updated) => {
      // Keep the details page in sync, without requiring a full refresh.
      setBookmark((current) => current?._id === updated._id ? updated : current);
    });
  };

  if (loading) return <Loader />;
  if (!bookmark) {
    return (
      <div className="panel not-found-panel">
        <h2>Bookmark not found</h2>
        <Link to="/app/bookmarks">Return to library</Link>
      </div>
    );
  }

  return (
    <>
      <div className="back-row">
        <Link to="/app/bookmarks" className="text-link">
          <ArrowLeft size={17} /> Back to library
        </Link>
      </div>
      <PageHeader
        eyebrow="SAVED RESOURCE"
        title={bookmark.title}
        description={`Saved from ${bookmark.platform}`}
        action={
          <div className="detail-actions">
            <Link className="btn btn-outline" to={`/app/bookmarks/${id}/edit`}>
              <Pencil size={16} /> Edit
            </Link>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        }
      />
      <div className="details-grid">
        <article className="panel detail-main">
          <div className="detail-art category-detail-art">
            <img src={categoryArtwork(bookmark.categoryName)} alt="" />
          </div>
          <h2>{bookmark.title}</h2>
          <p>{bookmark.notes || 'You have not added any notes to this bookmark yet.'}</p>
          {isSafeExternalUrl(bookmark.url) && (
            <a
              className="btn btn-primary"
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openOriginal}
            >
              Open original resource <ExternalLink size={18} />
            </a>
          )}
          <p className="detail-disclaimer">
            Opening the original link moves a Pending bookmark to Completed. Some posts may be private,
            deleted, or require a platform login; SaveLoop does not host their contents.
          </p>
        </article>
        <aside className="panel detail-meta">
          <h3>Bookmark details</h3>
          <div><Folder size={17} /><span>Category</span><strong>{bookmark.categoryName}</strong></div>
          <div>
            <Clock size={17} /><span>Status</span>
            <strong className={`status-text-${bookmark.status}`}>{bookmark.status}</strong>
          </div>
          <div><Clock size={17} /><span>Priority</span><strong>{bookmark.priority || 'normal'}</strong></div>
          <div><CalendarDays size={17} /><span>Saved at</span><strong>{prettyDateTime(bookmark.savedAt)}</strong></div>
          <div>
            <Tag size={17} /><span>Tags</span>
            <strong>{bookmark.tags?.length ? bookmark.tags.map((tag) => `#${tag}`).join(' ') : 'No tags'}</strong>
          </div>
          <h4>Original URL</h4>
          <code className="url-code">{bookmark.url}</code>
        </aside>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete saved bookmark?"
        message="This removes the reference from your library."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            await remove(id);
            toast.success('Deleted');
            navigate('/app/bookmarks');
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />
    </>
  );
}
