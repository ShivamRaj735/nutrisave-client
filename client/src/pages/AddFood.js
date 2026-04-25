import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AddFood.css';

const CATEGORIES = [
  { value: 'cooked', label: '🍲 Cooked Food' },
  { value: 'raw', label: '🥩 Raw Ingredients' },
  { value: 'packaged', label: '📦 Packaged Items' },
  { value: 'bakery', label: '🥖 Bakery Items' },
  { value: 'fruits_veggies', label: '🥦 Fruits & Vegetables' },
  { value: 'other', label: '🍱 Other' },
];

const UNITS = ['kg', 'g', 'litres', 'packets', 'boxes', 'plates', 'pieces'];

export default function AddFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    foodName: '', quantity: '', quantityUnit: 'kg',
    category: 'cooked', description: '',
    pickupAddress: '', pickupTime: '', expiryTime: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.post('/food', form);
      setSuccess('✅ Food donation listed successfully!');
      setTimeout(() => navigate('/my-donations'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">➕ Donate Surplus Food</h1>
      <p className="page-subtitle">Fill in the details below to list your surplus food for pickup</p>

      <div className="add-food-layout">
        <form className="card" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <h3 style={{ marginBottom: 16, color: 'var(--green)' }}>🍱 Food Details</h3>

          <div className="form-group">
            <label>Food Item Name *</label>
            <input name="foodName" placeholder="e.g. Dal Rice, Bread Rolls, Mixed Curry" value={form.foodName} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Quantity *</label>
              <input name="quantity" type="number" placeholder="e.g. 10" value={form.quantity} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select name="quantityUnit" value={form.quantityUnit} onChange={handleChange}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Food Category</label>
            <div className="category-grid">
              {CATEGORIES.map(c => (
                <div
                  key={c.value}
                  className={`category-pill ${form.category === c.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, category: c.value })}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea name="description" rows={3} placeholder="Any additional details about the food, allergens, packaging, etc." value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
          </div>

          <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid var(--border)' }} />
          <h3 style={{ marginBottom: 16, color: 'var(--green)' }}>📍 Pickup Information</h3>

          <div className="form-group">
            <label>Pickup Address *</label>
            <input name="pickupAddress" placeholder="Full address for pickup" value={form.pickupAddress} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Available for Pickup From *</label>
              <input type="datetime-local" name="pickupTime" value={form.pickupTime} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Food Expiry Time *</label>
              <input type="datetime-local" name="expiryTime" value={form.expiryTime} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Publishing...' : '🌱 Publish Food Donation'}
          </button>
        </form>

        <div className="add-food-sidebar">
          <div className="card tip-card">
            <h3>💡 Tips for a Good Listing</h3>
            <ul>
              <li>📝 Be specific about food quantity and type</li>
              <li>⏰ Set realistic pickup times</li>
              <li>📍 Provide clear pickup address</li>
              <li>🌡️ Mention if food needs refrigeration</li>
              <li>⚠️ Note any common allergens</li>
              <li>📱 Keep your phone handy for NGO calls</li>
            </ul>
          </div>

          <div className="card impact-card">
            <div className="impact-icon">🌍</div>
            <h3>Your Impact</h3>
            <p>Every meal donated can feed a family for a day. By listing your surplus food, you help reduce environmental pollution and fight hunger.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
