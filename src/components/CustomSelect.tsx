'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  dropdownPosition?: 'top' | 'bottom';
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select...', className = '', dropdownPosition = 'bottom' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${isOpen ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all shadow-sm cursor-pointer flex items-center justify-between group hover:border-blue-300`}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-400'}`} />
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 w-full ${dropdownPosition === 'top' ? 'bottom-full mb-2 origin-bottom' : 'mt-2 origin-top'} bg-white border border-slate-100 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100`}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between mx-2 rounded-lg mb-1 last:mb-0 ${
                value === option.value 
                  ? 'bg-blue-50 text-blue-700 font-bold' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <Check className="w-4 h-4 text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
