import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { trips, user } = useData();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.start_date?.includes(searchQuery)
  );

  const activeTrip = filteredTrips.length > 0 ? filteredTrips[0] : null;
  const otherTrips = filteredTrips.slice(1);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="font-headline-xl text-headline-xl mb-2 text-on-surface">Hello, {user?.name.split(' ')[0]}</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">Where are we headed next?</p>
        <div className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline-variant" 
            placeholder="Search destinations, trips, or bookings..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Trips Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            {searchQuery ? `Search Results (${filteredTrips.length})` : 'My Trips'}
          </h2>
          <Link to="/create-trip" className="accent-gradient text-white px-button-padding-x py-button-padding-y rounded-xl font-label-md text-label-md active:scale-95 transition-transform">
            New Trip
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {!activeTrip && searchQuery && (
            <div className="col-span-12 py-12 text-center glass-panel rounded-xl">
              <p className="text-on-surface-variant italic">No trips matching "{searchQuery}"</p>
            </div>
          )}
          {activeTrip ? (
            <>
              {/* Active Trip Card (Featured) */}
              <article className="md:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col active-glow relative border-primary/20">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-label-sm backdrop-blur-md border border-primary/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
                <div className="h-64 md:h-80 w-full relative">
                  <img 
                    alt={activeTrip.name} 
                    className="w-full h-full object-cover" 
                    src={activeTrip.cover_photo || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>
                <div className="p-card-padding flex flex-col flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{activeTrip.name}</h3>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        <span className="text-label-md font-label-md">{activeTrip.start_date} — {activeTrip.end_date}</span>
                      </div>
                    </div>
                    <Link to={`/trip/${activeTrip.id}`} className="accent-gradient text-white px-button-padding-x py-button-padding-y rounded-xl font-label-md text-label-md hover:brightness-110 transition-all flex items-center justify-center gap-2">
                      View Itinerary
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>

              {/* Status Sidebar */}
              <aside className="md:col-span-4 flex flex-col gap-gutter">
                <div className="glass-panel p-card-padding rounded-xl flex-grow">
                  <h4 className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest mb-4">Current Progress</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-label-md font-label-md text-on-surface">Trip Completion</span>
                        <span className="text-label-md font-label-md text-primary">35%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full accent-gradient rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="material-symbols-outlined text-tertiary">flight_takeoff</span>
                      </div>
                      <div>
                        <p className="text-label-sm font-label-sm text-outline">Next Stop</p>
                        <p className="text-on-surface font-label-md">London Gatwick</p>
                        <p className="text-label-sm text-on-surface-variant">Check-in at 09:00</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass-panel p-card-padding rounded-xl">
                  <h4 className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-headline-md font-headline-md text-on-surface">04</p>
                      <p className="text-label-sm text-on-surface-variant">Places Saved</p>
                    </div>
                    <div>
                      <p className="text-headline-md font-headline-md text-on-surface">07</p>
                      <p className="text-label-sm text-on-surface-variant">Days Left</p>
                    </div>
                  </div>
                </div>
              </aside>
            </>
          ) : (
            <div className="md:col-span-12 glass-panel p-12 rounded-xl text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-primary text-4xl">travel_explore</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No active trips</h3>
                <p className="text-on-surface-variant">Ready to start your next adventure?</p>
              </div>
              <Link to="/create-trip" className="accent-gradient text-white px-8 py-3 rounded-xl font-label-md text-label-md">
                Create Your First Trip
              </Link>
            </div>
          )}

          {/* Planned Trips */}
          {otherTrips.map(trip => (
            <article key={trip.id} className="md:col-span-6 glass-panel rounded-xl overflow-hidden group">
              <div className="h-48 w-full relative">
                <img 
                  alt={trip.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={trip.cover_photo || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"} 
                />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-label-sm border border-white/20">PLANNED</div>
              </div>
              <div className="p-card-padding">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{trip.name}</h3>
                <div className="flex items-center gap-2 text-on-surface-variant mb-6">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span className="text-label-md font-label-md">{trip.start_date} — {trip.end_date}</span>
                </div>
                <Link to={`/trip/${trip.id}`} className="block w-full bg-white/5 border border-white/10 text-on-surface px-button-padding-x py-button-padding-y rounded-xl font-label-md text-label-md text-center hover:bg-white/10 transition-colors">
                  View Itinerary
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Discovery Section: Recommended Destinations */}
      <section className="mt-16 border-t border-white/5 pt-12 pb-32">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Discover Next</h2>
            <p className="font-label-md text-on-surface-variant uppercase tracking-widest mt-1">Recommended Destinations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Destination 1 */}
          <Link to="/create-trip?dest=Tokyo" className="glass-panel rounded-3xl overflow-hidden group hover:border-primary/40 transition-colors relative h-64 flex flex-col justify-end p-6 cursor-pointer shadow-lg block">
            <img src="https://images.unsplash.com/photo-1540959733332-e94e1bf32f38?auto=format&fit=crop&q=80&w=800" alt="Tokyo" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline-lg text-white mb-1 drop-shadow-md">Tokyo, Japan</h3>
                  <div className="flex gap-2">
                    <p className="font-label-sm text-primary uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">ASIA • $$$</p>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">Vibrant</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Destination 2 */}
          <Link to="/create-trip?dest=Paris" className="glass-panel rounded-3xl overflow-hidden group hover:border-secondary/40 transition-colors relative h-64 flex flex-col justify-end p-6 cursor-pointer shadow-lg block">
            <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800" alt="Paris" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline-lg text-white mb-1 drop-shadow-md">Paris, France</h3>
                  <div className="flex gap-2">
                    <p className="font-label-sm text-secondary uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">EUROPE • $$$$</p>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">Historic</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-secondary transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Destination 3 */}
          <Link to="/create-trip?dest=Bali" className="glass-panel rounded-3xl overflow-hidden group hover:border-tertiary/40 transition-colors relative h-64 flex flex-col justify-end p-6 cursor-pointer shadow-lg block">
            <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800" alt="Bali" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline-lg text-white mb-1 drop-shadow-md">Bali, Indonesia</h3>
                  <div className="flex gap-2">
                    <p className="font-label-sm text-tertiary uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">ASIA • $$</p>
                    <p className="font-label-sm text-on-surface-variant uppercase tracking-widest bg-background/50 backdrop-blur-sm px-2 py-1 rounded inline-block">Tropical</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-tertiary transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
