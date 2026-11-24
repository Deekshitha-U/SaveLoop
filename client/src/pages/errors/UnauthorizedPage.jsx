import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
export default function UnauthorizedPage() { return <div className="error-screen"><LockKeyhole size={43}/><h1>Access denied</h1><p>This section is only available to authorised administrators.</p><Link to="/app/dashboard" className="btn btn-primary"><ArrowLeft size={17}/> Back to your library</Link></div>; }
