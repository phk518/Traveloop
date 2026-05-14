import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    // Simulation
    setStatus({ type: 'success', message: 'Cosmic security updated successfully!' });
    setTimeout(() => navigate(-1), 1500);
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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Cosmic Security</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Update your transmission credentials</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-6 border-primary/10 shadow-2xl shadow-primary/5">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Current Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
              <input 
                type="password" 
                required
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-on-surface"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">New Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">key</span>
              <input 
                type="password" 
                required
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-on-surface"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Confirm New Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">shield</span>
              <input 
                type="password" 
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-on-surface"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl text-center font-label-md ${status.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 rounded-xl accent-bg text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all mt-4"
          >
            Update Password
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant font-body-md">
          Forgot your password? <button className="text-primary font-bold hover:underline">Contact Support</button>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
