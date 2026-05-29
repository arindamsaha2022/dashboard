import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export function CustomDropdown({ value, options, onChange, className, buttonClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full border flex items-center justify-between transition-all duration-200 focus:outline-none text-[var(--text-primary)]",
          isOpen ? "border-transparent ring-2 ring-[var(--accent-primary)]" : "border-[var(--border-color)] hover:border-[var(--text-secondary)]",
          buttonClassName || "bg-[var(--bg-primary)] rounded-lg px-4 py-2"
        )}
      >
        <span>{selectedOption ? selectedOption.label : value}</span>
        <ChevronDown 
          size={16} 
          className={cn("text-[var(--text-secondary)] transition-transform duration-300", isOpen ? "rotate-180 text-[var(--accent-primary)]" : "rotate-0")} 
        />
      </button>

      <div
        className={cn(
          "absolute top-[calc(100%+8px)] left-0 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xl z-50 overflow-hidden origin-top transition-all duration-200 flex flex-col",
          isOpen ? "scale-y-100 opacity-100 visible translate-y-0" : "scale-y-95 opacity-0 invisible -translate-y-2"
        )}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "w-full text-left px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors duration-150 border-b border-[var(--border-color)] last:border-b-0",
              value === opt.value ? "text-[var(--accent-primary)] font-bold bg-[var(--bg-secondary)]/50" : "text-[var(--text-primary)]"
            )}
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
