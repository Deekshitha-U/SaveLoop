import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sun, Moon, ShieldCheck, LockKeyhole, LogOut, Info } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { DEMO_MODE } from '../../config/firebase';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const navigate = useNavigate();

  function changeTheme(nextTheme) {
    if (theme === nextTheme) return;
    setTheme(nextTheme);
    toast.success(`${nextTheme === 'light' ? 'Light' : 'Dark'} theme enabled`, { id: 'theme-change' });
  }

  async function signOut() {
    try {
      await logout();
      toast.success('You have logged out successfully.', { id: 'logout' });
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Could not log out. Please try again.');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE PREFERENCES"
        title={<>Account <span className="accent">Settings</span></>}
        description="Personalise your SaveLoop workspace."
      />
      <div className="settings-grid">
        <section className="panel settings-card">
          <h2><Sun size={21} /> Appearance</h2>
          <p>Choose a light or dark background. Your choice stays saved in this browser.</p>
          <div className="settings-line appearance-choice-row">
            <span>Theme</span>
            <div className="theme-choice" role="group" aria-label="Choose appearance">
              <button type="button" className={theme === 'light' ? 'selected' : ''} aria-pressed={theme === 'light'} onClick={() => changeTheme('light')}>
                <Sun size={16} /> Light
              </button>
              <button type="button" className={theme === 'dark' ? 'selected' : ''} aria-pressed={theme === 'dark'} onClick={() => changeTheme('dark')}>
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>
        </section>
        <section className="panel settings-card">
          <h2><ShieldCheck size={21} /> Account security</h2>
          <p>Use Firebase's secure password reset whenever you need to change your password.</p>
          <div className="settings-line"><span>Password</span><Link to="/forgot-password" className="text-link"><LockKeyhole size={16} /> Reset password</Link></div>
        </section>
        <section className="panel settings-card">
          <h2><Info size={21} /> Privacy</h2>
          <p>Your saved links are private. Admin accounts can view overall statistics, not other people's personal bookmarks.</p>
          <div className="settings-line"><span>Your role</span><strong>{user?.role || 'user'}</strong></div>
        </section>
        <section className="panel settings-card">
          <h2><LogOut size={21} /> Session</h2>
          <p>{DEMO_MODE ? 'Preview data lives only in this browser.' : 'Log out from your current Firebase session.'}</p>
          <Button variant="outline" onClick={signOut}><LogOut size={17} /> Log out</Button>
        </section>
      </div>
    </>
  );
}
