import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddFood from './pages/AddFood';
import MyDonations from './pages/MyDonations';
import Browse from './pages/Browse';
import MyRequests from './pages/MyRequests';
import IncomingRequests from './pages/IncomingRequests';
import Navbar from './components/Navbar';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/add-food" element={<PrivateRoute><AddFood /></PrivateRoute>} />
        <Route path="/my-donations" element={<PrivateRoute><MyDonations /></PrivateRoute>} />
        <Route path="/browse" element={<PrivateRoute><Browse /></PrivateRoute>} />
        <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
        <Route path="/incoming" element={<PrivateRoute><IncomingRequests /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
