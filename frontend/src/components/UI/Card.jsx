import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Component
 *
 * @param {Object} props
 * @param {'default'|'elevated'|'outlined'} props.variant - Card variant
 * @param {'sm'|'md'|'lg'} props.size - Card size
 * @param {boolean} props.hover - Hover effect
 * @param {boolean} props.clickable - Clickable card
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.rest - Other div props
 */
const Card = ({
  variant = 'default',
  size = 'md',
  hover = false,
  clickable = false,
  className = '',
  children,
  ...rest
}) => {
  // Variant classes
  const variantClasses = {
    default: 'card',
    elevated: 'card card-elevated',
    outlined: 'card card-outlined',
  };

  // Size classes
  const sizeClasses = {
    sm: 'card-sm',
    md: 'card-md',
    lg: 'card-lg',
  };

  // Interaction classes
  const interactionClasses = hover ? 'hover:shadow-lg' : '';
  const cursorClasses = clickable ? 'cursor-pointer' : '';

  // Motion props
  const motionProps = clickable
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <motion.div
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${interactionClasses} ${cursorClasses} ${className}`}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Card;