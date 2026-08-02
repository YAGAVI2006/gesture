import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin`} />
      {label && <span>{label}</span>}
    </div>
  );
}
