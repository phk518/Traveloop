import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const TripsList = () => {
  const { trips } = useData();
  const [filter, setFilter] = useState('all');

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    const today = new Date();
    const endDate = new Date(trip.end_date);
    const startDate = new Date(trip.start_date);
    
    if (filter === 'active') return startDate <= today && endDate >= today;
    if (filter === 'planned') return startDate > today;
    if (filter === 'past') return endDate < today;
    return true;
  });

  return (
    <div className="animate-fade-in pb-32">
      <header className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">My Journeys</h1>
        <p className="text-on-surface-variant font-body-md">Manage and organize your cosmic expeditions.</p>
      </header>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
        {['all', 'active', 'planned', 'past'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-label-md text-label-md capitalize transition-all ${filter === f ? 'accent-bg text-white shadow-lg' : 'glass-panel text-on-surface-variant hover:border-primary/40'}`}
          >
            {f} Trips
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTrips.map(trip => (
          <Link 
            key={trip.id} 
            to={`/trip/${trip.id}`}
            className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-white/5 transition-all border-white/5 group"
          >
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
              <img 
                alt={trip.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src={trip.cover_photo || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"} 
              />
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">{trip.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${new Date(trip.end_date) < new Date() ? 'border-outline-variant text-on-surface-variant' : 'border-primary/30 text-primary bg-primary/10'}`}>
                  {new Date(trip.end_date) < new Date() ? 'COMPLETED' : 'UPCOMING'}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-on-surface-variant/70 mb-4">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span className="text-label-sm">{trip.start_date} — {trip.end_date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span className="text-label-sm">4 Stops</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-2 transition-transform hidden md:block">chevron_right</span>
          </Link>
        ))}

        {filteredTrips.length === 0 && (
          <div className="py-20 glass-panel rounded-2xl text-center opacity-40">
            <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
            <p className="font-headline-md">No {filter !== 'all' ? filter : ''} trips found.</p>
          </div>
        )}
      </div>

      <Link 
        to="/create-trip" 
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 accent-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
};

export default TripsList;
