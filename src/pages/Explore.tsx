import React from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Search Section */}
      <section className="mb-12">
        <div className="mb-8">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2 text-on-surface">Where to next?</h2>
          <p className="text-on-surface-variant/80 font-body-md text-body-md">Discover hidden wonders across the cosmic atlas.</p>
        </div>
        <div className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface font-body-md" 
            placeholder="Search destinations, galaxies, or climates..." 
            type="text"
          />
        </div>
        {/* Category Chips */}
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 no-scrollbar">
          <button className="accent-gradient text-white px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap shadow-lg shadow-primary/20">All Explorations</button>
          <button className="glass-panel text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap hover:border-primary/50 transition-colors">Adventure</button>
          <button className="glass-panel text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap hover:border-primary/50 transition-colors">Relaxation</button>
          <button className="glass-panel text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap hover:border-primary/50 transition-colors">Culture</button>
          <button className="glass-panel text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap hover:border-primary/50 transition-colors">Extreme</button>
        </div>
      </section>

      {/* Trending Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Card: Iceland */}
        <Link to="/create-trip" className="md:col-span-8 group relative rounded-xl overflow-hidden aspect-[16/10] glass-card cursor-pointer">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&q=80&w=1200" 
            alt="Iceland"
          />
          <div className="absolute inset-0 scrim-bottom flex flex-col justify-end p-card-padding">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-primary font-label-sm text-label-sm uppercase tracking-widest mb-2 block">EUROPE • $$$</span>
                <h3 className="font-headline-lg text-headline-lg text-white mb-2">Vatnajökull, Iceland</h3>
                <p className="text-on-surface-variant max-w-md line-clamp-2">Traverse the crystalline neon caves of the north. Experience a landscape where fire meets eternal ice.</p>
              </div>
              <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </Link>

        {/* Vertical Card: Bali */}
        <Link to="/create-trip" className="md:col-span-4 group relative rounded-xl overflow-hidden aspect-[4/5] glass-card cursor-pointer">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800" 
            alt="Bali"
          />
          <div className="absolute inset-0 scrim-bottom flex flex-col justify-end p-card-padding">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-tertiary font-label-sm text-label-sm uppercase tracking-widest mb-2 block">ASIA • $$</span>
                <h3 className="font-headline-md text-headline-md text-white mb-2">Ubud, Bali</h3>
                <p className="text-on-surface-variant line-clamp-2">Spiritual sanctuaries and emerald terraces awaiting your arrival.</p>
              </div>
              <button className="glass-panel w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </Link>

        {/* Small Square: Swiss Alps */}
        <Link to="/create-trip" className="md:col-span-4 group relative rounded-xl overflow-hidden aspect-square glass-card cursor-pointer">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800" 
            alt="Swiss Alps"
          />
          <div className="absolute inset-0 scrim-bottom flex flex-col justify-end p-card-padding">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-headline-md text-headline-md text-white mb-1">Swiss Alps</h3>
                <p className="text-on-surface-variant text-label-sm font-label-sm">Peak adrenaline summits.</p>
              </div>
              <button className="glass-panel w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </Link>

        {/* Wide Card: Tokyo */}
        <Link to="/create-trip" className="md:col-span-8 group relative rounded-xl overflow-hidden aspect-[16/7] glass-card cursor-pointer">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1540959733332-e94e1bf32f38?auto=format&fit=crop&q=80&w=1200" 
            alt="Tokyo"
          />
          <div className="absolute inset-0 scrim-bottom flex flex-col justify-end p-card-padding">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-secondary font-label-sm text-label-sm uppercase tracking-widest mb-2 block">ASIA • $$$</span>
                <h3 className="font-headline-lg text-headline-lg text-white mb-2">Shinjuku, Tokyo</h3>
                <p className="text-on-surface-variant max-lg:line-clamp-1">Lose yourself in the neon pulse of the world's most vibrant megalopolis.</p>
              </div>
              <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </Link>
      </section>

      {/* Newsletter / Community Section */}
      <section className="mt-16 glass-panel rounded-2xl p-margin-mobile md:p-card-padding flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
        <div className="max-w-md">
          <h3 className="font-headline-md text-headline-md text-primary mb-3">Join the Pioneer Program</h3>
          <p className="text-on-surface-variant font-body-md text-body-md">Get early access to private expeditions and orbital flight manifests before they hit the general feed.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input className="flex-1 md:w-64 bg-background border border-outline-variant rounded-xl px-4 focus:border-primary transition-all text-on-surface h-12" placeholder="Enter your transmission ID" type="email"/>
          <button className="accent-gradient text-white px-8 py-3 rounded-xl font-label-md text-label-md font-bold active:scale-95 transition-transform h-12">Transmit</button>
        </div>
      </section>

      {/* Contextual FAB */}
      <Link to="/create-trip" className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 accent-gradient text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-40 active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
};

export default Explore;
