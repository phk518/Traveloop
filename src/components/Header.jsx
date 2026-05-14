import React from 'react';

const Header = ({ user }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3">
        <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">Traveloop</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-90">notifications</button>
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover" 
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
