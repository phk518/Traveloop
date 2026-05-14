import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TravelPreferences = () => {
  const navigate = useNavigate();

  const [style, setStyle] = useState("Solo");
  const [budget, setBudget] = useState(3); // 1-5
  const [interests, setInterests] = useState(["Culture", "Food"]);

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const allInterests = ["Culture", "Nature", "Food", "Extreme", "Relaxation", "Tech", "History"];

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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Travel Preferences</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Customize your cosmic search parameters</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Travel Style */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Voyage Style
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Solo", "Backpacker", "Luxury", "Family"].map(s => (
              <button 
                key={s}
                onClick={() => setStyle(s)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${style === s ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10' : 'border-white/5 bg-white/5 text-on-surface-variant hover:border-white/20'}`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {s === "Solo" ? "person" : (s === "Backpacker" ? "hiking" : (s === "Luxury" ? "diamond" : "family_restroom"))}
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest">{s}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">favorite</span>
            Interests & Passions
          </h2>
          <div className="flex flex-wrap gap-3">
            {allInterests.map(interest => (
              <button 
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all flex items-center gap-2 ${interests.includes(interest) ? 'accent-bg text-white shadow-lg shadow-primary/20' : 'glass-panel text-on-surface-variant hover:border-primary/40'}`}
              >
                {interests.includes(interest) && <span className="material-symbols-outlined text-[18px]">check</span>}
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* Budget Sensitivity */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">payments</span>
            Budget Sensitivity
          </h2>
          <div className="space-y-8">
            <div className="flex justify-between text-on-surface-variant font-label-sm uppercase tracking-widest">
              <span>Thrifty</span>
              <span>Balanced</span>
              <span>Galactic High</span>
            </div>
            <div className="relative h-2 w-full bg-surface-container rounded-full">
              <div 
                className="absolute h-full bg-accent-gradient rounded-full" 
                style={{ width: `${(budget - 1) * 25}%` }}
              ></div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={budget} 
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-xl pointer-events-none border-4 border-primary transition-all"
                style={{ left: `calc(${(budget - 1) * 25}% - 12px)` }}
              ></div>
            </div>
            <p className="text-center font-body-md text-on-surface-variant">
              Level {budget}: {budget <= 2 ? "Focusing on hidden gems and local experiences." : (budget === 3 ? "Seeking a balance between comfort and cost." : "Prioritizing premium comfort and exclusive access.")}
            </p>
          </div>
        </section>

        {/* Save Actions */}
        <div className="pt-8">
          <button className="w-full py-4 rounded-xl accent-bg text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            Update Voyage Parameters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelPreferences;
