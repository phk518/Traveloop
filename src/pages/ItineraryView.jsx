import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import WeatherWidget from '../components/WeatherWidget';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cloneTrip } = useData();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCloning, setIsCloning] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:3001/api/trips/${id}/full`);
      setTrip(res.data);
    } catch (err) {
      console.error('Error fetching trip details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
    try {
      setIsCloning(true);
      const clonedTrip = await cloneTrip(id);
      alert('Trip successfully cloned to your account!');
      navigate(`/trip/${clonedTrip._id || clonedTrip.id}`);
    } catch (err) {
      console.error('Error cloning trip', err);
      alert(err.message || 'Failed to clone trip');
    } finally {
      setIsCloning(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-primary font-headline-md animate-pulse">Mapping Galaxy...</span>
    </div>
  );
  
  if (!trip) return <div className="flex-center min-h-screen text-on-surface">Trip not found</div>;

  return (
    <div className="animate-fade-in pb-32">
      {/* Immersive Header */}
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Traveloop</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleClone}
            disabled={isCloning}
            className="hidden md:flex accent-bg px-4 py-1.5 rounded-full text-white font-label-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">{isCloning ? 'sync' : 'content_copy'}</span>
            {isCloning ? 'Cloning...' : 'Copy Trip'}
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Expedition link copied to clipboard!');
            }}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img alt="User" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"/>
          </div>
        </div>
      </header>

      {/* Hero Cover */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img 
          className="w-full h-full object-cover scale-105" 
          src={trip.cover_photo || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200"} 
          alt={trip.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-margin-mobile md:p-margin-desktop bg-gradient-to-t from-background/80 to-transparent pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/30 backdrop-blur-md">Active Journey</span>
                <span className="bg-white/10 text-on-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 backdrop-blur-md">{trip.stops?.length || 0} World Stops</span>
              </div>
              <h2 className="font-display-lg text-[40px] md:text-[56px] text-white font-bold leading-tight drop-shadow-2xl">{trip.name}</h2>
            </div>
            <Link to={`/trip/${id}/edit`} className="accent-bg px-8 py-4 rounded-2xl text-white font-bold font-headline-md shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 w-fit">
              <span className="material-symbols-outlined">edit_square</span>
              Modify Manifest
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="relative">
          {/* Vertical Timeline Glow Line */}
          <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-secondary to-tertiary opacity-20 hidden md:block"></div>
          
          <div className="space-y-16 relative">
            {trip.stops && trip.stops.map((stop, index) => (
              <section key={stop.id || index} className="relative">
                {/* City Node */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 group">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full accent-bg flex items-center justify-center z-10 shadow-lg shadow-primary/30 relative shrink-0">
                        <span className="material-symbols-outlined text-white text-[18px]">location_on</span>
                      </div>
                      <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full -z-10 group-hover:scale-150 transition-transform"></div>
                    </div>
                    <div>
                      <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">{stop.city_name}</h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{stop.arrival_date} — {stop.departure_date}</p>
                    </div>
                  </div>
                  <div className="md:ml-auto">
                    <WeatherWidget city={stop.city_name} />
                  </div>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:ml-14">
                  {stop.activities && stop.activities.map((activity, aIdx) => (
                    <div key={activity.id || aIdx} className="glass-panel p-5 rounded-3xl space-y-4 group/card hover:border-primary/40 transition-all active:scale-[0.98]">
                      <div className="relative h-44 rounded-2xl overflow-hidden shadow-inner">
                        <img 
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
                          src={activity.image || "https://images.unsplash.com/photo-1540959733332-e94e1bf32f38?auto=format&fit=crop&q=80&w=800"} 
                          alt={activity.name}
                        />
                        <div className="absolute top-3 right-3 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-on-surface border border-white/10 uppercase tracking-widest">{activity.type}</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-headline-md text-headline-md text-on-surface leading-tight group-hover/card:text-primary transition-colors flex-1">{activity.name}</h4>
                          <span className="text-secondary font-bold font-headline-md shrink-0">¥{activity.cost?.toLocaleString()}</span>
                        </div>
                        <p className="text-on-surface-variant text-body-md line-clamp-2 leading-relaxed opacity-80">{activity.description || "No cosmic mission notes provided."}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                            {activity.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
                            Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!stop.activities || stop.activities.length === 0) && (
                    <div className="lg:col-span-3 glass-panel border-dashed border-white/5 py-12 rounded-3xl flex flex-col items-center justify-center text-on-surface-variant gap-4 opacity-40">
                      <span className="material-symbols-outlined text-4xl">event_upcoming</span>
                      <p className="font-body-md">No activities logged for this stop.</p>
                      <Link to={`/trip/${id}/edit`} className="text-primary font-bold hover:underline">Log First Activity</Link>
                    </div>
                  )}
                </div>
              </section>
            ))}

            {(!trip.stops || trip.stops.length === 0) && (
              <div className="glass-panel p-24 rounded-3xl text-center flex flex-col items-center gap-8 border-dashed border-white/10 max-w-2xl mx-auto">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-6xl text-primary opacity-40">map</span>
                </div>
                <div>
                  <h3 className="font-headline-lg text-on-surface mb-2">The star-map is blank</h3>
                  <p className="text-on-surface-variant max-w-xs mx-auto font-body-md">Your expedition manifest has no stops. Start your voyage by adding your first coordinate.</p>
                </div>
                <Link to={`/trip/${id}/edit`} className="accent-bg text-white px-10 py-4 rounded-2xl font-bold font-headline-md shadow-xl">Add First Stop</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/30 backdrop-blur-xl border-t border-white/10 h-20 pb-safe px-4 flex justify-around items-center">
        <button className="flex flex-col items-center justify-center text-primary font-bold scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          <span className="font-label-sm text-label-sm">Itinerary</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/budget`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-sm text-label-sm">Budget</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/checklist`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="font-label-sm text-label-sm">Checklist</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/journal`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-label-sm text-label-sm">Journal</span>
        </button>
      </nav>
    </div>
  );
};

export default ItineraryView;
