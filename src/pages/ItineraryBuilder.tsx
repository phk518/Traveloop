import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStop, deleteStop, addActivity, deleteActivity } = useData();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(null); // Will hold stop_id

  // Form States
  const [stopForm, setStopForm] = useState({ city_name: "", arrival_date: "", departure_date: "" });
  const [activityForm, setActivityForm] = useState({ name: "", cost: "", type: "Sightseeing", duration: "2h", description: "" });

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

  const handleAddStop = async () => {
    if (!stopForm.city_name) return;
    try {
      const newStop = await addStop(id, { ...stopForm, sort_order: (trip.stops?.length || 0) + 1 });
      setTrip(prev => ({ ...prev, stops: [...(prev.stops || []), { ...newStop, activities: [] }] }));
      setShowStopModal(false);
      setStopForm({ city_name: "", arrival_date: "", departure_date: "" });
    } catch (err) {
      console.error('Error adding stop', err);
    }
  };

  const handleRemoveStop = async (stopId) => {
    if(!window.confirm("Remove this world stop and all its activities?")) return;
    try {
      await deleteStop(stopId);
      setTrip(prev => ({ ...prev, stops: prev.stops.filter(s => s.id !== stopId) }));
    } catch (err) {
      console.error('Error removing stop', err);
    }
  };

  const handleAddActivity = async () => {
    if (!activityForm.name) return;
    try {
      const stopId = showActivityModal;
      const newActivity = await addActivity(stopId, activityForm);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities || []), newActivity] } : s)
      }));
      setShowActivityModal(null);
      setActivityForm({ name: "", cost: "", type: "Sightseeing", duration: "2h", description: "" });
    } catch (err) {
      console.error('Error adding activity', err);
    }
  };

  const handleRemoveActivity = async (stopId, activityId) => {
    try {
      await deleteActivity(activityId);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(s => s.id === stopId ? { ...s, activities: s.activities.filter(a => a.id !== activityId) } : s)
      }));
    } catch (err) {
      console.error('Error removing activity', err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-primary font-headline-md animate-pulse">Syncing Manifest Data...</span>
    </div>
  );

  return (
    <div className="animate-fade-in pb-32">
      {/* Detail Header */}
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/trip/${id}`)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Manifest Editor</h1>
        </div>
        <button 
          onClick={() => setShowStopModal(true)}
          className="accent-bg px-5 py-2 rounded-xl font-label-md text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_location</span>
          <span>Add Stop</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 space-y-12">
        <div className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Mission: {trip.name}</h2>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Constructing the cosmic timeline</p>
        </div>

        {/* Builder Timeline */}
        <section className="relative space-y-16">
          {(trip.stops || []).map((stop, index) => (
            <div key={stop.id || index} className="relative">
              {/* Connector */}
              {index < trip.stops.length - 1 && (
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
                      onClick={() => handleRemoveStop(stop.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                    </button>
                  </div>

                  {/* Activity Tiles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stop.activities?.map(activity => (
                      <div key={activity.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between group/tile hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">
                              {activity.type === 'Transport' ? 'flight' : (activity.type === 'Stay' ? 'hotel' : (activity.type === 'Dining' ? 'restaurant' : 'stars'))}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface">{activity.name}</h4>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">¥{activity.cost?.toLocaleString()} • {activity.duration}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveActivity(stop.id, activity.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/5 opacity-0 group-hover/tile:opacity-100 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}

                    <button 
                      onClick={() => setShowActivityModal(stop.id)}
                      className="border-2 border-dashed border-white/5 rounded-2xl p-4 flex items-center justify-center gap-2 text-on-surface-variant hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group/add"
                    >
                      <span className="material-symbols-outlined text-[20px] group-hover/add:scale-125 transition-transform">add_circle</span>
                      <span className="font-label-sm uppercase tracking-widest">Add Activity</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!trip.stops || trip.stops.length === 0) && (
            <div className="py-24 glass-panel rounded-3xl text-center flex flex-col items-center gap-6 opacity-40 border-dashed border-white/10">
              <span className="material-symbols-outlined text-6xl">explore</span>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md">Empty Manifest</h3>
                <p className="font-body-md">Begin your journey by adding the first destination.</p>
              </div>
              <button 
                onClick={() => setShowStopModal(true)}
                className="text-primary font-bold hover:underline uppercase tracking-widest text-[12px]"
              >
                + Create Initial Stop
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modern Stop Modal */}
      {showStopModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={() => setShowStopModal(false)}></div>
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10 border-primary/20 shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">add_location_alt</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Add World Stop</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">City / Location</label>
                <input 
                  autoFocus
                  className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  placeholder="e.g. Kyoto, Japan"
                  value={stopForm.city_name}
                  onChange={(e) => setStopForm({...stopForm, city_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Arrival</label>
                  <input 
                    type="date"
                    className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                    value={stopForm.arrival_date}
                    onChange={(e) => setStopForm({...stopForm, arrival_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Departure</label>
                  <input 
                    type="date"
                    className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                    value={stopForm.departure_date}
                    onChange={(e) => setStopForm({...stopForm, departure_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setShowStopModal(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-on-surface hover:bg-white/5 transition-all font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddStop}
                  className="flex-1 py-4 rounded-2xl accent-bg text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                >
                  Add Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={() => setShowActivityModal(null)}></div>
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10 border-primary/20 shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Log Activity</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Activity Name</label>
                <input 
                  autoFocus
                  className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  placeholder="e.g. Fushimi Inari Hike"
                  value={activityForm.name}
                  onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Type</label>
                  <select 
                    className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all appearance-none"
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                  >
                    <option>Sightseeing</option>
                    <option>Transport</option>
                    <option>Stay</option>
                    <option>Dining</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Cost (¥)</label>
                  <input 
                    type="number"
                    className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                    placeholder="0"
                    value={activityForm.cost}
                    onChange={(e) => setActivityForm({...activityForm, cost: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setShowActivityModal(null)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-on-surface hover:bg-white/5 transition-all font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddActivity}
                  className="flex-1 py-4 rounded-2xl accent-bg text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/30 backdrop-blur-xl border-t border-white/10 h-20 pb-safe px-4 flex justify-around items-center">
        <button onClick={() => navigate(`/trip/${id}`)} className="flex flex-col items-center justify-center text-primary font-bold scale-95 transition-transform">
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

export default ItineraryBuilder;
