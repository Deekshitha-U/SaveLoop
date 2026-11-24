import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Mail, UserRound, Check, BookMarked } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { prettyDate } from '../../utils/dateUtils';
export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore(); const { bookmarks, fetch } = useBookmarkStore();
  const [name, setName] = useState(user?.name || ''); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch().catch((e) => toast.error(e.message)); }, [fetch]);
  const save = async (e) => { e.preventDefault(); setBusy(true); try { await updateProfile({ name }); toast.success('Profile updated'); } catch (err) { toast.error(err.message); } finally { setBusy(false); } };
  return <><PageHeader eyebrow="YOUR ACCOUNT" title={<>My <span className="accent">Profile</span></>} description="A little more about your SaveLoop journey."/>
    <div className="profile-grid"><div className="panel profile-summary"><div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</div><h2>{user?.name}</h2><p>{user?.email}</p><span className="pill-accent">{user?.role || 'user'} account</span><div className="profile-facts"><div><BookMarked/><span>Total bookmarks</span><strong>{bookmarks.length}</strong></div><div><UserRound/><span>Member since</span><strong>{prettyDate(user?.createdAt)}</strong></div></div></div>
    <form className="panel profile-edit" onSubmit={save}><h2>Personal information</h2><p>Keep your profile information up to date.</p><Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required/><Input label="Email (managed by Firebase)" value={user?.email || ''} disabled/><Button type="submit" loading={busy}><Check size={17}/> Save changes</Button></form></div>
  </>;
}
