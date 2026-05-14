import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTrip } = useData();
  
  const [name, setName] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dest = params.get('dest');
    if (dest) setName(`${dest} Expedition`);
  }, [location]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createTrip({ 
        name, 
        start_date: startDate, 
        end_date: endDate, 
        description,
        cover_photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200" 
      });
      alert('Trip initiated successfully! Redirecting to manifest editor...');
      navigate(`/trip/${res.id}/edit`);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(err.response?.data?.error || 'Failed to initiate trip. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-primary hover:bg-white/5 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Initiate Expedition</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Set your cosmic coordinates</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Inspiration Card */}
        <div className="md:col-span-5 h-full">
          <div className="glass-panel rounded-3xl overflow-hidden h-full flex flex-col relative group">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
              alt="Adventure"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="relative p-8 mt-auto">
              <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">New Frontier</span>
              <h2 className="font-headline-lg text-white mb-4">Every great story starts with a single coordinate.</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">Define your dates and destination. Traveloop handles the rest, from logistics to lasting memories.</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 md:p-10 space-y-8 border-primary/10">
            <div className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest ml-1">Trip Manifest Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Neo-Tokyo Summer, Alpine Escape"
                  className="w-full bg-surface-container border border-white/10 rounded-2xl py-5 px-6 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all font-headline-md text-[20px] placeholder:text-outline-variant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest ml-1">Launch Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-surface-container border border-white/10 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all text-label-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest ml-1">Return Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-surface-container border border-white/10 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all text-label-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest ml-1">Mission Objective</label>
                <textarea 
                  placeholder="Describe your vision for this journey..."
                  rows={4}
                  className="w-full bg-surface-container border border-white/10 rounded-2xl py-4 px-6 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all font-body-md resize-none placeholder:text-outline-variant"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center font-label-md animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl accent-bg text-white font-bold font-headline-md shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">rocket_launch</span>
                  <span>Initiate Flight Plan</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
