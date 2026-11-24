export default function Loader({ label = 'Loading your SaveLoop...' }) {
  return <div className="loader-page"><div className="spinner" /><span>{label}</span></div>;
}
