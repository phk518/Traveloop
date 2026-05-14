import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Plane, LogOut, User, Map, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '8px', borderRadius: '12px' }}>
          <Plane size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
          traveloop
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map size={18} /> Trips
        </Link>
        <Link to="/create-trip" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <PlusCircle size={18} /> New Trip
        </Link>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
              <User size={18} />
            </div>
            <span style={{ fontWeight: 500 }}>{user.name}</span>
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .nav-link:hover { color: var(--text-primary) !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
