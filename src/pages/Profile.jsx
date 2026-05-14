import React from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, trips } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-fade-in hero-gradient -mt-10 pb-20">
      {/* Profile Header */}
      <section className="flex flex-col items-center mb-10 pt-10">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary avatar-glow">
            <img 
              alt={user?.name} 
              className="w-full h-full object-cover rounded-full" 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
            />
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background">
            <span className="material-symbols-outlined text-on-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">{user?.name}</h1>
        <p className="font-label-md text-label-md text-on-surface-variant/80">Galactic Voyager • Level 42</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-gutter mb-10">
        <div className="glass-card rounded-xl p-4 flex flex-col items-center text-center">
          <span className="font-headline-md text-headline-md text-primary font-bold">{trips.length}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Trips</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col items-center text-center">
          <span className="font-headline-md text-headline-md text-secondary font-bold">12</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Countries</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col items-center text-center">
          <span className="font-headline-md text-headline-md text-tertiary font-bold">84</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Photos</span>
        </div>
      </section>

      {/* Menu Options */}
      <section className="space-y-3">
        <button 
          onClick={() => navigate('/my-account')}
          className="w-full glass-card group flex items-center justify-between p-5 rounded-xl active:scale-[0.98] transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-on-surface">My Account</p>
              <p className="font-label-md text-label-md text-on-surface-variant/60">Manage your personal details</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
        
        <button 
          onClick={() => navigate('/past-trips')}
          className="w-full glass-card group flex items-center justify-between p-5 rounded-xl active:scale-[0.98] transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">history</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-on-surface">Past Trips</p>
              <p className="font-label-md text-label-md text-on-surface-variant/60">View your journey history</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>

        <button 
          onClick={() => navigate('/preferences')}
          className="w-full glass-card group flex items-center justify-between p-5 rounded-xl active:scale-[0.98] transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">tune</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-on-surface">Travel Preferences</p>
              <p className="font-label-md text-label-md text-on-surface-variant/60">Customize your search results</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>

        <button 
          onClick={() => navigate('/settings')}
          className="w-full glass-card group flex items-center justify-between p-5 rounded-xl active:scale-[0.98] transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-outline-variant/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-on-surface">Settings</p>
              <p className="font-label-md text-label-md text-on-surface-variant/60">App and notification controls</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>

        <button 
          onClick={() => navigate('/admin')}
          className="w-full glass-card group flex items-center justify-between p-5 rounded-xl active:scale-[0.98] transition-all duration-200 text-left border border-error/20 hover:border-error/40 bg-error/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-error">admin_panel_settings</span>
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-error">Admin Dashboard</p>
              <p className="font-label-md text-label-md text-error/70">Global analytics & tracking</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-error group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
      </section>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full mt-10 py-4 font-label-md text-label-md text-error flex items-center justify-center gap-2 hover:bg-error/5 rounded-xl transition-colors"
      >
        <span className="material-symbols-outlined">logout</span>
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
