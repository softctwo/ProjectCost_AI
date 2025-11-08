import React from 'react';

/**
 * Badge Component
 *
 * @param {Object} props
 * @param {'default'|'primary'|'success'|'warning'|'error'} props.color - Badge color
 * @param {'sm'|'md'} props.size - Badge size
 * @param {boolean} props.removable - Show remove button
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 * @param {Function} props.onRemove - Remove callback
 */
const Badge = ({
  color = 'default',
  size = 'md',
  removable = false,
  icon,
  className = '',
  children,
  onRemove,
  ...rest
}) => {
  // Color classes
  const colorClasses = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  // Size classes
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
  };

  // Handle remove
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span
      className={`${colorClasses[color]} ${sizeClasses[size]} inline-flex items-center gap-1 ${removable ? 'chip-removable' : ''} ${className}`}
      {...rest}
    >
      {icon && <span>{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={handleRemove}
          className="chip-remove"
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;