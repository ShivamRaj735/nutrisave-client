import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const isDonor = role => ['restaurant', 'hotel', 'hostel', 'other'].includes(role);
const isReceiver = role => ['ngo', 'volunteer'].includes(role);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const active = path => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🥗 <span>NutriSave</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={active('/')} onClick={() => setMenuOpen(false)}>🏠 Home</Link>

          {isDonor(user?.role) && (
            <>
              <Link to="/add-food" className={active('/add-food')} onClick={() => setMenuOpen(false)}>➕ Donate Food</Link>
              <Link to="/my-donations" className={active('/my-donations')} onClick={() => setMenuOpen(false)}>📋 My Donations</Link>
              <Link to="/incoming" className={active('/incoming')} onClick={() => setMenuOpen(false)}>📥 Requests</Link>
            </>
          )}

          {isReceiver(user?.role) && (
            <>
              <Link to="/browse" className={active('/browse')} onClick={() => setMenuOpen(false)}>🔍 Browse Food</Link>
              <Link to="/my-requests" className={active('/my-requests')} onClick={() => setMenuOpen(false)}>📋 My Requests</Link>
            </>
          )}

          <div className="navbar-user">
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            <span className="user-name">{user?.name}</span>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
