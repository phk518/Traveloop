import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

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
      const res = await axios.get(`http://127.0.0.1:3001/api/trips?userId=${user.id}`);
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips', err);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('http://127.0.0.1:3001/api/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('traveloop_user', JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      const res = await axios.post('http://127.0.0.1:3001/api/auth/register', { email, password, name });
      // Log them in automatically after signup
      const userRes = await axios.post('http://127.0.0.1:3001/api/auth/login', { email, password });
      setUser(userRes.data);
      localStorage.setItem('traveloop_user', JSON.stringify(userRes.data));
      return { success: true, user: userRes.data };
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
  };

  // Trip Actions
  const createTrip = async (tripData) => {
    if (!user || !user.id) throw new Error('User session not found. Please log in again.');
    const res = await axios.post('http://127.0.0.1:3001/api/trips', { ...tripData, userId: user.id });
    fetchTrips();
    return res.data;
  };

  const cloneTrip = async (tripId) => {
    if (!user || !user.id) throw new Error('User session not found. Please log in again.');
    const res = await axios.post(`http://127.0.0.1:3001/api/trips/${tripId}/clone`, { userId: user.id });
    fetchTrips();
    return res.data;
  };

  // Stop Actions
  const addStop = async (tripId, stopData) => {
    const res = await axios.post(`http://127.0.0.1:3001/api/trips/${tripId}/stops`, stopData);
    return res.data;
  };

  const deleteStop = async (stopId) => {
    await axios.delete(`http://127.0.0.1:3001/api/stops/${stopId}`);
  };

  // Activity Actions
  const addActivity = async (stopId, activityData) => {
    const res = await axios.post(`http://127.0.0.1:3001/api/stops/${stopId}/activities`, activityData);
    return res.data;
  };

  const deleteActivity = async (activityId) => {
    await axios.delete(`http://127.0.0.1:3001/api/activities/${activityId}`);
  };

  // Packing List Actions
  const addPackingItem = async (tripId, item, category) => {
    const res = await axios.post(`http://127.0.0.1:3001/api/trips/${tripId}/packing`, { item, category });
    return res.data;
  };

  const togglePackingItem = async (itemId, isPacked) => {
    await axios.put(`http://127.0.0.1:3001/api/packing/${itemId}`, { is_packed: isPacked });
  };

  // Journal Actions
  const addJournalEntry = async (tripId, entryData) => {
    const res = await axios.post(`http://127.0.0.1:3001/api/trips/${tripId}/notes`, entryData);
    return res.data;
  };

  const deleteJournalEntry = async (noteId) => {
    await axios.delete(`http://127.0.0.1:3001/api/notes/${noteId}`);
  };

  return (
    <DataContext.Provider value={{ 
      user, trips, loading, login, logout, signup, createTrip, cloneTrip,
      addStop, deleteStop, addActivity, deleteActivity,
      addPackingItem, togglePackingItem, addJournalEntry, deleteJournalEntry 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
