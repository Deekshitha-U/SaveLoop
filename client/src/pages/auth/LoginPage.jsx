import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, UserRound, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import { DEMO_MODE } from '../../config/firebase';
import { authErrorMessage } from '../../utils/firebaseErrors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event, demoRole) {
    event?.preventDefault?.();
    setBusy(true);
    setError('');
    try {
      const selectedEmail = demoRole === 'admin'
        ? 'admin@saveloop.demo'
        : demoRole === 'user' ? 'user@saveloop.demo' : email.trim();
      const user = await login(selectedEmail, password);
      const firstName = user.name?.trim().split(' ')[0] || 'there';
      toast.success(`Welcome back, ${firstName}!`, { id: 'login-welcome', duration: 4200 });

      const requested = location.state?.from;
      navigate(
        user.role === 'admin' ? '/admin' : requested?.startsWith('/app') ? requested : '/app/dashboard',
        { replace: true },
      );
    } catch (caught) {
      const friendly = authErrorMessage(caught, 'login');
      setError(friendly);
      toast.error(friendly, { id: 'login-error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card polished-login-card">
      <h2>Welcome back</h2>
      <p>Pick up right where you left off.</p>
      {DEMO_MODE && <div className="demo-info">Preview mode: explore SaveLoop without connecting an account.</div>}

      <form onSubmit={(event) => submit(event)} className="auth-fields">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setError(''); }}
          placeholder="you@example.com"
          required
        />
        <label className="field">
          <span className="field-label">Password</span>
          <span className="password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(''); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required={!DEMO_MODE}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((old) => !old)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && <div className="auth-alert" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}
        <div className="auth-extra auth-extra-right"><Link to="/forgot-password">Forgot password?</Link></div>
        <Button type="submit" loading={busy} className="full-btn polished-primary-action">
          Log in <ArrowRight size={18} />
        </Button>
      </form>

      {DEMO_MODE && (
        <div className="demo-buttons">
          <button type="button" disabled={busy} onClick={() => submit(null, 'user')}><UserRound size={17} /> Preview user dashboard</button>
          <button type="button" disabled={busy} onClick={() => submit(null, 'admin')}><ShieldCheck size={17} /> Preview admin dashboard</button>
        </div>
      )}
      <p className="auth-bottom">New to SaveLoop? <Link to="/signup">Create an account <ArrowRight size={15} /></Link></p>
    </div>
  );
}
