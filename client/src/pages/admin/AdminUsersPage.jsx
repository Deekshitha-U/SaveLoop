import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, UserRound, ArrowUpRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { adminService } from '../../services/adminService';
import { prettyDate } from '../../utils/dateUtils';
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]); const [query, setQuery] = useState('');
  useEffect(() => { adminService.users().then(setUsers).catch((e) => toast.error(e.message)); }, []);
  const shown = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow="ADMINISTRATION" title={<>User <span className="accent">Management</span></>} description="View registered accounts and manage permitted account actions."/>
    <section className="panel recent-users-panel"><label className="search-wrap"><Search size={18}/><input placeholder="Find an account by name or email" value={query} onChange={(e) => setQuery(e.target.value)}/></label><div className="table-scroll"><table className="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Bookmarks</th><th>Joined</th><th></th></tr></thead><tbody>{shown.map((u) => <tr key={u._id}><td><span className="table-user"><span className="avatar small-avatar">{u.name?.charAt(0)}</span>{u.name}</span></td><td>{u.email}</td><td>{u.role}</td><td><span className={`status-pill status-${u.status === 'active' ? 'completed' : 'archived'}`}>{u.status}</span></td><td>{u.bookmarkCount || 0}</td><td>{prettyDate(u.createdAt)}</td><td><Link to={`/admin/users/${u._id}`} className="icon-btn"><ArrowUpRight size={18}/></Link></td></tr>)}</tbody></table>{!shown.length && <p className="table-empty">No accounts matched your search.</p>}</div></section>
  </>;
}
