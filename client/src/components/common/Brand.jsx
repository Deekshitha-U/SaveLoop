import { Link } from 'react-router-dom';
export default function Brand({ compact = false, to = '/' }) {
  return <Link to={to} className="brand" aria-label="SaveLoop home">
    <span className="brand-symbol" aria-hidden="true">∞</span>{!compact && <span>Save<span className="brand-accent">Loop</span></span>}
  </Link>;
}
