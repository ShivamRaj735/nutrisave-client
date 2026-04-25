import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const STATUS_COLORS = { available: 'available', requested: 'requested', picked_up: 'delivered', delivered: 'delivered', expired: 'expired' };
const CAT_ICON = { cooked: '🍲', raw: '🥩', packaged: '📦', bakery: '🥖', fruits_veggies: '🥦', other: '🍱' };

export default function MyDonations() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/food/my').then(r => setFoods(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Remove this listing?')) return;
    await api.delete(`/food/${id}`);
    load();
  };

  const handleStatus = async (id, status) => {
    await api.patch(`/food/${id}/status`, { status });
    load();
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">📋 My Donations</h1>
          <p className="page-subtitle">All food you have listed for donation</p>
        </div>
        <Link to="/add-food" className="btn btn-primary">➕ Add New</Link>
      </div>

      {foods.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍱</div>
          <h3>No donations yet</h3>
          <p>Start by listing your surplus food</p>
          <Link to="/add-food" className="btn btn-primary mt-4">➕ Donate Food</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {foods.map(food => (
            <div key={food._id} className="card donation-row">
              <div className="donation-icon">{CAT_ICON[food.category] || '🍱'}</div>
              <div className="donation-main">
                <div className="flex items-center gap-2 mb-2">
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{food.foodName}</h3>
                  <span className={`badge badge-${STATUS_COLORS[food.status]}`}>{food.status.replace('_', ' ')}</span>
                </div>
                <div className="donation-meta">
                  <span>📦 {food.quantity} {food.quantityUnit}</span>
                  <span>📍 {food.pickupAddress}</span>
                  <span>⏰ Pickup: {new Date(food.pickupTime).toLocaleString()}</span>
                  <span>⚠️ Expiry: {new Date(food.expiryTime).toLocaleString()}</span>
                </div>
                {food.description && <p className="text-muted mt-2" style={{ fontSize: 14 }}>{food.description}</p>}
              </div>
              <div className="donation-actions">
                {food.status === 'available' && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(food._id)}>🗑️ Remove</button>
                )}
                {food.status === 'requested' && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleStatus(food._id, 'picked_up')}>✅ Mark Picked Up</button>
                )}
                {food.status === 'picked_up' && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleStatus(food._id, 'delivered')}>🎉 Mark Delivered</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
