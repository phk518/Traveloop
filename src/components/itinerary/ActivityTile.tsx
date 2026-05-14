import React from 'react';
import { Activity } from '../../types';

interface ActivityTileProps {
  activity: Activity;
  onRemove: () => void;
}

const ActivityTile: React.FC<ActivityTileProps> = ({ activity, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Transport': return 'flight';
      case 'Stay': return 'hotel';
      case 'Dining': return 'restaurant';
      default: return 'stars';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 flex items-center justify-between group/tile hover:border-primary/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[20px]">{getIcon(activity.type)}</span>
        </div>
        <div>
          <h4 className="font-label-md text-label-md text-on-surface">{activity.name}</h4>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
            ¥{activity.cost?.toLocaleString()} • {activity.duration}
          </p>
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/5 opacity-0 group-hover/tile:opacity-100 transition-all"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

export default ActivityTile;
