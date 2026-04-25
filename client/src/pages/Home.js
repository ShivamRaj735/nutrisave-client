import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Home.css';

const isDonor = role => ['restaurant', 'hotel', 'hostel', 'other'].includes(role);
const isReceiver = role => ['ngo', 'volunteer'].includes(role);

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentFood, setRecentFood] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/food?status=available').then(r => setRecentFood(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const roleGreeting = {
    restaurant: '🍽️ Restaurant',
    hotel: '🏨 Hotel',
    hostel: '🏠 Hostel',
    ngo: '🤝 NGO',
    volunteer: '🙋 Volunteer',
    other: '🏢 Organization'
  };

  return (
    <div className="page">
      {/* Hero */}
      <div className="home-hero">
        <div className="hero-content">
          <span className="hero-tag">{roleGreeting[user.role]}</span>
          <h1>Welcome back, <span>{user.name}!</span></h1>
          <p>Together we can reduce food waste and feed those in need. Every meal shared matters. 🌱</p>

          <div className="hero-actions">
            {isDonor(user.role) && (
              <>
                <Link to="/add-food" className="btn btn-primary">➕ Donate Food Now</Link>
                <Link to="/my-donations" className="btn btn-outline">📋 View My Donations</Link>
              </>
            )}
            {isReceiver(user.role) && (
              <>
                <Link to="/browse" className="btn btn-primary">🔍 Browse Available Food</Link>
                <Link to="/my-requests" className="btn btn-outline">📋 My Requests</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-illustration">🥗</div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-row">
          <div className="stat-card green">
            <div className="stat-icon">🍱</div>
            <div className="stat-val">{stats.totalDonations}</div>
            <div className="stat-label">Total Donations</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">✅</div>
            <div className="stat-val">{stats.delivered}</div>
            <div className="stat-label">Meals Delivered</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📦</div>
            <div className="stat-val">{stats.available}</div>
            <div className="stat-label">Available Now</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div className="stat-val">{stats.totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="how-section">
        <h2>How NutriSave Works</h2>
        <div className="how-steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-icon">🏪</div>
            <h3>Donor Adds Food</h3>
            <p>Restaurants, hotels, and hostels list surplus food with quantity, pickup time, and location.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-icon">🔔</div>
            <h3>NGO/Volunteer Requests</h3>
            <p>NGOs and volunteers browse available food and submit a pickup request.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-icon">🚗</div>
            <h3>Food Gets Picked Up</h3>
            <p>Approved volunteers collect the food before expiry and deliver to the needy.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">4</div>
            <div className="step-icon">🤗</div>
            <h3>People Get Fed</h3>
            <p>Surplus food reaches those who need it most — zero waste, maximum impact.</p>
          </div>
        </div>
      </div>

      {/* Recent available food */}
      {recentFood.length > 0 && (
        <div className="recent-section">
          <div className="flex justify-between items-center mb-4">
            <h2>Recently Added Food</h2>
            <Link to="/browse" className="btn btn-sm btn-outline">View All →</Link>
          </div>
          <div className="grid-3">
            {recentFood.map(food => (
              <div key={food._id} className="card food-mini-card">
                <div className="food-category-icon">
                  {food.category === 'cooked' ? '🍲' : food.category === 'bakery' ? '🥖' : food.category === 'fruits_veggies' ? '🥦' : '📦'}
                </div>
                <h3>{food.foodName}</h3>
                <p className="text-muted">{food.quantity} {food.quantityUnit}</p>
                <p className="text-muted" style={{ fontSize: 13 }}>📍 {food.pickupAddress}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`badge badge-${food.donorRole}`}>{food.donorRole}</span>
                  <span className="badge badge-available">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
