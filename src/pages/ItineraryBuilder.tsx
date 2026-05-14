import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { Trip } from '../types';

import StopNode from '../components/itinerary/StopNode';
import StopModal from '../components/itinerary/StopModal';
import ActivityModal from '../components/itinerary/ActivityModal';
import TripDetailNav from '../components/TripDetailNav';

const ItineraryBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addStop, deleteStop, addActivity, deleteActivity } = useData();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:3001/api/trips/${id}/full`);
        setTrip(res.data);
      } catch (err) {
        console.error('Error fetching trip details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleAddStop = async (form: any) => {
    try {
      const newStop = await addStop(id!, { ...form, sort_order: (trip?.stops?.length || 0) + 1 });
      setTrip(prev => prev ? ({ ...prev, stops: [...(prev.stops || []), { ...newStop, activities: [] }] }) : null);
      setShowStopModal(false);
    } catch (err) {
      console.error('Error adding stop', err);
    }
  };

  const handleRemoveStop = async (stopId: string) => {
    if (!window.confirm("Remove this world stop and all its activities?")) return;
    try {
      await deleteStop(stopId);
      setTrip(prev => prev ? ({ ...prev, stops: prev.stops.filter(s => (s.id || s._id) !== stopId) }) : null);
    } catch (err) {
      console.error('Error removing stop', err);
    }
  };

  const handleAddActivity = async (form: any) => {
    const stopId = showActivityModal!;
    try {
      const newActivity = await addActivity(stopId, form);
      setTrip(prev => prev ? ({
        ...prev,
        stops: prev.stops.map(s => (s.id || s._id) === stopId ? { ...s, activities: [...(s.activities || []), newActivity] } : s)
      }) : null);
      setShowActivityModal(null);
    } catch (err) {
      console.error('Error adding activity', err);
    }
  };

  const handleRemoveActivity = async (stopId: string, activityId: string) => {
    try {
      await deleteActivity(activityId);
      setTrip(prev => prev ? ({
        ...prev,
        stops: prev.stops.map(s => (s.id || s._id) === stopId ? { ...s, activities: s.activities.filter(a => (a.id || a._id) !== activityId) } : s)
      }) : null);
    } catch (err) {
      console.error('Error removing activity', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div className="flex-center min-h-screen text-on-surface">Trip not found</div>;

  return (
    <div className="animate-fade-in pb-32">
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/trip/${id}`)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Manifest Editor</h1>
        </div>
        <button onClick={() => setShowStopModal(true)} className="accent-bg px-5 py-2 rounded-xl font-label-md text-white shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add_location</span>
          <span>Add Stop</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 space-y-12">
        <div className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Mission: {trip.name}</h2>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Constructing the cosmic timeline</p>
        </div>

        <section className="relative space-y-16">
          {(trip.stops || []).map((stop, index) => (
            <StopNode 
              key={stop.id || stop._id || index}
              stop={stop}
              index={index}
              isLast={index === trip.stops.length - 1}
              onRemoveStop={() => handleRemoveStop(stop.id || stop._id!)}
              onAddActivity={() => setShowActivityModal(stop.id || stop._id!)}
              onRemoveActivity={(aId) => handleRemoveActivity(stop.id || stop._id!, aId)}
            />
          ))}

          {(!trip.stops || trip.stops.length === 0) && <EmptyState onAdd={() => setShowStopModal(true)} />}
        </section>
      </main>

      {showStopModal && <StopModal onClose={() => setShowStopModal(false)} onSave={handleAddStop} />}
      {showActivityModal && <ActivityModal onClose={() => setShowActivityModal(null)} onSave={handleAddActivity} />}
      
      <TripDetailNav tripId={id!} activeTab="itinerary" />
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="text-primary font-headline-md animate-pulse">Syncing Manifest Data...</span>
  </div>
);

const EmptyState = ({ onAdd }: any) => (
  <div className="py-24 glass-panel rounded-3xl text-center flex flex-col items-center gap-6 opacity-40 border-dashed border-white/10">
    <span className="material-symbols-outlined text-6xl">explore</span>
    <div className="space-y-1">
      <h3 className="font-headline-md text-headline-md">Empty Manifest</h3>
      <p className="font-body-md">Begin your journey by adding the first destination.</p>
    </div>
    <button onClick={onAdd} className="text-primary font-bold hover:underline uppercase tracking-widest text-[12px]">
      + Create Initial Stop
    </button>
  </div>
);



export default ItineraryBuilder;
