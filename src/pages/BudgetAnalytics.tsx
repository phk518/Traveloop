import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
  BarElement, Title, PointElement, LineElement
} from 'chart.js';

import { CURRENCIES } from '../constants/currencies';
import { fetchExchangeRate } from '../services/currencyService';
import { calculateBudgetStats } from '../utils/budgetUtils';
import { Trip } from '../types';
import TripDetailNav from '../components/TripDetailNav';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
  BarElement, Title, PointElement, LineElement
);

const BudgetAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('JPY');
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:3001/api/trips/${id}/full`);
        setTrip(res.data);
      } catch (err) {
        console.error('Error fetching trip details', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    const updateRate = async () => {
      const newRate = await fetchExchangeRate(selectedCurrency);
      setRate(newRate);
    };
    updateRate();
  }, [selectedCurrency]);

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div className="flex-center min-h-screen text-on-surface">Trip not found</div>;

  const { total, categories, daily } = calculateBudgetStats(trip, rate);
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0][0];

  const currencyMeta = CURRENCIES[selectedCurrency];

  // Chart Configurations (Extracted for readability)
  const doughnutData = getDoughnutData(categories);
  const doughnutOptions = getDoughnutOptions(currencyMeta.symbol);
  const barData = getBarData(daily, selectedCurrency);
  const barOptions = getBarOptions(currencyMeta.symbol);

  return (
    <div className="animate-fade-in pb-32">
      <BudgetHeader 
        selectedCurrency={selectedCurrency} 
        onCurrencyChange={setSelectedCurrency} 
        navigate={navigate} 
      />

      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Budget & Analytics</h2>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">{trip.name} Expedition</p>
          </div>
          {rate !== 1 && (
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-outline-variant uppercase tracking-widest">Rate</p>
              <p className="text-label-sm text-primary font-bold">1 JPY = {rate.toFixed(4)} {selectedCurrency}</p>
            </div>
          )}
        </div>

        <TotalCostCard total={total} currency={currencyMeta} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <CategoryBreakdown 
            data={doughnutData} 
            options={doughnutOptions} 
            categories={sortedCategories} 
            topCategory={topCategory} 
          />
          <DailySpending 
            data={barData} 
            options={barOptions} 
            hasData={daily.length > 0} 
          />
        </div>

        { (total / rate) > 50000 && <BudgetAlert topCategory={topCategory} /> }
      </main>

      <TripDetailNav tripId={id!} activeTab="budget" />
    </div>
  );
};

// --- Sub-components (To be extracted further if file grows) ---

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="text-primary font-headline-md animate-pulse">Analyzing Cosmic Expenses...</span>
  </div>
);

const BudgetHeader = ({ selectedCurrency, onCurrencyChange, navigate }: any) => (
  <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/30 backdrop-blur-xl border-b border-white/10">
    <div className="flex items-center gap-4">
      <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
        <span className="material-symbols-outlined text-primary">arrow_back</span>
      </button>
      <h1 className="font-headline-md text-headline-md font-bold text-primary">Traveloop</h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-white/5 border border-white/10 rounded-full px-2 py-1 flex items-center gap-1">
        {Object.keys(CURRENCIES).map(c => (
          <button 
            key={c}
            onClick={() => onCurrencyChange(c)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${selectedCurrency === c ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  </header>
);

const TotalCostCard = ({ total, currency }: any) => (
  <section className="glass-panel rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Total Estimated Expenses</p>
    <h3 className="font-display-lg text-[48px] md:text-[64px] accent-text-gradient py-2 font-bold">
      {currency.symbol}{total.toLocaleString(undefined, { minimumFractionDigits: currency.symbol === '¥' ? 0 : 2, maximumFractionDigits: currency.symbol === '¥' ? 0 : 2 })}
    </h3>
    <div className="flex items-center gap-2 mt-2">
      <span className="material-symbols-outlined text-primary text-sm">payments</span>
      <p className="font-label-sm text-label-sm text-primary">Values converted to {currency.name}</p>
    </div>
  </section>
);

const CategoryBreakdown = ({ data, options, categories, topCategory }: any) => (
  <section className="glass-panel rounded-xl p-6 lg:col-span-1">
    <div className="flex items-center justify-between mb-8">
      <h4 className="font-headline-md text-headline-md text-on-surface">Category Breakdown</h4>
      <span className="material-symbols-outlined text-on-surface-variant">pie_chart</span>
    </div>
    <div className="relative w-full h-64 flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-label-sm text-label-sm text-on-surface-variant text-center uppercase tracking-wider">Top</span>
        <span className="font-headline-md text-headline-md">{topCategory}</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-8">
      {categories.map(([cat, cost]: any, idx: number) => (
        <div key={cat} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.datasets[0].backgroundColor[idx] }}></div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{cat}</span>
        </div>
      ))}
    </div>
  </section>
);

const DailySpending = ({ data, options, hasData }: any) => (
  <section className="glass-panel rounded-xl p-6 lg:col-span-2">
    <div className="flex items-center justify-between mb-8">
      <h4 className="font-headline-md text-headline-md text-on-surface">Daily Spending</h4>
      <span className="material-symbols-outlined text-on-surface-variant">bar_chart</span>
    </div>
    <div className="h-64 px-2">
      {hasData ? (
        <Bar data={data} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center opacity-30 italic">No activity data yet</div>
      )}
    </div>
  </section>
);

const BudgetAlert = ({ topCategory }: any) => (
  <section className="space-y-4">
    <h4 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
      <span className="material-symbols-outlined text-error">notification_important</span>
      Critical Alerts
    </h4>
    <div className="glass-panel red-glow border-error/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
      <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-on-error-container">warning</span>
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <h5 className="font-headline-md text-headline-md text-error">Over Budget: {topCategory}</h5>
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">Alert active</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          Your spending in the <strong className="text-error">{topCategory}</strong> category has significantly exceeded the projected average.
        </p>
      </div>
    </div>
  </section>
);



// --- Helpers ---

const getDoughnutData = (categories: any) => ({
  labels: Object.keys(categories),
  datasets: [{
    data: Object.values(categories),
    backgroundColor: [
      'rgba(160, 120, 255, 0.8)', 'rgba(170, 2, 102, 0.8)', 'rgba(244, 190, 66, 0.8)',
      'rgba(0, 229, 255, 0.8)', 'rgba(255, 255, 255, 0.1)',
    ],
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    hoverOffset: 15,
  }]
});

const getDoughnutOptions = (symbol: string) => ({
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(26, 28, 30, 0.9)',
      callbacks: { label: (context: any) => ` ${symbol}${context.raw.toLocaleString()}` }
    }
  },
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: false,
});

const getBarData = (daily: any, currency: string) => ({
  labels: daily.map((d: any) => d.label),
  datasets: [{
    label: `Daily Cost (${currency})`,
    data: daily.map((d: any) => d.cost),
    backgroundColor: 'rgba(160, 120, 255, 0.5)',
    hoverBackgroundColor: 'rgba(160, 120, 255, 0.9)',
    borderRadius: 12,
  }]
});

const getBarOptions = (symbol: string) => ({
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(26, 28, 30, 0.9)',
      callbacks: { label: (context: any) => ` ${symbol}${context.raw.toLocaleString()}` }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
      ticks: { 
        color: 'rgba(255, 255, 255, 0.4)', 
        callback: (val: any) => `${symbol}${val.toLocaleString()}`
      }
    },
    x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.4)' } }
  },
  responsive: true,
  maintainAspectRatio: false,
});

export default BudgetAnalytics;
