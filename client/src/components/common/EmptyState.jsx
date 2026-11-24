import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function EmptyState({ title = 'Nothing here yet', description = 'When you save something, it will appear here.', action, href }) {
  return <div className="empty-state"><span className="empty-icon"><Inbox size={32} /></span><h3>{title}</h3><p>{description}</p>{action && href && <Link to={href} className="btn btn-primary btn-sm">{action}</Link>}</div>;
}
