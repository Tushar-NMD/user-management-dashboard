import React from 'react';
import { UserRole, UserStatus } from '../../types/user';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'active' | 'inactive' | 'admin' | 'user' | 'neutral' | 'primary';
  role?: UserRole;
  status?: UserStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  role,
  status,
  size = 'md',
  className = '',
}) => {
  let computedVariant = variant || 'neutral';

  if (status) {
    computedVariant = status.toLowerCase() === 'active' ? 'active' : 'inactive';
  } else if (role) {
    computedVariant = role.toLowerCase() === 'admin' ? 'admin' : 'user';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    admin: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    user: 'bg-slate-50 text-slate-700 border-slate-200/90',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'border-transparent',
  };

  const isPrimary = computedVariant === 'primary';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide select-none ${sizeClasses} ${variantClasses[computedVariant]} ${className}`}
      style={
        isPrimary
          ? {
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary-ring)',
            }
          : undefined
      }
    >
      {computedVariant === 'active' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {computedVariant === 'inactive' && (
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      )}
      {children || status || role}
    </span>
  );
};
