import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'error' | 'primary';
  hoverable?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false 
}) => {
  const baseStyles = "glass-panel rounded-3xl p-6 transition-all duration-300";
  
  const variants = {
    default: "border-white/10",
    error: "border-error/20 red-glow",
    primary: "border-primary/20 bg-primary/5"
  };

  const hoverStyles = hoverable ? "hover:bg-white/5 hover:border-white/20" : "";

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
