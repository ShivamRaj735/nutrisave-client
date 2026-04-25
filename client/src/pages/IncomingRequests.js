import React, { useEffect, useState } from 'react';
import api from '../api';

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/requests/incoming').then(r => setRequests(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/requests/${id}`, { status });
    load();
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 className="page-title">📥 Incoming Pickup Requests</h1>
      <p className="page-subtitle">NGOs and volunteers requesting your listed food</p>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No requests received yet</h3>
          <p>When NGOs or volunteers request your food, they'll appear here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {requests.map(req => (
            <div key={req._id} className="card donation-row">
              <div className="donation-icon">
                {req.requesterRole === 'ngo' ? '🤝' : '🙋'}
              </div>
              <div className="donation-main">
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{req.requesterName}</h3>
                  <span className={`badge badge-${req.requesterRole}`}>{req.requesterRole}</span>
                  <span className={`badge badge-${req.status === 'pending' ? 'pending' : req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : 'delivered'}`}>
                    {req.status}
                  </span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)' }}>
                  Requesting: {req.food?.foodName} ({req.food?.quantity} {req.food?.quantityUnit})
                </p>
                <div className="donation-meta">
                  <span>📍 {req.food?.pickupAddress}</span>
                  <span>🗓️ {new Date(req.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {req.status === 'pending' && (
                <div className="donation-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => updateStatus(req._id, 'approved')}>✅ Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={() => updateStatus(req._id, 'rejected')}>❌ Reject</button>
                </div>
              )}
              {req.status === 'approved' && (
                <div className="donation-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => updateStatus(req._id, 'delivered')}>🎉 Mark Delivered</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
