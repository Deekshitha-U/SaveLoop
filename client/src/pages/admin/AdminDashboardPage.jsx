import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UsersRound, UserCheck, BookMarked, UserPlus, ArrowRight, ShieldCheck, DatabaseZap } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { adminService } from '../../services/adminService';
import { relativeDate } from '../../utils/dateUtils';
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null); const [users, setUsers] = useState([]);
  useEffect(() => { Promise.all([adminService.stats(), adminService.users()]).then(([s,u]) => { setStats(s); setUsers(u); }).catch((e) => toast.error(e.message)); }, []);
  const metrics = stats || { totalUsers: 0, activeUsers: 0, totalBookmarks: 0, newUsersLast30Days: 0, platformCounts: [] };
  const max = Math.max(1,...(metrics.platformCounts || []).map((x) => x.count));
  return <><PageHeader eyebrow="PLATFORM CONTROL CENTER" title={<>SaveLoop <span className="accent">Admin</span></>} description="Monitor usage, review account statistics and keep your platform running smoothly."/>
    <div className="stats-grid"><StatCard icon={UsersRound} label="Total users" value={metrics.totalUsers.toLocaleString()} detail="Registered accounts"/><StatCard icon={UserCheck} label="Active accounts" value={metrics.activeUsers.toLocaleString()} detail="Currently enabled"/><StatCard icon={BookMarked} label="Total bookmarks" value={metrics.totalBookmarks.toLocaleString()} detail="Aggregate count only"/><StatCard icon={UserPlus} label="New this month" value={metrics.newUsersLast30Days.toLocaleString()} detail="Last 30 days"/></div>
    <div className="dashboard-grid"><section className="panel admin-chart"><div className="panel-head"><div><h2>Platform distribution</h2><p>Aggregate bookmark counts, without private content</p></div><DatabaseZap size={22}/></div><div className="category-meters">{metrics.platformCounts?.length ? metrics.platformCounts.map((p) => <div key={p._id}><div><span>{p._id}</span><strong>{p.count}</strong></div><span className="meter"><i style={{ width: `${p.count/max*100}%` }}/></span></div>) : <p className="muted-text">No usage data yet</p>}</div></section>
      <section className="panel admin-privacy"><ShieldCheck size={34}/><h2>Privacy-first management</h2><p>System admins can manage users, role-controlled endpoints and aggregate counts. Personal bookmark URLs, notes and chat content are never shown in admin screens.</p><Link to="/admin/users" className="btn btn-outline">Manage users <ArrowRight size={17}/></Link></section></div>
    <div className="panel recent-users-panel"><div className="panel-head"><h2>Recent user accounts</h2><Link className="text-link" to="/admin/users">View all <ArrowRight size={16}/></Link></div><div className="table-scroll"><table className="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead><tbody>{users.slice(0,5).map((u) => <tr key={u._id}><td><Link to={`/admin/users/${u._id}`}>{u.name}</Link></td><td>{u.email}</td><td>{u.role}</td><td><span className={`status-pill status-${u.status === 'active' ? 'completed' : 'archived'}`}>{u.status}</span></td><td>{relativeDate(u.createdAt)}</td></tr>)}</tbody></table></div></div>
  </>;
}
