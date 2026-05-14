import axios from 'axios';

export const fetchExchangeRate = async (toCurrency: string): Promise<number> => {
  if (toCurrency === 'JPY') return 1;
  try {
    const res = await axios.get(`https://api.frankfurter.app/latest?from=JPY&to=${toCurrency}`);
    return res.data.rates[toCurrency];
  } catch (err) {
    console.error(`Error fetching exchange rate for ${toCurrency}:`, err);
    return 1; // Fallback to 1
  }
};
