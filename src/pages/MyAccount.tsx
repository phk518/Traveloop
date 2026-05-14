import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const MyAccount = () => {
  const { user } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: "Passionate galactic traveler seeking the next aurora.",
    location: "Mumbai, India"
  });

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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Account</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Manage your voyager identity</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <section className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary avatar-glow">
                <img 
                  alt={user?.name} 
                  className="w-full h-full object-cover rounded-full" 
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <h3 className="font-headline-md text-on-surface mb-1">{user?.name}</h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/30">Level 42 Voyager</span>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h4 className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest mb-4">Traveler Identity</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">public</span>
                <span className="text-on-surface font-body-md">India</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
                <span className="text-on-surface font-body-md">Joined May 2022</span>
              </div>
            </div>
          </section>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8 space-y-6">
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_square</span>
              Personal Information
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="w-full bg-surface-container/50 border border-white/10 rounded-xl p-4 text-on-surface-variant cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                />
              </div>
              <button 
                type="button"
                className="accent-bg px-12 py-4 rounded-xl font-headline-md text-white shadow-lg hover:opacity-90 active:scale-95 transition-all w-full md:w-auto"
              >
                Save Changes
              </button>
            </form>
          </section>

          <section className="glass-panel rounded-2xl p-8">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">lock_reset</span>
              Security & Privacy
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/change-password')}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">key</span>
                  <span className="font-body-md text-on-surface">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">shield_with_heart</span>
                  <span className="font-body-md text-on-surface">Privacy Settings</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
