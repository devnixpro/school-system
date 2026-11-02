'use client';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
  secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-gray-700 hover:text-blue-600',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  iconPosition = 'right',
  ...props
}) {
  return (
    <button
      className={`font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <i className={icon} />}
      {children}
      {icon && iconPosition === 'right' && <i className={icon} />}
    </button>
  );
}