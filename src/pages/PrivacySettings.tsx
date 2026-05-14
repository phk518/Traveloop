import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacySettings = () => {
  const navigate = useNavigate();
  
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showTrips: true,
    allowCloning: false,
    analytics: true
  });

  const toggle = (key) => setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Privacy Shield</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Control your presence in the cosmic network</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Visibility */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            Visibility
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-on-surface">Public Profile</p>
                <p className="text-[12px] text-on-surface-variant max-w-xs">Allow other voyagers to view your profile and level.</p>
              </div>
              <button 
                onClick={() => toggle('profilePublic')}
                className={`w-14 h-8 rounded-full transition-all relative ${privacy.profilePublic ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${privacy.profilePublic ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-on-surface">Show Active Trips</p>
                <p className="text-[12px] text-on-surface-variant max-w-xs">Display your current expeditions on your public profile.</p>
              </div>
              <button 
                onClick={() => toggle('showTrips')}
                className={`w-14 h-8 rounded-full transition-all relative ${privacy.showTrips ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${privacy.showTrips ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">content_copy</span>
            Expedition Cloning
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface">Allow Cloning</p>
              <p className="text-[12px] text-on-surface-variant max-w-xs">Let other voyagers clone your public itineraries to use as a template for their own journeys.</p>
            </div>
            <button 
              onClick={() => toggle('allowCloning')}
              className={`w-14 h-8 rounded-full transition-all relative ${privacy.allowCloning ? 'bg-secondary' : 'bg-surface-container-highest'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${privacy.allowCloning ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        {/* Data & Analytics */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">analytics</span>
            Research & Analytics
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface">Anonymous Analytics</p>
              <p className="text-[12px] text-on-surface-variant max-w-xs">Help us improve the Traveloop network by sharing anonymous usage data.</p>
            </div>
            <button 
              onClick={() => toggle('analytics')}
              className={`w-14 h-8 rounded-full transition-all relative ${privacy.analytics ? 'bg-tertiary' : 'bg-surface-container-highest'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${privacy.analytics ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        <div className="pt-8">
          <button className="w-full py-4 rounded-xl glass-panel text-on-surface font-bold border-white/10 hover:bg-white/5 active:scale-95 transition-all">
            Update Shield Parameters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
