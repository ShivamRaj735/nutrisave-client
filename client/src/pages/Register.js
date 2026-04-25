import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Auth.css';

const ROLES = [
  { value: 'restaurant', label: '🍽️ Restaurant', desc: 'Donate surplus cooked/raw food' },
  { value: 'hotel', label: '🏨 Hotel', desc: 'Donate buffet & banquet leftovers' },
  { value: 'hostel', label: '🏠 Hostel', desc: 'Donate mess food daily' },
  { value: 'ngo', label: '🤝 NGO', desc: 'Collect & distribute donations' },
  { value: 'volunteer', label: '🙋 Volunteer', desc: 'Help pick up & deliver food' },
  { value: 'other', label: '🏢 Other', desc: 'Any other food donor' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '',
    phone: '', address: '', organization: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.role) return setError('Please select your role');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card wide">
        <div className="auth-logo">🥗</div>
        <h1 className="auth-title">Join NutriSave</h1>
        <p className="auth-subtitle">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="role-selector">
            <label style={{ marginBottom: 10, display: 'block' }}>Select Your Role *</label>
            <div className="role-grid">
              {ROLES.map(r => (
                <div
                  key={r.value}
                  className={`role-card ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <div className="role-icon">{r.label.split(' ')[0]}</div>
                  <div className="role-name">{r.label.split(' ').slice(1).join(' ')}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2 mt-4">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Organization / Business Name</label>
              <input name="organization" placeholder="Hotel / NGO name" value={form.organization} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" placeholder="City, State" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : '✅ Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
