import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import PlatformIcon from '../common/PlatformIcon';
import { prettyDate } from '../../utils/dateUtils';
import { platformName, isSafeExternalUrl } from '../../utils/platformUtils';
import { categoryArtwork } from '../../utils/categoryArtwork';
import { recordBookmarkVisit } from '../../utils/bookmarkVisit';

export default function BookmarkCard({ bookmark, onDelete, onStatusChange, compact = false }) {
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState(bookmark.status);

  // Reflect refreshed data, manual edits, and updates made elsewhere in SaveLoop.
  useEffect(() => setStatus(bookmark.status), [bookmark._id, bookmark.status]);

  const openOriginal = () => {
    recordBookmarkVisit({ ...bookmark, status }, (updated) => {
      setStatus(updated.status);
      onStatusChange?.(updated);
    });
    // Do not prevent the default click: the original URL opens in a new tab.
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bookmark-card ${compact ? 'bookmark-compact' : ''}`}
    >
      {/* Viewing SaveLoop's details alone does NOT mark the bookmark completed. */}
      <Link
        to={`/app/bookmarks/${bookmark._id}`}
        className="bookmark-art category-artwork"
        aria-label={`View ${bookmark.title}`}
      >
        <img src={categoryArtwork(bookmark.categoryName)} alt="" loading="lazy" />
        <span className="art-platform">
          <PlatformIcon platform={bookmark.platform} size={14} />
          {platformName(bookmark.platform)}
        </span>
        <span className={`status-pill status-${status}`}>{status}</span>
      </Link>

      <div className="bookmark-body">
        <Link className="bookmark-title" to={`/app/bookmarks/${bookmark._id}`}>
          {bookmark.title}
        </Link>
        <div className="bookmark-category">{bookmark.categoryName || 'Uncategorised'}</div>
        <div className="tag-row">
          {(bookmark.tags || []).slice(0, 3).map((tag) => (
            <span className="tag" key={tag}>#{tag}</span>
          ))}
        </div>
        <div className="bookmark-footer">
          <span><CalendarDays size={13} /> {prettyDate(bookmark.savedAt)}</span>
          <div className="bookmark-actions">
            {isSafeExternalUrl(bookmark.url) && (
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Open original (moves Pending to Completed)"
                aria-label={`Open original ${bookmark.title}`}
                onClick={openOriginal}
              >
                <ArrowUpRight size={16} />
              </a>
            )}
            <div className="menu-wrap">
              <button
                className="icon-btn"
                aria-label="Bookmark options"
                aria-expanded={menu}
                onClick={() => setMenu((current) => !current)}
              >
                <MoreHorizontal size={17} />
              </button>
              {menu && (
                <div className="mini-menu">
                  <Link to={`/app/bookmarks/${bookmark._id}/edit`} onClick={() => setMenu(false)}>
                    <Pencil size={14} /> Edit
                  </Link>
                  <button onClick={() => { setMenu(false); onDelete?.(bookmark); }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
