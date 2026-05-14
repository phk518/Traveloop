import React from 'react';

interface StopModalProps {
  onClose: () => void;
  onSave: (form: any) => void;
}

const StopModal: React.FC<StopModalProps> = ({ onClose, onSave }) => {
  const [form, setForm] = React.useState({ city_name: "", arrival_date: "", departure_date: "" });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10 border-primary/20 shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">add_location_alt</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Add World Stop</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">City / Location</label>
            <input 
              autoFocus
              className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              placeholder="e.g. Kyoto, Japan"
              value={form.city_name}
              onChange={(e) => setForm({...form, city_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Arrival</label>
              <input 
                type="date"
                className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                value={form.arrival_date}
                onChange={(e) => setForm({...form, arrival_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Departure</label>
              <input 
                type="date"
                className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                value={form.departure_date}
                onChange={(e) => setForm({...form, departure_date: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-white/10 text-on-surface hover:bg-white/5 transition-all font-bold">
              Cancel
            </button>
            <button 
              onClick={() => onSave(form)}
              className="flex-1 py-4 rounded-2xl accent-bg text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
            >
              Add Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopModal;
