import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">🥗</div>
        <h1 className="auth-title">NutriSave</h1>
        <p className="auth-subtitle">Smart Food Waste Management</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in...' : '🔑 Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="auth-roles">
          <p>Register as:</p>
          <div className="role-tags">
            <span>🍽️ Restaurant</span>
            <span>🏨 Hotel</span>
            <span>🏠 Hostel</span>
            <span>🤝 NGO</span>
            <span>🙋 Volunteer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
