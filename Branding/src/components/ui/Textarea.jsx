import { useState } from 'react';

export function Textarea({ label, placeholder, value, onChange, rows = 4, error, required = false, disabled = false, helperText, className = '', ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="font-body text-sm font-medium text-white/80">
          {label}{required && <span className="text-fm-primary ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          px-4 py-3 rounded-lg font-body text-base resize-none
          bg-fm-surface text-white
          border-2 transition-all duration-200
          ${isFocused ? 'border-fm-primary shadow-[0_0_0_3px_rgba(251,173,29,0.15)]' : 'border-fm-border hover:border-fm-primary/50'}
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text'}
          placeholder:text-white/25
          focus:outline-none
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-white/40'}`}>{error || helperText}</p>
      )}
    </div>
  );
}

export default Textarea;
