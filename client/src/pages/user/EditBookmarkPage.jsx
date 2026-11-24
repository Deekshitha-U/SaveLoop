import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import BookmarkForm from '../../components/bookmarks/BookmarkForm';
import Loader from '../../components/common/Loader';
import { bookmarkService } from '../../services/bookmarkService';
export default function EditBookmarkPage() {
  const { id } = useParams(); const [bookmark, setBookmark] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { let alive = true; bookmarkService.get(id).then((b) => alive && setBookmark(b)).catch((err) => toast.error(err.message)).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [id]);
  if (loading) return <Loader/>;
  return bookmark ? <><PageHeader eyebrow="MANAGE SAVED CONTENT" title={<>Edit <span className="accent">Bookmark</span></>} description="Update your saved reference and keep your library organised."/><BookmarkForm initial={bookmark}/></> : <div className="panel">This bookmark was not found.</div>;
}
