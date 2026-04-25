import React, { useEffect, useState } from 'react';
import api from '../api';
import './Browse.css';

const CAT_ICON = { cooked: '🍲', raw: '🥩', packaged: '📦', bakery: '🥖', fruits_veggies: '🥦', other: '🍱' };
const CATEGORIES = ['all', 'cooked', 'raw', 'packaged', 'bakery', 'fruits_veggies', 'other'];

export default function Browse() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [requestingId, setRequestingId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => {
    const params = filter !== 'all' ? `?category=${filter}` : '';
    api.get(`/food${params}`).then(r => setFoods(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleRequest = async food => {
    setRequestingId(food._id);
    try {
      await api.post('/requests', { foodId: food._id, notes: '' });
      setMsg('✅ Pickup request sent!');
      load();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Request failed'));
    }
    setTimeout(() => setMsg(''), 3000);
    setRequestingId(null);
  };

  const filtered = foods.filter(f =>
    f.foodName.toLowerCase().includes(search.toLowerCase()) ||
    f.pickupAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title">🔍 Browse Available Food</h1>
      <p className="page-subtitle">Find and request surplus food in your area</p>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <div className="browse-controls">
        <input
          type="text" placeholder="🔎 Search food or location..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
        <div className="cat-filters">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`cat-btn ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c === 'all' ? '🍽️ All' : c === 'fruits_veggies' ? '🥦 Fruits & Veg' : `${CAT_ICON[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">😔</div>
          <h3>No food available right now</h3>
          <p>Check back later or try a different category</p>
        </div>
      ) : (
        <div className="food-grid">
          {filtered.map(food => {
            const expired = new Date(food.expiryTime) < new Date();
            return (
              <div key={food._id} className={`card food-card ${expired ? 'expired-card' : ''}`}>
                <div className="food-card-header">
                  <span className="food-big-icon">{CAT_ICON[food.category]}</span>
                  <div className="food-badges">
                    <span className={`badge badge-${food.donorRole}`}>{food.donorRole}</span>
                    {expired && <span className="badge badge-expired">Expired</span>}
                  </div>
                </div>

                <h3 className="food-name">{food.foodName}</h3>
                <p className="food-by">by {food.donorName}</p>

                {food.description && <p className="food-desc">{food.description}</p>}

                <div className="food-info">
                  <div className="food-info-row"><span>📦</span><span>{food.quantity} {food.quantityUnit}</span></div>
                  <div className="food-info-row"><span>📍</span><span>{food.pickupAddress}</span></div>
                  <div className="food-info-row"><span>⏰</span><span>Pickup: {new Date(food.pickupTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span></div>
                  <div className="food-info-row"><span>⚠️</span><span>Expires: {new Date(food.expiryTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span></div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                  onClick={() => handleRequest(food)}
                  disabled={requestingId === food._id || expired}
                >
                  {requestingId === food._id ? '⏳ Requesting...' : expired ? '❌ Expired' : '🙋 Request Pickup'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
