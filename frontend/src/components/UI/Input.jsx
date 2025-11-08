import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input Component
 *
 * @param {Object} props
 * @param {'text'|'number'|'email'|'password'|'search'|'date'} props.type - Input type
 * @param {'sm'|'md'|'lg'} props.size - Input size
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.prefix - Prefix icon or element
 * @param {React.ReactNode} props.suffix - Suffix icon or element
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Other HTML input props
 */
const Input = ({
  type = 'text',
  size = 'md',
  label,
  placeholder,
  error,
  required = false,
  disabled = false,
  prefix,
  suffix,
  className = '',
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // Handle password visibility toggle
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Determine input type
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Size classes
  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  // Input classes
  const inputClasses = `
    ${sizeClasses[size]}
    ${error ? 'input-error' : ''}
    ${focused && !error ? 'ring-2 ring-primary-500' : ''}
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  // Password toggle icon
  const passwordIcon = type === 'password' ? (
    <button
      type="button"
      onClick={togglePassword}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
    >
      {showPassword ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  ) : null;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {prefix}
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          onFocus={(e) => setFocused(true)}
          onBlur={(e) => setFocused(false)}
          {...rest}
        />

        {suffix && !passwordIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {suffix}
          </div>
        )}

        {passwordIcon}

        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
};

export default Input;