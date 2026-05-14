import { Trip } from '../types';

export interface BudgetStats {
  total: number;
  categories: Record<string, number>;
  daily: { label: string; cost: number }[];
}

export const calculateBudgetStats = (trip: Trip | null, rate: number): BudgetStats => {
  if (!trip || !trip.stops) return { total: 0, categories: {}, daily: [] };

  let total = 0;
  const categories: Record<string, number> = { Transport: 0, Stay: 0, Activities: 0, Meals: 0, Other: 0 };
  const dailyMap: Record<string, number> = {};

  trip.stops.forEach((stop, sIdx) => {
    const stopKey = stop.city_name || `Day ${sIdx + 1}`;
    dailyMap[stopKey] = 0;
    
    stop.activities?.forEach(activity => {
      const cost = (activity.cost || 0) * rate;
      total += cost;
      
      const type = activity.type || 'Other';
      if (categories.hasOwnProperty(type)) {
        categories[type] += cost;
      } else if (type === 'Sightseeing' || type === 'Experience') {
        categories.Activities += cost;
      } else if (type === 'Dining') {
        categories.Meals += cost;
      } else {
        categories.Other += cost;
      }

      dailyMap[stopKey] += cost;
    });
  });

  const daily = Object.entries(dailyMap).map(([label, cost]) => ({ label, cost }));

  return { total, categories, daily };
};
