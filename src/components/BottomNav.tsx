import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white/5 backdrop-blur-xl border-t border-white/10 rounded-t-xl">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? 'text-primary font-bold bg-white/10 rounded-xl px-4 py-1' : 'text-on-surface-variant/70 hover:text-primary/80'}`
        }
      >
        <span className="material-symbols-outlined">home</span>
        <span className="font-label-sm text-label-sm">Home</span>
      </NavLink>
      <NavLink 
        to="/explore" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? 'text-primary font-bold bg-white/10 rounded-xl px-4 py-1' : 'text-on-surface-variant/70 hover:text-primary/80'}`
        }
      >
        <span className="material-symbols-outlined">explore</span>
        <span className="font-label-sm text-label-sm">Explore</span>
      </NavLink>
      <NavLink 
        to="/trips" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? 'text-primary font-bold bg-white/10 rounded-xl px-4 py-1' : 'text-on-surface-variant/70 hover:text-primary/80'}`
        }
      >
        <span className="material-symbols-outlined">flight_takeoff</span>
        <span className="font-label-sm text-label-sm">Trips</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? 'text-primary font-bold bg-white/10 rounded-xl px-4 py-1' : 'text-on-surface-variant/70 hover:text-primary/80'}`
        }
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-sm text-label-sm">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
