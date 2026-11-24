export default function Input({ label, hint, error, id, className = '', ...props }) {
  return <label className={`field ${className}`} htmlFor={id}>
    {label && <span className="field-label">{label}</span>}
    <input id={id} className={`input ${error ? 'input-error' : ''}`} {...props} />
    {hint && <span className="field-hint">{hint}</span>}{error && <span className="field-error">{error}</span>}
  </label>;
}
