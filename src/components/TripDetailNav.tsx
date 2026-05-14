import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TripDetailNavProps {
  tripId: string;
  activeTab: 'itinerary' | 'budget' | 'checklist' | 'journal';
}

const TripDetailNav: React.FC<TripDetailNavProps> = ({ tripId, activeTab }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'itinerary', icon: 'map', label: 'Itinerary', path: `/trip/${tripId}` },
    { id: 'budget', icon: 'payments', label: 'Budget', path: `/trip/${tripId}/budget` },
    { id: 'checklist', icon: 'fact_check', label: 'Checklist', path: `/trip/${tripId}/checklist` },
    { id: 'journal', icon: 'auto_stories', label: 'Journal', path: `/trip/${tripId}/journal` }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface/30 backdrop-blur-xl border-t border-white/10 h-20 pb-safe px-4 flex justify-around items-center">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => !isActive && navigate(tab.path)}
            className={`flex flex-col items-center justify-center transition-colors ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
              {tab.icon}
            </span>
            <span className="font-label-sm text-label-sm">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TripDetailNav;
