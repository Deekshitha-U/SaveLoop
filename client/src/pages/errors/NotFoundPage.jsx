import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';
export default function NotFoundPage() { return <div className="error-screen"><SearchX size={43}/><h1>Page not found</h1><p>There is nothing saved at this URL.</p><Link to="/" className="btn btn-primary"><ArrowLeft size={17}/> Back to SaveLoop</Link></div>; }
