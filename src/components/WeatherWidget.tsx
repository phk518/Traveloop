import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, [city]);

  const fetchWeather = async () => {
    try {
      // 1. Geocoding
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoRes.data.results[0];

      // 2. Forecast
      const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
      
      setWeather({
        maxTemp: Math.round(weatherRes.data.daily.temperature_2m_max[0]),
        minTemp: Math.round(weatherRes.data.daily.temperature_2m_min[0]),
        code: weatherRes.data.daily.weathercode[0]
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return 'wb_sunny';
    if (code >= 1 && code <= 3) return 'cloud';
    if (code === 45 || code === 48) return 'foggy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 86) return 'ac_unit';
    if (code >= 95) return 'thunderstorm';
    return 'partly_cloudy_day';
  };

  if (loading) return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 animate-pulse">
      <div className="w-4 h-4 rounded-full bg-white/20"></div>
      <div className="w-12 h-3 rounded bg-white/20"></div>
    </div>
  );

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 bg-surface-container-low/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 group hover:border-primary/40 transition-all cursor-default">
      <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
        {getWeatherIcon(weather.code)}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="font-label-md text-on-surface font-bold">{weather.maxTemp}°</span>
        <span className="text-[10px] text-on-surface-variant/60">/</span>
        <span className="font-label-sm text-on-surface-variant">{weather.minTemp}°</span>
      </div>
      <div className="w-[1px] h-3 bg-white/10 mx-1"></div>
      <span className="text-[10px] font-bold text-primary-fixed-dim uppercase tracking-tighter">Atmosphere Scan</span>
    </div>
  );
};

export default WeatherWidget;
