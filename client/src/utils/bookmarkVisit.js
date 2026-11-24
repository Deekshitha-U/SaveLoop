import toast from 'react-hot-toast';
import { useBookmarkStore } from '../store/bookmarkStore';

// Opening an ORIGINAL resource means "visited" in SaveLoop.
// The external link is opened by the browser's <a target="_blank"> immediately;
// this function only updates the authenticated user's saved bookmark.
const inFlight = new Map();

export function recordBookmarkVisit(bookmark, onCompleted) {
  const id = bookmark?._id || bookmark?.id;

  // Never change archived/already-completed bookmarks automatically.
  if (!id || bookmark?.status !== 'pending') return;

  let request = inFlight.get(id);
  const firstClick = !request;

  if (!request) {
    // The existing PATCH /api/bookmarks/:id endpoint persists this in MongoDB.
    // It also updates the shared Zustand store used by My Library/Dashboard.
    request = useBookmarkStore.getState()
      .update(id, { status: 'completed' })
      .finally(() => inFlight.delete(id));
    inFlight.set(id, request);
  }

  void request
    .then((updated) => {
      onCompleted?.(updated);
      if (firstClick) toast.success('Moved to Completed');
    })
    .catch(() => {
      if (firstClick) {
        toast.error('Link opened, but the status could not be updated. Please try again.');
      }
    });
}
