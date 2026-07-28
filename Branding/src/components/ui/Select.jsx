import { useState, useRef, useEffect } from 'react';

export function Select({ label, options = [], value, onChange, placeholder = 'Seleccionar...', disabled = false, error, className = '', ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium text-white/80 mb-1.5 font-body">{label}</label>}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 h-[46px] rounded-lg text-left font-body
          bg-fm-surface text-white
          border-2 transition-all duration-200
          flex items-center justify-between
          ${isOpen ? 'border-fm-primary shadow-[0_0_0_3px_rgba(251,173,29,0.15)]' : 'border-fm-border hover:border-fm-primary/50'}
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={selectedOption ? 'text-white' : 'text-white/25'}>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-5 h-5 text-white/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-fm-surface rounded-lg shadow-xl border border-fm-border overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-3 text-left font-body transition-colors duration-150
                ${selectedValue === option.value ? 'bg-fm-primary text-fm-carbon' : 'text-white hover:bg-white/8'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default Select;
