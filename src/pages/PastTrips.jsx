import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PastTrips = () => {
  const { trips } = useData();
  const navigate = useNavigate();

  const pastTrips = useMemo(() => {
    const today = new Date();
    return trips.filter(trip => {
      const endDate = new Date(trip.end_date);
      return endDate < today;
    });
  }, [trips]);

  return (
    <div className="animate-fade-in pt-12 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-primary hover:bg-white/5 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Travel Archive</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Relive your past cosmic expeditions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Archive Summary */}
        <section className="glass-panel rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-primary/10">
          <div className="text-center md:text-left">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">You've explored {pastTrips.length} worlds</h2>
            <p className="text-on-surface-variant font-body-md max-w-md">Every journey tells a story. Access your past itineraries, budgets, and journals below.</p>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-headline-lg text-secondary font-bold">{pastTrips.length}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Completed</span>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="font-headline-lg text-tertiary font-bold">42</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Stops Made</span>
            </div>
          </div>
        </section>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTrips.map(trip => (
            <Link key={trip.id} to={`/trip/${trip.id}`} className="group glass-panel rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all active:scale-[0.98]">
              <div className="h-48 w-full relative grayscale group-hover:grayscale-0 transition-all duration-500">
                <img 
                  alt={trip.name} 
                  className="w-full h-full object-cover" 
                  src={trip.cover_photo || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800"} 
                />
                <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/20 text-on-surface-variant">ARCHIVED</div>
              </div>
              <div className="p-6">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{trip.name}</h3>
                <div className="flex items-center gap-2 text-on-surface-variant/70 mb-4">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span className="text-label-sm font-label-sm">{trip.start_date} — {trip.end_date}</span>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[12px] text-primary">
                    <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                    Review Journal
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    Final Budget
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {pastTrips.length === 0 && (
            <div className="md:col-span-3 py-24 glass-panel rounded-2xl text-center flex flex-col items-center gap-6 opacity-40">
              <span className="material-symbols-outlined text-6xl">history</span>
              <div>
                <h3 className="font-headline-md text-headline-md">Your archive is empty</h3>
                <p className="text-on-surface-variant">Complete your first trip to see it here!</p>
              </div>
              <Link to="/" className="text-primary font-bold hover:underline">Back to Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastTrips;
