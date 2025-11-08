import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'text'|'ghost'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.icon - Icon element
 * @param {'left'|'right'|'only'} props.iconPosition - Icon position
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.rest - Other HTML button props
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  children,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'btn transition-all duration-200 inline-flex items-center justify-center gap-2';

  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    text: 'btn-text',
    ghost: 'btn-ghost',
  };

  // Size classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  // Loading state overrides
  if (loading) {
    disabled = true;
  }

  // Render icon based on position
  const renderIcon = () => {
    if (!icon && !loading) return null;

    if (loading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (iconPosition === 'only') {
      return icon;
    }

    return icon;
  };

  const buttonContent = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {iconPosition !== 'only' && children}
      {iconPosition === 'right' && renderIcon()}
    </>
  );

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;