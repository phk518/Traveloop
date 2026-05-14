import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

// Create axios instance with base URL and interceptors
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('traveloop_user')) || null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/login', { email, password });
      const { user, token } = res.data;
      
      setUser(user);
      localStorage.setItem('traveloop_user', JSON.stringify(user));
      localStorage.setItem('traveloop_token', token);
      
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      await api.post('/api/auth/register', { email, password, name });
      // Log them in automatically after signup
      return await login(email, password);
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTrips([]);
    localStorage.removeItem('traveloop_user');
    localStorage.removeItem('traveloop_token');
  };

  // Trip Actions
  const createTrip = async (tripData) => {
    const res = await api.post('/api/trips', tripData);
    fetchTrips();
    return res.data;
  };

  const updateTrip = async (tripId, tripData) => {
    const res = await api.put(`/api/trips/${tripId}`, tripData);
    fetchTrips();
    return res.data;
  };

  const cloneTrip = async (tripId) => {
    const res = await api.post(`/api/trips/${tripId}/clone`);
    fetchTrips();
    return res.data;
  };

  // Stop Actions
  const addStop = async (tripId, stopData) => {
    const res = await api.post(`/api/trips/${tripId}/stops`, stopData);
    return res.data;
  };

  const deleteStop = async (stopId) => {
    await api.delete(`/api/stops/${stopId}`);
  };

  // Activity Actions
  const addActivity = async (stopId, activityData) => {
    const res = await api.post(`/api/stops/${stopId}/activities`, activityData);
    return res.data;
  };

  const deleteActivity = async (activityId) => {
    await api.delete(`/api/activities/${activityId}`);
  };

  // Packing List Actions
  const addPackingItem = async (tripId, item, category) => {
    const res = await api.post(`/api/trips/${tripId}/packing`, { item, category });
    return res.data;
  };

  const togglePackingItem = async (itemId, isPacked) => {
    await api.put(`/api/packing/${itemId}`, { is_packed: isPacked });
  };

  // Journal Actions
  const addJournalEntry = async (tripId, entryData) => {
    const res = await api.post(`/api/trips/${tripId}/notes`, entryData);
    return res.data;
  };

  const deleteJournalEntry = async (noteId) => {
    await api.delete(`/api/notes/${noteId}`);
  };

  return (
    <DataContext.Provider value={{ 
      user, trips, loading, login, logout, signup, createTrip, updateTrip, cloneTrip,
      addStop, deleteStop, addActivity, deleteActivity,
      addPackingItem, togglePackingItem, addJournalEntry, deleteJournalEntry 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
