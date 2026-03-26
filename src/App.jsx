import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';
import RecentSearches from './components/RecentSearches';
import HistoryChart from './components/HistoryChart';
import { 
  fetchCoordinatesByCity, 
  fetchWeatherByCoordinates, 
  fetchForecastByCoordinates,
  fetchHistoricalWeather
} from './services/weatherApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weatherRecentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
    // Optionally: fetch default city or user location here
    // handleSearch('London'); 
  }, []);

  const saveRecentSearch = (weatherData) => {
    setRecentSearches(prev => {
      // Remove if exists to push to front
      const filtered = prev.filter(item => item.id !== weatherData.id);
      const updated = [weatherData, ...filtered].slice(0, 5); // Keep max 5
      localStorage.setItem('weatherRecentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const geoData = await fetchCoordinatesByCity(cityName);
      const { lat, lon } = geoData;

      const [weatherData, forecastData, historyData] = await Promise.all([
        fetchWeatherByCoordinates(lat, lon),
        fetchForecastByCoordinates(lat, lon),
        fetchHistoricalWeather(lat, lon)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setHistory(historyData);
      saveRecentSearch(weatherData);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-sky-900 to-slate-900 overflow-x-hidden selection:bg-blue-500/30">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
            Atmosphere
          </h1>
          <p className="text-blue-200/80 mb-8 max-w-md mx-auto">
            Discover real-time weather and 5-day forecasts for any location worldwide.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Global Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-2xl backdrop-blur-sm text-center shadow-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center my-16">
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Main Content Area */}
        {!loading && weather && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            <CurrentWeather weather={weather} />
            <HistoryChart historyData={history} />
            <ForecastWeather forecast={forecast} />
          </div>
        )}

        {/* Empty State / Welcome Screen */}
        {!loading && !weather && recentSearches.length === 0 && !error && (
          <div className="text-center mt-20 text-white/50 bg-white/5 mx-auto max-w-lg p-12 rounded-3xl border border-white/10 glass-dark">
            <div className="text-6xl mb-4">🌦️</div>
            <p className="text-xl font-medium text-white/80">Ready to explore?</p>
            <p className="mt-2 text-sm">Enter a city name above to get detailed weather conditions.</p>
          </div>
        )}

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <div className="mt-16">
            <RecentSearches searches={recentSearches} onSelect={handleSearch} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
