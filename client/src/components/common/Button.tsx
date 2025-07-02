import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  icon
}) => {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-4 focus:ring-amber-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? disabledClasses : ''}
    ${widthClasses}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;