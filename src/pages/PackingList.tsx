import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';

const PackingList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPackingItem, togglePackingItem } = useData();
  
  const [packingList, setPackingList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [activeCategory, setActiveCategory] = useState("Clothing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackingList();
  }, [id]);

  const fetchPackingList = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:3001/api/trips/${id}/full`);
      setPackingList(res.data.packing_list || []);
    } catch (err) {
      console.error('Error fetching packing list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await togglePackingItem(itemId, newStatus);
      setPackingList(prev => prev.map(item => item.id === itemId ? { ...item, is_packed: newStatus } : item));
    } catch (err) {
      console.error('Error toggling item', err);
    }
  };

  const handleAddItem = async (category) => {
    if (!newItem.trim()) return;
    try {
      const res = await addPackingItem(id, newItem, category);
      setPackingList(prev => [...prev, res]);
      setNewItem("");
    } catch (err) {
      console.error('Error adding item', err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-primary font-headline-md animate-pulse">Scanning Inventory...</span>
    </div>
  );

  const categories = ["Clothing", "Electronics", "Documents", "Personal Care"];
  const packedItemsCount = packingList.filter(i => i.is_packed).length;
  const totalItemsCount = packingList.length;
  const progress = totalItemsCount > 0 ? (packedItemsCount / totalItemsCount) * 100 : 0;

  return (
    <div className="animate-fade-in pb-32">
      {/* Detail Header */}
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Traveloop</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
          <img alt="User" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"/>
        </div>
      </header>

      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto space-y-8">
        {/* Page Title & Progress */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Packing Checklist</h2>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Inventory Management</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-6 md:min-w-[320px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="url(#acc-grad)" strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset={100 - progress} strokeLinecap="round" className="transition-all duration-700 ease-out" />
                <defs>
                  <linearGradient id="acc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a078ff" />
                    <stop offset="100%" stopColor="#aa0266" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute font-label-sm text-[10px] text-primary font-bold">{Math.round(progress)}%</span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-on-surface">{packedItemsCount}/{totalItemsCount}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Items Packed</p>
            </div>
          </div>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {categories.map(category => (
            <section key={category} className="glass-panel p-8 rounded-3xl space-y-6 flex flex-col h-full hover:border-primary/20 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${category === "Clothing" ? "bg-primary/10 text-primary" : (category === "Electronics" ? "bg-secondary/10 text-secondary" : (category === "Documents" ? "bg-tertiary/10 text-tertiary" : "bg-outline-variant/10 text-on-surface-variant"))}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {category === "Clothing" ? "checkroom" : (category === "Electronics" ? "devices" : (category === "Documents" ? "description" : "sanitizer"))}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">{category}</h3>
                </div>
                <span className="text-on-surface-variant/40 font-label-sm uppercase tracking-widest">{packingList.filter(i => i.category === category).length} Items</span>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {packingList.filter(i => i.category === category).map(item => (
                  <label key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group/item">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={!!item.is_packed} 
                          onChange={() => handleToggle(item.id, !!item.is_packed)}
                          className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" 
                        />
                        {item.is_packed && <div className="absolute inset-0 bg-primary/20 blur-md -z-10 rounded-full animate-pulse"></div>}
                      </div>
                      <span className={`font-body-md transition-all ${item.is_packed ? 'text-on-surface-variant/40 line-through' : 'text-on-surface group-hover/item:text-primary'}`}>
                        {item.item}
                      </span>
                    </div>
                  </label>
                ))}
                
                {packingList.filter(i => i.category === category).length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-20 grayscale">
                    <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                    <p className="font-label-sm">No items added yet</p>
                  </div>
                )}
              </div>

              {/* Add Item Field */}
              <div className="pt-4">
                <div className="glass-panel rounded-xl flex items-center p-1.5 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-body-md flex-1 px-4 text-on-surface placeholder:text-outline-variant" 
                    placeholder={`Add to ${category}...`}
                    type="text"
                    value={activeCategory === category ? newItem : ""}
                    onChange={(e) => {
                      setNewItem(e.target.value);
                      setActiveCategory(category);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem(category)}
                  />
                  <button 
                    onClick={() => handleAddItem(category)}
                    className="accent-bg text-white w-10 h-10 rounded-lg flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Detail Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/30 backdrop-blur-xl border-t border-white/10 h-20 pb-safe px-4 flex justify-around items-center">
        <button onClick={() => navigate(`/trip/${id}`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-sm text-label-sm">Itinerary</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/budget`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-sm text-label-sm">Budget</span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary font-bold scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
          <span className="font-label-sm text-label-sm">Checklist</span>
        </button>
        <button onClick={() => navigate(`/trip/${id}/journal`)} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-label-sm text-label-sm">Journal</span>
        </button>
      </nav>
    </div>
  );
};

export default PackingList;
