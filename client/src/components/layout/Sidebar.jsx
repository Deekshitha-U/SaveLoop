import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, BookMarked, FolderOpen, Search, Bell, UserRound,
  Settings, PlusCircle, UsersRound, ShieldCheck, ChevronLeft, House,
} from 'lucide-react';
import Brand from '../common/Brand';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

// One definition powers both desktop icon rail and expanded mobile navigation.
const userItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/bookmarks', label: 'My Library', icon: BookMarked },
  { to: '/app/bookmarks/new', label: 'Add Bookmark', icon: PlusCircle },
  { to: '/app/categories', label: 'Categories', icon: FolderOpen },
  { to: '/app/search', label: 'Smart Search', icon: Search },
  { to: '/app/reminders', label: 'Reminders', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

const adminItems = [
  { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'User Management', icon: UsersRound },
  { to: '/admin/settings', label: 'Admin Settings', icon: Settings },
  { to: '/app/dashboard', label: 'My Library', icon: House },
];

export default function Sidebar({ admin = false }) {
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const isAdmin = user?.role === 'admin';

  const links = admin
    ? adminItems
    : [...userItems, ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck, end: true }] : [])];

  const home = admin ? '/admin' : '/app/dashboard';
  const account = admin ? '/admin/settings' : '/app/profile';

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={`app-sidebar icon-rail ${sidebarOpen ? 'mobile-show' : ''}`}>
        <div className="sidebar-top rail-brand">
          <span className="rail-brand-full"><Brand to={home} /></span>
          <span className="rail-brand-mark"><Brand to={home} compact /></span>
          <button
            className="icon-btn mobile-sidebar-close"
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            <ChevronLeft size={21} />
          </button>
        </div>

        <div className="sidebar-caption">{admin ? 'ADMIN WORKSPACE' : 'YOUR WORKSPACE'}</div>

        <nav className="sidebar-nav" aria-label={admin ? 'Admin navigation' : 'Workspace navigation'}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeSidebar}
              aria-label={label}
              className={({ isActive }) => `sidebar-link rail-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="rail-icon" size={21} aria-hidden="true" />
              <span className="nav-label">{label}</span>
              <span className="rail-tooltip" aria-hidden="true">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom rail-bottom">
          <Link
            to={account}
            onClick={closeSidebar}
            className="sidebar-profile rail-profile"
            aria-label={`Open account settings for ${user?.name || 'SaveLoop user'}`}
          >
            <span className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</span>
            <span className="rail-profile-description">
              <strong>{user?.name || 'SaveLoop User'}</strong>
              <small>{isAdmin ? 'Administrator' : 'Personal workspace'}</small>
            </span>
            <span className="rail-tooltip rail-profile-tip" aria-hidden="true">Your account</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
