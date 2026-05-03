
import React from 'react';

function FormField({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[hsl(var(--admin-text))]">
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className="text-xs text-[hsl(var(--admin-error))] mt-1">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
