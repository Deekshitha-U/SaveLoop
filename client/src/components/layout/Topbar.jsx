import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, Bell, Plus, Search, Sparkles, Sun, Moon, ChevronDown,
  UserRound, Settings, LogOut, ShieldCheck, BookMarked,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useAIStore } from '../../store/aiStore';
import { DEMO_MODE } from '../../config/firebase';

export default function Topbar({ admin = false }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const openAssistant = useAIStore((state) => state.setOpen);

  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Close the account menu on an outside click or Escape.
  useEffect(() => {
    if (!profileOpen) return undefined;
    const outside = (event) => {
      if (!menuRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const escape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [profileOpen]);

  async function signOut() {
    setSigningOut(true);
    try {
      await logout();
      setProfileOpen(false);
      toast.success('You have signed out. See you soon!', { id: 'logout-success' });
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error?.message || 'Unable to log out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="app-topbar polished-topbar">
      <div className="topbar-start">
        <button className="icon-btn menu-toggle" type="button" onClick={toggleSidebar} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="topbar-crumb">{admin ? 'Admin / Control center' : 'Your SaveLoop workspace'}</span>
        {DEMO_MODE && <span className="demo-pill">DEMO MODE</span>}
      </div>

      <div className="topbar-actions">
        {!admin && (
          <>
            <Link className="topbar-quick-search" to="/app/search">
              <Search size={16} /> Search your saves...
            </Link>
            <button
              className="icon-btn topbar-hover-icon"
              type="button"
              onClick={() => openAssistant(true)}
              title="Ask SaveLoop"
              aria-label="Open SaveLoop assistant"
            >
              <Sparkles size={20} />
            </button>
            <Link className="topbar-icon-link topbar-hover-icon" to="/app/reminders" title="Reminders" aria-label="View reminders">
              <Bell size={19} />
            </Link>
            <Link className="topbar-add" to="/app/bookmarks/new">
              <Plus size={17} /><span>New Save</span>
            </Link>
          </>
        )}

        <button
          className="icon-btn topbar-theme-button topbar-hover-icon"
          type="button"
          onClick={() => {
            toggleTheme();
            toast.success(theme === 'light' ? 'Dark mode enabled' : 'Light mode enabled', { id: 'theme-toast', duration: 2400 });
          }}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <div className="topbar-profile-wrap" ref={menuRef}>
          <button
            type="button"
            className={`topbar-profile-trigger ${profileOpen ? 'is-open' : ''}`}
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label={`Account menu for ${user?.name || 'SaveLoop user'}`}
          >
            <span className="avatar topbar-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</span>
            <span className="topbar-profile-name">{user?.name?.split(' ')[0] || 'My account'}</span>
            <ChevronDown className={`topbar-profile-chevron ${profileOpen ? 'rotated' : ''}`} size={16} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className="profile-dropdown"
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="profile-dropdown-head">
                  <span className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                  <div>
                    <strong>{user?.name || 'SaveLoop user'}</strong>
                    <small title={user?.email}>{user?.email || 'Account'}</small>
                  </div>
                </div>
                <span className="profile-role-badge">{isAdmin ? 'Administrator' : 'Member'}</span>
                <div className="profile-dropdown-links">
                  <Link role="menuitem" onClick={() => setProfileOpen(false)} to={admin ? '/admin/settings' : '/app/profile'}>
                    <UserRound size={17} /> My Profile
                  </Link>
                  <Link role="menuitem" onClick={() => setProfileOpen(false)} to={admin ? '/admin/settings' : '/app/settings'}>
                    <Settings size={17} /> Settings
                  </Link>
                  {isAdmin && (
                    <>
                      <Link role="menuitem" onClick={() => setProfileOpen(false)} to="/admin">
                        <ShieldCheck size={17} /> Admin Dashboard
                      </Link>
                      <Link role="menuitem" onClick={() => setProfileOpen(false)} to="/app/dashboard">
                        <BookMarked size={17} /> My Library
                      </Link>
                    </>
                  )}
                </div>
                <div className="profile-dropdown-footer">
                  <button role="menuitem" type="button" className="profile-logout" onClick={signOut} disabled={signingOut}>
                    <LogOut size={17} /> {signingOut ? 'Signing out...' : 'Log out'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
