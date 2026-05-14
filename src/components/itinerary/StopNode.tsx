import React from 'react';
import { Stop } from '../../types';
import ActivityTile from './ActivityTile';

interface StopNodeProps {
  stop: Stop;
  index: number;
  isLast: boolean;
  onRemoveStop: () => void;
  onAddActivity: () => void;
  onRemoveActivity: (activityId: string) => void;
}

const StopNode: React.FC<StopNodeProps> = ({ 
  stop, index, isLast, onRemoveStop, onAddActivity, onRemoveActivity 
}) => {
  return (
    <div className="relative">
      {/* Connector */}
      {!isLast && (
        <div className="absolute left-7 top-14 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-transparent -mb-16"></div>
      )}

      <div className="flex items-start gap-8 group">
        {/* Node */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-surface-container border border-white/10 flex items-center justify-center shrink-0 z-10 group-hover:border-primary/50 transition-colors shadow-lg">
            <span className="font-headline-md text-primary font-bold">{index + 1}</span>
          </div>
        </div>

        {/* Stop Content */}
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl flex justify-between items-center group-hover:bg-white/5 transition-colors">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{stop.city_name}</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">
                {stop.arrival_date} • {stop.departure_date}
              </p>
            </div>
            <button 
              onClick={onRemoveStop}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/10 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
            </button>
          </div>

          {/* Activity Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stop.activities?.map(activity => (
              <ActivityTile 
                key={activity.id || activity._id} 
                activity={activity} 
                onRemove={() => onRemoveActivity(activity.id || activity._id!)} 
              />
            ))}

            <button 
              onClick={onAddActivity}
              className="border-2 border-dashed border-white/5 rounded-2xl p-4 flex items-center justify-center gap-2 text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group/add"
            >
              <span className="material-symbols-outlined text-[20px] group-hover/add:scale-125 transition-transform">add_circle</span>
              <span className="font-label-sm uppercase tracking-widest">Add Activity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopNode;
