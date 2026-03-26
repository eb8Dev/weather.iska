const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchWeatherByCoordinates = async (lat, lon) => {
  if (!API_KEY) throw new Error('API Key is missing');
  const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
};

export const fetchForecastByCoordinates = async (lat, lon) => {
  if (!API_KEY) throw new Error('API Key is missing');
  const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error('Failed to fetch forecast data');
  return res.json();
};

export const fetchCoordinatesByCity = async (cityName) => {
  if (!API_KEY) throw new Error('API Key is missing');
  const res = await fetch(`${GEO_URL}/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch coordinates');
  const data = await res.json();
  if (data.length === 0) throw new Error('City not found');
  return data[0]; // Returns { name, lat, lon, country, state }
};

export const fetchWeatherByCityId = async (id) => {
  if (!API_KEY) throw new Error('API Key is missing');
  const res = await fetch(`${BASE_URL}/weather?id=${id}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
};

export const fetchHistoricalWeather = async (lat, lon) => {
  // Use Open-Meteo for free historical weather data (last 7 days)
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  
  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() - 7);
  const startDate = startDateObj.toISOString().split('T')[0];

  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`
  );
  if (!res.ok) throw new Error('Failed to fetch historical weather');
  return res.json();
};
