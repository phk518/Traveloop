import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-label-md rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "accent-bg text-white shadow-lg shadow-primary/20 hover:brightness-110",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
    outline: "border border-outline-variant text-on-surface hover:bg-white/5",
    ghost: "text-on-surface-variant hover:text-primary hover:bg-white/5",
    error: "bg-error text-on-error hover:brightness-110 shadow-lg shadow-error/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-5 py-2.5 text-[14px]",
    lg: "px-8 py-4 text-[16px] rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
