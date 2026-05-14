import React from 'react';

interface ActivityModalProps {
  onClose: () => void;
  onSave: (form: any) => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ onClose, onSave }) => {
  const [form, setForm] = React.useState({ name: "", cost: "", type: "Sightseeing", duration: "2h", description: "" });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10 border-primary/20 shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">stars</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Log Activity</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Activity Name</label>
            <input 
              autoFocus
              className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              placeholder="e.g. Fushimi Inari Hike"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-widest ml-1">Type</label>
              <select 
                className="w-full bg-surface-container border border-white/10 rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none transition-all appearance-none"
                value={form.type}
                onChange={(e) => setForm({...form, type: e.target.value})}
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
                value={form.cost}
                onChange={(e) => setForm({...form, cost: e.target.value})}
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
              Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
