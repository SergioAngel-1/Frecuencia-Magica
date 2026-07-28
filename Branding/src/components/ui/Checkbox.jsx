import { useState } from 'react';

export function Checkbox({ label, checked: controlledChecked, onChange, disabled = false, error, className = '', ...props }) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (e) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" checked={isChecked} onChange={handleChange} disabled={disabled} className="sr-only" {...props} />
        <div className={`
          w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
          ${isChecked ? 'bg-fm-primary border-fm-primary' : 'bg-transparent border-fm-border hover:border-fm-primary'}
          ${error ? 'border-red-500' : ''}
        `}>
          {isChecked && (
            <svg className="w-3 h-3 text-fm-carbon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-white/75 leading-relaxed">{label}</span>}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </label>
  );
}

export default Checkbox;
