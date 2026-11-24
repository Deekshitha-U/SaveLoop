import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { DEMO_MODE } from '../../config/firebase';
import { authErrorMessage } from '../../utils/firebaseErrors';
export default function SignupPage() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false);
  const signup = useAuthStore((s) => s.signup); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); if (password.length < 6 && !DEMO_MODE) return toast.error('Password must contain at least 6 characters'); if (password !== confirm) return toast.error('Passwords do not match'); setBusy(true);
    try { await signup(name, email, password); toast.success('Welcome to SaveLoop! Your account is ready.', { id: 'signup-welcome', duration: 3600 }); navigate('/app/dashboard'); } catch (err) { toast.error(authErrorMessage(err, 'signup'), { id: 'signup-error' }); } finally { setBusy(false); } };
  return <div className="auth-card"><h2>Create your account</h2><p>Start saving and rediscovering what matters.</p>{DEMO_MODE && <div className="demo-info">Demo mode creates a temporary browser preview session.</div>}
    <form onSubmit={submit} className="auth-fields"><Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" minLength={2} required/>
      <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/>
      <label className="field"><span className="field-label">Password</span><span className="password-wrap"><input className="input" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Minimum 6 characters" required={!DEMO_MODE}/><button type="button" onClick={() => setShow((v) => !v)} aria-label="Toggle password visibility">{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>
      <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required={!DEMO_MODE}/>
      <Button type="submit" loading={busy} className="full-btn">Create free account <ArrowRight size={18}/></Button>
    </form><p className="auth-bottom">Already have an account? <Link to="/login">Log in</Link></p></div>;
}
