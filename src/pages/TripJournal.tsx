import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';

const TripJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addJournalEntry, deleteJournalEntry } = useData();

  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState({ title: "", content: "", tags: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [id]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:3001/api/trips/${id}/full`);
      setEntries(res.data.notes || []);
    } catch (err) {
      console.error('Error fetching journal entries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeEntry.title || !activeEntry.content) return;
    try {
      const res = await addJournalEntry(id, activeEntry);
      setEntries(prev => [res, ...prev]);
      setActiveEntry({ title: "", content: "", tags: "" });
    } catch (err) {
      console.error('Error saving entry', err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteJournalEntry(noteId);
      setEntries(prev => prev.filter(e => e.id !== noteId));
    } catch (err) {
      console.error('Error deleting entry', err);
    }
  };

  if (loading) return <div className="flex-center min-h-screen text-primary">Opening Journal...</div>;

  return (
    <div className="animate-fade-in">
      {/* Detail Header */}
      <header className="bg-surface/30 backdrop-blur-xl border-b border-white/10 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-primary hover:opacity-80 transition-opacity active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Trip Journal</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop pt-10 pb-32">
        {/* Active Entry Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-1">New Entry</h2>
              <p className="text-on-surface-variant font-label-md">Capture your thoughts</p>
            </div>
            <button 
              onClick={handleSave}
              className="accent-bg px-6 py-2 rounded-full font-label-md text-white shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              Save Entry
            </button>
          </div>
          <div className="glass-panel rounded-xl p-6 md:p-8">
            <input 
              className="bg-transparent border-none w-full font-headline-md text-headline-md text-primary-fixed-dim focus:ring-0 mb-4 placeholder:text-outline-variant" 
              placeholder="Entry Title..." 
              type="text" 
              value={activeEntry.title}
              onChange={(e) => setActiveEntry({...activeEntry, title: e.target.value})}
            />
            <textarea 
              className="bg-transparent border-none w-full font-body-lg text-body-lg text-on-surface focus:ring-0 resize-none placeholder:text-outline-variant" 
              placeholder="Write your travel thoughts here..." 
              rows="8"
              value={activeEntry.content}
              onChange={(e) => setActiveEntry({...activeEntry, content: e.target.value})}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <input 
                className="bg-surface/20 border-none rounded-full px-4 py-1 text-label-sm text-primary focus:ring-1 focus:ring-primary w-48"
                placeholder="Tags (e.g. #tokyo #food)"
                value={activeEntry.tags}
                onChange={(e) => setActiveEntry({...activeEntry, tags: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Saved Notes List */}
        <section>
          <h3 className="font-headline-md text-headline-md mb-8">Saved Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map(entry => (
              <div key={entry.id} className="glass-panel rounded-xl p-6 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-primary-fixed-dim">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    <span className="text-label-sm">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-outline-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <h4 className="font-headline-md text-headline-md mb-2 group-hover:text-primary transition-colors">{entry.title}</h4>
                <p className="text-on-surface-variant text-body-md line-clamp-2">{entry.content}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {entry.tags?.split(' ').map(tag => (
                      <span key={tag} className="text-[10px] text-primary opacity-60 uppercase">{tag}</span>
                    ))}
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            ))}

            {entries.length === 0 && (
              <div className="md:col-span-2 glass-panel p-20 rounded-xl text-center flex flex-col items-center gap-4 opacity-40">
                <span className="material-symbols-outlined text-5xl">auto_stories</span>
                <p>No journal entries yet. Start writing your first memory!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Detail Navigation */}
      <nav className="bg-surface/30 backdrop-blur-xl border-t border-white/10 fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4">
        <button onClick={() => navigate(`/trip/${id}/edit`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-sm text-label-sm">Itinerary</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/budget`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-sm text-label-sm">Budget</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/checklist`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="font-label-sm text-label-sm">Checklist</span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary font-bold scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          <span className="font-label-sm text-label-sm">Journal</span>
        </button>
      </nav>
    </div>
  );
};

export default TripJournal;
