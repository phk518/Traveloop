import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    activeTrips: 0
  });
  const [loading, setLoading] = useState(true);

  // In a real app, this would be a protected admin endpoint
  // For the hackathon, we simulate fetching global stats
  useEffect(() => {
    // Simulate API delay
    const fetchStats = setTimeout(() => {
      setStats({
        totalUsers: 142,
        totalTrips: 356,
        activeTrips: 89,
        topDestinations: ['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'New York, USA']
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fetchStats);
  }, []);

  // Growth Data
  const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cosmic Voyagers',
        data: [45, 62, 85, 110, 132, 142],
        fill: true,
        borderColor: '#a078ff',
        backgroundColor: 'rgba(160, 120, 255, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#a078ff',
      },
      {
        label: 'Trip Manifests',
        data: [120, 180, 240, 290, 320, 356],
        fill: true,
        borderColor: '#aa0266',
        backgroundColor: 'rgba(170, 2, 102, 0.05)',
        tension: 0.4,
        pointRadius: 0,
      }
    ]
  };

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10, family: 'Inter' } }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 28, 30, 0.9)',
        padding: 12,
        cornerRadius: 12,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-primary font-headline-md animate-pulse">Compiling Global Analytics...</span>
    </div>
  );

  return (
    <div className="animate-fade-in pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Command Center</h1>
        </div>
        <div className="bg-error/20 text-error px-3 py-1 rounded-full text-label-sm font-bold border border-error/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
          Admin Status
        </div>
      </header>

      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Analytics</h2>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Global Traveloop Metrics</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <div>
              <p className="font-display-md text-display-md text-on-surface font-bold">{stats.totalUsers}</p>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Total Cosmic Voyagers</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-secondary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">explore</span>
            </div>
            <div>
              <p className="font-display-md text-display-md text-on-surface font-bold">{stats.totalTrips}</p>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Total Manifests Created</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-tertiary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
            </div>
            <div>
              <p className="font-display-md text-display-md text-on-surface font-bold">{stats.activeTrips}</p>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-widest">Currently Active Expeditions</p>
            </div>
          </div>
        </div>

        {/* Charts & Lists Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Trend Graph */}
          <div className="md:col-span-8 glass-panel rounded-3xl p-8 flex flex-col h-[400px]">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Engagement Trends</h3>
            <div className="flex-1 relative">
              <Line data={growthData} options={growthOptions} />
            </div>
          </div>

          {/* Top Destinations */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-8 flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Top Coordinates</h3>
            <div className="space-y-4 flex-1">
              {stats.topDestinations?.map((dest, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-primary font-bold">#{i+1}</span>
                    <span className="font-label-md text-on-surface">{dest}</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">trending_up</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-white/10 rounded-xl font-label-sm text-on-surface hover:bg-white/5 transition-all">View Full Report</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
