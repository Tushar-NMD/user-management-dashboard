import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'current' | 'primary' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-[2.5px]',
  };

  const colorStyles: React.CSSProperties =
    color === 'primary'
      ? { borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }
      : color === 'white'
        ? { borderColor: '#FFFFFF', borderTopColor: 'transparent' }
        : { borderColor: 'currentColor', borderTopColor: 'transparent' };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin shrink-0 ${sizeClasses[size]} ${className}`}
      style={colorStyles}
    />
  );
};
