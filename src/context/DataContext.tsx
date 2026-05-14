import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, Trip, Stop, Activity, PackingItem, JournalNote, DataContextType } from '../types';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Create axios instance with base URL and interceptors
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('traveloop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const res = await api.get<Trip[]>('/api/trips');
      setTrips(res.data);
    } catch (err: any) {
      console.error('Error fetching trips', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post<{ user: User; token: string }>('/api/auth/login', { email, password });
      const { user, token } = res.data;
      
      setUser(user);
      localStorage.setItem('traveloop_user', JSON.stringify(user));
      localStorage.setItem('traveloop_token', token);
      
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await api.post('/api/auth/register', { email, password, name });
      return await login(email, password);
    } catch (err: any) {
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

  const createTrip = async (tripData: Partial<Trip>) => {
    const res = await api.post<Trip>('/api/trips', tripData);
    fetchTrips();
    return res.data;
  };

  const updateTrip = async (tripId: string, tripData: Partial<Trip>) => {
    const res = await api.put<Trip>(`/api/trips/${tripId}`, tripData);
    fetchTrips();
    return res.data;
  };

  const cloneTrip = async (tripId: string) => {
    const res = await api.post<Trip>(`/api/trips/${tripId}/clone`);
    fetchTrips();
    return res.data;
  };

  const addStop = async (tripId: string, stopData: Partial<Stop>) => {
    const res = await api.post<Stop>(`/api/trips/${tripId}/stops`, stopData);
    return res.data;
  };

  const deleteStop = async (stopId: string) => {
    await api.delete(`/api/stops/${stopId}`);
  };

  const addActivity = async (stopId: string, activityData: Partial<Activity>) => {
    const res = await api.post<Activity>(`/api/stops/${stopId}/activities`, activityData);
    return res.data;
  };

  const deleteActivity = async (activityId: string) => {
    await api.delete(`/api/activities/${activityId}`);
  };

  const addPackingItem = async (tripId: string, item: string, category: string) => {
    const res = await api.post<PackingItem>(`/api/trips/${tripId}/packing`, { item, category });
    return res.data;
  };

  const togglePackingItem = async (itemId: string, isPacked: boolean) => {
    await api.put(`/api/packing/${itemId}`, { is_packed: isPacked });
  };

  const addJournalEntry = async (tripId: string, entryData: Partial<JournalNote>) => {
    const res = await api.post<JournalNote>(`/api/trips/${tripId}/notes`, entryData);
    return res.data;
  };

  const deleteJournalEntry = async (noteId: string) => {
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

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
