import React, { useEffect, useState } from 'react';
import api from '../api';

const STATUS_BADGE = { pending: 'pending', approved: 'approved', rejected: 'rejected', picked_up: 'delivered', delivered: 'delivered' };
const CAT_ICON = { cooked: '🍲', raw: '🥩', packaged: '📦', bakery: '🥖', fruits_veggies: '🥦', other: '🍱' };

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/my').then(r => setRequests(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 className="page-title">📋 My Pickup Requests</h1>
      <p className="page-subtitle">Track the food you have requested to pickup</p>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No requests yet</h3>
          <p>Browse available food and submit a request</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {requests.map(req => (
            <div key={req._id} className="card donation-row">
              <div className="donation-icon">{CAT_ICON[req.food?.category] || '🍱'}</div>
              <div className="donation-main">
                <div className="flex items-center gap-2 mb-2">
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{req.food?.foodName}</h3>
                  <span className={`badge badge-${STATUS_BADGE[req.status]}`}>{req.status.replace('_', ' ')}</span>
                </div>
                <div className="donation-meta">
                  <span>📦 {req.food?.quantity} {req.food?.quantityUnit}</span>
                  <span>📍 {req.food?.pickupAddress}</span>
                  <span>⏰ Pickup by: {req.food && new Date(req.food.pickupTime).toLocaleString()}</span>
                  <span>🗓️ Requested on: {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="donation-status-icon">
                {req.status === 'pending' && '⏳'}
                {req.status === 'approved' && '✅'}
                {req.status === 'rejected' && '❌'}
                {req.status === 'picked_up' && '🚗'}
                {req.status === 'delivered' && '🎉'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
