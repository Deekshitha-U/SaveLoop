import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
export default function AdminSettingsPage() {
  const { user, logout } = useAuthStore(); const navigate = useNavigate();
  return <><PageHeader eyebrow="ADMIN CONFIGURATION" title={<>Admin <span className="accent">Settings</span></>} description="Secure access and identity information for platform administrators."/>
    <div className="settings-grid"><section className="panel settings-card"><h2><UserRound size={21}/> Current administrator</h2><p><strong>{user?.name}</strong> · {user?.email}</p><p>Your admin role is assigned only by a trusted server-side operation.</p></section>
    <section className="panel settings-card"><h2><ShieldCheck size={21}/> Access controls</h2><p>Each admin request verifies the Firebase ID token and MongoDB admin role. Private user bookmark contents remain inaccessible through admin APIs.</p></section>
    <section className="panel settings-card"><h2><LockKeyhole size={21}/> Password recovery</h2><p>Use Firebase to reset your login password if needed.</p><Link to="/forgot-password" className="btn btn-outline">Reset password</Link></section>
    <section className="panel settings-card"><h2><LogOut size={21}/> Session</h2><p>End your admin session on this device.</p><Button onClick={async () => { try { await logout(); navigate('/login'); } catch (e) { toast.error(e.message); } }}><LogOut size={18}/> Log out</Button></section></div>
  </>;
}
