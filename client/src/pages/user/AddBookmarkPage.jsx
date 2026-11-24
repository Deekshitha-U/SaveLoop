import PageHeader from '../../components/common/PageHeader';
import BookmarkForm from '../../components/bookmarks/BookmarkForm';
export default function AddBookmarkPage() { return <><PageHeader eyebrow="CAPTURE AN IDEA" title={<>Add <span className="accent">Bookmark</span></>} description="Save a link, organise it your way, and easily find it later."/><BookmarkForm/></>; }
