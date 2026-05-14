import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Settings = () => {
  const { user, logout } = useData();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    trips: true,
    social: false,
    security: true
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Settings</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Manage your cosmic identity and preferences</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_edit</span>
            Account Details
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name}
                  className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email}
                  disabled
                  className="w-full bg-surface-container/50 border border-white/10 rounded-xl p-4 text-on-surface-variant cursor-not-allowed"
                />
              </div>
            </div>
            <button className="accent-bg px-8 py-3 rounded-xl font-label-md text-white shadow-lg hover:opacity-90 active:scale-95 transition-all">
              Update Profile
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">notifications</span>
            Communications
          </h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body-md text-body-md text-on-surface capitalize">{key} Updates</p>
                  <p className="text-[12px] text-on-surface-variant">Receive alerts regarding your {key} activity</p>
                </div>
                <button 
                  onClick={() => toggleNotification(key)}
                  className={`w-14 h-8 rounded-full transition-all relative ${enabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Cosmic Security
          </h2>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant">lock_reset</span>
                <span className="font-body-md text-on-surface">Update Password</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>
          </div>
        </section>

        {/* System & Data */}
        <section className="glass-panel rounded-2xl p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">database</span>
            System & Data
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant">download</span>
                <span className="font-body-md text-on-surface">Export Travel Data (JSON)</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-error/5 transition-colors border border-error/10"
              onClick={() => {
                if(window.confirm('Are you sure you want to delete all local data?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-error">delete_forever</span>
                <span className="font-body-md text-error">Purge Cache & Data</span>
              </div>
              <span className="material-symbols-outlined text-error opacity-50">warning</span>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-12 flex flex-col items-center gap-4">
          <p className="text-on-surface-variant text-[12px] uppercase tracking-widest">End of the line</p>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-error font-bold hover:underline"
          >
            Deactivate Galactic Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
