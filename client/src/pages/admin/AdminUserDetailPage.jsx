import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck, UsersRound, CalendarDays, BookMarked } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminService } from '../../services/adminService';
import { prettyDateTime } from '../../utils/dateUtils';
import { useAuthStore } from '../../store/authStore';
export default function AdminUserDetailPage() {
  const { id } = useParams(); const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); const [confirm, setConfirm] = useState(false);
  const me = useAuthStore((s) => s.user);
  useEffect(() => { adminService.user(id).then(setUser).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, [id]);
  if (loading) return <Loader/>; if (!user) return <p>User not found.</p>;
  const toggleStatus = async () => { try { const updated = await adminService.update(id, { status: user.status === 'active' ? 'disabled' : 'active' }); setUser((u) => ({ ...u, ...updated })); toast.success('Account status updated'); } catch (err) { toast.error(err.message); } finally { setConfirm(false); } };
  return <><Link to="/admin/users" className="text-link"><ArrowLeft size={17}/> Back to users</Link><PageHeader eyebrow="ACCOUNT DETAILS" title={user.name} description="Administration details without accessing private saved content."/>
    <div className="panel admin-user-card"><div className="profile-avatar">{user.name?.charAt(0)}</div><div><h2>{user.name}</h2><p>{user.email}</p><span className="pill-accent">{user.role} · {user.status}</span></div><Button variant={user.status === 'active' ? 'danger' : 'outline'} disabled={me?.firebaseUid === user.firebaseUid && user.status === 'active'} onClick={() => setConfirm(true)}>{user.status === 'active' ? 'Disable account' : 'Reactivate account'}</Button></div>
    <div className="admin-info-grid"><div className="panel"><UsersRound/><span>Role</span><strong>{user.role}</strong></div><div className="panel"><BookMarked/><span>Saved items (count only)</span><strong>{user.bookmarkCount || 0}</strong></div><div className="panel"><CalendarDays/><span>Account created</span><strong>{prettyDateTime(user.createdAt)}</strong></div><div className="panel"><ShieldCheck/><span>Last seen</span><strong>{prettyDateTime(user.lastSeenAt)}</strong></div></div>
    <ConfirmDialog open={confirm} title="Change account status?" message="Disabling an account blocks protected backend access, including access using previously issued Firebase ID tokens." onCancel={() => setConfirm(false)} onConfirm={toggleStatus}/>
  </>;
}
