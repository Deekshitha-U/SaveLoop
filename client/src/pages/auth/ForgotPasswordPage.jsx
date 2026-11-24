import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { resetPassword } from '../../services/authService';
import { DEMO_MODE } from '../../config/firebase';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); try { await resetPassword(email); toast.success(DEMO_MODE ? 'Password reset is not required in demo mode' : 'If the account exists, check your email for password reset instructions.'); } catch (err) { toast.error(err.message); } finally { setBusy(false); } };
  return <div className="auth-card"><h2>Reset your password</h2><p>Enter your email to get a password reset link.</p><form className="auth-fields" onSubmit={submit}><Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required/><Button type="submit" loading={busy} className="full-btn"><Send size={17}/> Send reset link</Button></form><p className="auth-bottom"><Link to="/login"><ArrowLeft size={16}/> Back to login</Link></p></div>;
}
