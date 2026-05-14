import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

interface TripHeaderProps {
  title: string;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

const TripHeader: React.FC<TripHeaderProps> = ({ title, onBackClick, actions }) => {
  const navigate = useNavigate();
  const handleBack = onBackClick || (() => navigate(-1));

  return (
    <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          icon="arrow_back" 
          onClick={handleBack} 
          aria-label="Go back"
          className="!p-1.5"
        />
        <h1 className="font-headline-md text-headline-md font-bold text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {actions}
      </div>
    </header>
  );
};

export default TripHeader;
