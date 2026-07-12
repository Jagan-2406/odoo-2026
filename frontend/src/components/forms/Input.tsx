import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search } from 'lucide-react';

// ==========================================
// 1. Text / Number / Search / Password Input
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSearchIcon?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, isSearchIcon, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-300 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {isSearchIcon && (
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full h-10 px-3 py-2 bg-background border border-border text-sm rounded-md transition-colors placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSearchIcon && 'pl-9',
                error && 'border-red-500 focus-visible:ring-red-500'
              ),
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ==========================================
// 2. Text Area
// ==========================================
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-300 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-full min-h-[100px] px-3 py-2 bg-background border border-border text-sm rounded-md transition-colors placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              error && 'border-red-500 focus-visible:ring-red-500'
            ),
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

// ==========================================
// 3. Dropdown Select
// ==========================================
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-300 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full h-10 pl-3 pr-10 py-2 bg-background border border-border text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background appearance-none cursor-pointer',
                error && 'border-red-500 focus-visible:ring-red-500'
              ),
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-950 text-zinc-50">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ==========================================
// 4. Checkbox
// ==========================================
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={twMerge(
              'h-4 w-4 rounded border-border bg-background text-primary accent-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              className
            )}
            {...props}
          />
          <span className="text-sm font-medium text-foreground disabled:opacity-50">{label}</span>
        </label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// ==========================================
// 5. Toggle Switch
// ==========================================
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, disabled, checked, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center justify-between w-full cursor-pointer select-none py-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <div className="relative inline-flex items-center">
            <input
              ref={ref}
              type="checkbox"
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
              {...props}
            />
            <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-50 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
          </div>
        </label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Switch.displayName = 'Switch';
